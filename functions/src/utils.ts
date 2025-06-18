import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

export const adminDb = getFirestore();
export const adminMessaging = getMessaging();

/**
 * Fetch the FCM tokens for a user.
 * @param {string} userId - The user ID to fetch tokens for.
 * @return {Promise<string[]>} The user's FCM tokens.
 */
export async function fetchUserTokens(userId: string) {
  try {
    const tokensSnapshot = await adminDb
      .collection(`users/${userId}/fcmTokens`)
      .get();
    console.log("tokensSnapshot", tokensSnapshot.docs.length);
    return tokensSnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error(`Error fetching tokens for user ${userId}:`, error);
    return [];
  }
}

/**
 * Send push notifications via FCM.
 * @param {string[]} tokens - The FCM tokens to send the notifications to.
 * @param {object} message - The notification message.
 */
export async function sendPushNotifications(
  tokens: string[],
  message: {
    title: string;
    body: string;
    icon?: string;
    url: string | null;
  }
) {
  if (tokens.length === 0) return;

  const payload = {
    webpush: {
      notification: {
        title: message.title,
        body: message.body,
        icon: message.icon || "/favicon-32x32_v2.png"
      },
      fcm_options: {
        link: message.url || "/"
      }
    },
    tokens
  };

  return adminMessaging.sendEachForMulticast(payload);
}

/**
 * Create a batch operation to add notifications for multiple users.
 * @param {string[]} userIds - The user IDs to add notifications for.
 * @param {object} notification - The notification message.
 */
export async function addNotificationsBatch(
  userIds: string[],
  notification: {
    title: string;
    body: string;
    url: string | null;
  }
) {
  console.log("add notifications batch:", userIds);
  const batch = adminDb.batch();
  userIds.forEach((userId) => {
    const notificationRef = adminDb
      .collection(`users/${userId}/notifications`)
      .doc();
    batch.set(notificationRef, {
      ...notification,
      createdAt: Timestamp.now(),
      read: false
    });
  });
  await batch.commit();
}

/**
 * Notify multiple users with a message.
 * @param {object} options - The notification options.
 * @param {string[]} options.userIds - The user IDs to notify.
 * @param {object} options.notification - The notification message.
 * @return {Promise<void>}
 */
export async function notifyUsers({
  userIds,
  notification
}: {
  userIds: string[];
  notification: { title: string; body: string; url: string | null };
}) {
  await addNotificationsBatch(userIds, notification);

  const tokens = (
    await Promise.all(
      userIds.map((id) => fetchUserTokens(id).then((t) => t || []))
    )
  ).flat();

  await sendPushNotifications(tokens, notification);
}
