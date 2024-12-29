import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/firestore";
import {adminDb, notifyUsers} from "./utils";

/**
 * Send notifications when a new event is created.
 * @param {FirestoreEvent<
 *   QueryDocumentSnapshot | undefined,
 *   { docId: string }
 * >} e - The Firestore event containing event details.
 * @return {Promise<void>}
 */
export async function sendNewEventNotifications(
  e: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {
      docId: string;
    }
  >
) {
  const newEventId = e.params.docId;
  const newEventData = e.data?.data();

  if (!newEventData) {
    console.error("No event data found.");
    return;
  }

  console.log("A new event was created:", newEventId);

  try {
    // notify Jude
    const judeMessage = {
      title: "sendNewEventNotifications function just ran",
      body: "admin message",
      url: null,
    };

    notifyUsers({
      userIds: ["6pHYz7jcr7WoqoRWcnIXEn0Y1bm1"],
      notification: judeMessage,
    });

    const authorDoc = await adminDb
      .doc(`users/${newEventData.creatorId}`)
      .get();
    const author = authorDoc.data();

    if (!author) {
      console.error(
        "No author data found for the event, no notifications sent."
      );
      return;
    }

    const notification = {
      title: `New event: ${newEventData.title}`,
      body: `${author.firstName} ${author.lastName} created an event.`,
      url: `/events/${newEventId}`,
    };
    // Notify all other users
    const allUsersSnapshot = await adminDb.collection("users").get();
    const otherUsers = allUsersSnapshot.docs.filter(
      (doc) => doc.id !== newEventData.authorId
    );

    const userIds = otherUsers.map((doc) => doc.id);

    await notifyUsers({userIds, notification});

    console.log("New event notifications sent successfully.");
  } catch (error) {
    console.error("Error sending event notifications:", error);
  }
}
