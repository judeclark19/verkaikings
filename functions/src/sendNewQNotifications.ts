import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/firestore";
import {adminDb, notifyUsers} from "./utils";

/**
 * Send notifications when a new QandA is created.
 * @param {FirestoreEvent<
 *   QueryDocumentSnapshot | undefined,
 *   { docId: string }
 * >} e - The Firestore event containing QandA details.
 * @return {Promise<void>}
 */
export async function sendNewQNotifications(
  e: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {
      docId: string;
    }
  >
) {
  const newQId = e.params.docId;
  const newQData = e.data?.data();

  if (!newQData) {
    console.error("No QandA data found.");
    return;
  }

  console.log("A new QandA was created:", newQId);

  try {
    const authorDoc = await adminDb.doc(`users/${newQData.creatorId}`).get();
    const author = authorDoc.data();

    if (!author) {
      console.error(
        "No author data found for the event, no notifications sent."
      );
      return;
    }

    const notification = {
      title: `New question: ${newQData.question}`,
      body: `${author.firstName} ${author.lastName} asked a question.`,
      url: `/qanda?notif=${newQId}`,
    };
    // Notify all other users
    const allUsersSnapshot = await adminDb.collection("users").get();
    const otherUsers = allUsersSnapshot.docs.filter(
      (doc) => doc.id !== newQData.creatorId
    );

    const userIds = otherUsers.map((doc) => doc.id);

    await notifyUsers({userIds, notification});

    console.log("New QandA notifications sent successfully.");
  } catch (error) {
    console.error("Error sending QandA notifications:", error);
  }
}
