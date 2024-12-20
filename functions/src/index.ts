import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

const adminDb = getFirestore();
const adminMessaging = getMessaging();

exports.sendWelcomeNotifications = onDocumentCreated(
  "users/{docId}",
  async (event) => {
    const newUserId = event.params.docId;
    const newUserData = event.data?.data();

    if (!newUserData) {
      console.error("No user data found in the event.");
      return;
    }

    console.log("A new user was created:", newUserId);

    try {
      // Store the notification in Firestore

      const welcomeNotificationDoc = {
        title: "Welcome to the Verkaikings Society app!",
        body: `Hi ${newUserData.firstName}, thank you for signing up!`,
        createdAt: Timestamp.now(),
        read: false
      };
      await adminDb
        .collection(`users/${newUserId}/notifications`)
        .add(welcomeNotificationDoc);

      // check for FCM tokens
      const newUserTokensSnapshot = await adminDb
        .collection(`users/${newUserId}/fcmTokens`)
        .get();

      const newUserTokens = newUserTokensSnapshot.docs.map((doc) => doc.id);

      if (newUserTokens.length === 0) {
        console.log(
          `No FCM tokens found for new user ${newUserId}. Skipping push notification.`
        );
      } else {
        console.log(
          `Found ${newUserTokens.length} FCM tokens for new user ${newUserId}. Sending welcome notification.`
        );

        const message = {
          webpush: {
            notification: {
              title: "Welcome to our community!",
              body: `Hi ${newUserData.firstName}, thank you for signing up!`,
              icon: "/favicon-32x32.png"
            },
            fcm_options: {
              link: "/welcome"
            }
          },
          tokens: newUserTokens
        };

        const response = await adminMessaging.sendEachForMulticast(message);

        console.log(
          `Welcome notification sent to ${response.successCount} devices.`
        );
        console.log(
          `${response.failureCount} devices failed to receive the welcome notification.`
        );
      }

      // ALL OTHER USERS ============================================

      const allUsersSnapshot = await adminDb.collection("users").get();
      const otherUserTokens: string[] = [];

      // firestore
      for (const doc of allUsersSnapshot.docs) {
        if (doc.id !== newUserId) {
          // Add a notification to each user's subcollection
          await adminDb.collection(`users/${doc.id}/notifications`).add({
            title: `${newUserData.firstName} ${newUserData.lastName} just signed up!`,
            body: `Click to see their profile.`,
            url: `/profile/${newUserData.displayName}`,
            createdAt: Timestamp.now(),
            read: false
          });

          const tokensSnapshot = await adminDb
            .collection(`users/${doc.id}/fcmTokens`)
            .get();

          const tokens = tokensSnapshot.docs.map((tokenDoc) => tokenDoc.id);
          otherUserTokens.push(...tokens);
        }
      }

      // pushes
      if (otherUserTokens.length > 0) {
        const announcementMessage = {
          webpush: {
            notification: {
              title: `Welcome, ${newUserData.firstName}!`,
              body: `${newUserData.firstName} ${newUserData.lastName} just signed up.`,
              icon: "/favicon-32x32.png"
            },
            fcm_options: {
              link: `/profile/${newUserId}`
            }
          },
          tokens: otherUserTokens
        };

        const announcementResponse = await adminMessaging.sendEachForMulticast(
          announcementMessage
        );

        console.log(
          `Announcement notification sent to ${announcementResponse.successCount} devices.`
        );
        console.log(
          `${announcementResponse.failureCount} devices failed to receive the announcement notification.`
        );
      } else {
        console.log("No FCM tokens found for other users.");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }
);

exports.sendNewStoryNotifications = onDocumentCreated(
  "myWillemijnStories/{docId}",
  async (event) => {
    const newStoryId = event.params.docId;
    const newStoryData = event.data?.data();

    if (!newStoryData) {
      console.error("No story data found in the event.");
      return;
    }

    console.log("A new story was created:", newStoryId);

    try {
      const authorDoc = await adminDb.doc(`users/${newStoryId}`).get();
      const authorData = authorDoc.data();
      if (!authorData) {
        console.error(
          "No author data found in the event, no notifications sent."
        );
        return;
      }

      // NOTIFICATION GOES TO ALL OTHER USERS ============================================

      const allUsersSnapshot = await adminDb.collection("users").get();
      const otherUserTokens: string[] = [];

      // firestore
      for (const userDoc of allUsersSnapshot.docs) {
        if (userDoc.id !== newStoryId) {
          // Add a notification to each user's subcollection
          await adminDb.collection(`users/${userDoc.id}/notifications`).add({
            title: `New story by ${authorData.firstName} ${authorData.lastName}`,
            body: `${authorData.firstName} shared their Willemijn story.`,
            url: `/profile/${newStoryData.displayName}?notif=my-willemijn-story`,
            createdAt: Timestamp.now(),
            read: false
          });

          const tokensSnapshot = await adminDb
            .collection(`users/${userDoc.id}/fcmTokens`)
            .get();

          const tokens = tokensSnapshot.docs.map((tokenDoc) => tokenDoc.id);
          otherUserTokens.push(...tokens);
        }
      }

      // pushes
      if (otherUserTokens.length > 0) {
        const announcementMessage = {
          webpush: {
            notification: {
              title: `New story by ${authorData.firstName} ${authorData.lastName}`,
              body: `${authorData.firstName} shared their Willemijn story.`,
              icon: "/favicon-32x32.png"
            },
            fcm_options: {
              link: `/profile/${newStoryData.displayName}?notif=my-willemijn-story`
            }
          },
          tokens: otherUserTokens
        };

        const announcementResponse = await adminMessaging.sendEachForMulticast(
          announcementMessage
        );

        console.log(
          `New Story notification sent to ${announcementResponse.successCount} devices.`
        );
        console.log(
          `${announcementResponse.failureCount} devices failed to receive the new story notification.`
        );
      } else {
        console.log("No FCM tokens found for other users.");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }
);
