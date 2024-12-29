import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/firestore";
import {adminDb, notifyUsers} from "./utils";

/**
 * Send notifications when a new user is created.
 * @param {FirestoreEvent<
 *   QueryDocumentSnapshot | undefined,
 *   { docId: string }
 * >} e
 * @return {Promise<void>}
 */
export async function sendWelcomeNotifications(
  e: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {
      docId: string;
    }
  >
) {
  const newUserId = e.params.docId;
  const newUser = e.data?.data();

  if (!newUser) {
    console.error("No user data found in the event.");
    return;
  }

  console.log("A new user was created:", newUserId);

  try {
    // Notify the new user
    const welcomeMessage = {
      title: "Welcome to the Verkaikings Society app",
      body: `Hi ${newUser.firstName}, thank you for signing up!`,
      url: null,
    };

    await notifyUsers({
      userIds: [newUserId],
      notification: welcomeMessage,
    });

    // Notify all other users
    const nsunt = `${newUser.firstName} ${newUser.lastName} just signed up`;
    const allUsersSnapshot = await adminDb.collection("users").get();
    const otherUsers = allUsersSnapshot.docs.filter(
      (doc) => doc.id !== newUserId
    );

    const userIds = otherUsers.map((doc) => doc.id);
    await notifyUsers({
      userIds,
      notification: {
        title: nsunt,
        body: "Click to see their profile.",
        url: `/profile/${newUser.username}`,
      },
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}
