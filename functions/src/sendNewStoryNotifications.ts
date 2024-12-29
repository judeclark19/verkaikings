import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/firestore";
import {adminDb, notifyUsers} from "./utils";

/**
 * Send notifications when a new story is created.
 * @param {FirestoreEvent<
 *   QueryDocumentSnapshot | undefined,
 *   { docId: string }
 * >} e
 * @return {Promise<void>}
 */
export async function sendNewStoryNotifications(
  e: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {
      docId: string;
    }
  >
) {
  const newStoryId = e.params.docId;
  const newStoryData = e.data?.data();

  if (!newStoryData) {
    console.error("No story data found in the event.");
    return;
  }

  console.log("A new story was created:", newStoryId);

  try {
    // notify Jude
    const judeMessage = {
      title: "sendNewStoryNotifications function just ran",
      body: "admin message",
      url: null,
    };

    notifyUsers({
      userIds: ["6pHYz7jcr7WoqoRWcnIXEn0Y1bm1"],
      notification: judeMessage,
    });

    // Fetch the author's details
    const authorDoc = await adminDb.doc(`users/${newStoryData.authorId}`).get();
    const author = authorDoc.data();

    if (!author) {
      console.error("No author data found for the story.");
      return;
    }

    const nsnt = `New story by ${author.firstName} ${author.lastName}`;
    const nsnb = `${author.firstName} shared their Willemijn story.`;
    const nsnUrl = `/profile/${author.username}?notif=my-willemijn-story`;

    // Notify all other users
    const allUsersSnapshot = await adminDb.collection("users").get();
    const otherUsers = allUsersSnapshot.docs.filter(
      (doc) => doc.id !== newStoryData.authorId
    );

    const userIds = otherUsers.map((doc) => doc.id);
    await notifyUsers({
      userIds,
      notification: {
        title: nsnt,
        body: nsnb,
        url: nsnUrl,
      },
    });
  } catch (error) {
    console.error("Error sending story notifications:", error);
  }
}
