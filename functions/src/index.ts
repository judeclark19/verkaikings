import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";

initializeApp();

const adminDb = getFirestore();
const adminMessaging = getMessaging();

exports.sendWelcomeNotifications = onDocumentCreated(
  "users/{docId}",
  async (event) => {
    const newUserId = event.params.docId;
    const newUser = event.data?.data();

    if (!newUser) {
      console.error("No user data found in the event.");
      return;
    }

    console.log("A new user was created:", newUserId);

    try {
      // Store the notification in Firestore
      const welcomeNotificationTitle = "Welcome to the Verkaikings Society app";
      const wnb = `Hi ${newUser.firstName}, thank you for signing up!`;

      await adminDb.collection(`users/${newUserId}/notifications`).add({
        title: welcomeNotificationTitle,
        body: wnb,
        createdAt: Timestamp.now(),
        read: false,
      });

      // check for FCM tokens
      const newUserTokensSnapshot = await adminDb
        .collection(`users/${newUserId}/fcmTokens`)
        .get();

      const newUserTokens = newUserTokensSnapshot.docs.map((doc) => doc.id);

      if (newUserTokens.length === 0) {
        console.log("No FCM tokens for new user, skipping push notifs.");
      } else {
        console.log(`${newUserTokens.length} FCM tokens for new user, pushing`);

        const message = {
          webpush: {
            notification: {
              title: welcomeNotificationTitle,
              body: wnb,
              icon: "/favicon-32x32.png",
            },
          },
          tokens: newUserTokens,
        };

        const response = await adminMessaging.sendEachForMulticast(message);

        console.log(
          `Welcome notification sent to ${response.successCount} devices.`
        );
        console.log(`Welcome notif failure count: ${response.failureCount}`);
      }

      // ALL OTHER USERS ============================================

      const allUsersSnapshot = await adminDb.collection("users").get();
      const otherUserTokens: string[] = [];

      // firestore
      const nsunt = `${newUser.firstName} ${newUser.lastName} just signed up`;
      const newSignUpNotificationBody = "Click to see their profile.";
      const newSignUpNotificationUrl = `/profile/${newUser.username}`;
      for (const doc of allUsersSnapshot.docs) {
        if (doc.id !== newUserId) {
          // Add a notification to each user's subcollection
          await adminDb.collection(`users/${doc.id}/notifications`).add({
            title: nsunt,
            body: newSignUpNotificationBody,
            url: newSignUpNotificationUrl,
            createdAt: Timestamp.now(),
            read: false,
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
              title: nsunt,
              body: newSignUpNotificationBody,
              icon: "/favicon-32x32.png",
            },
            fcm_options: {
              link: newSignUpNotificationUrl,
            },
          },
          tokens: otherUserTokens,
        };

        const res = await adminMessaging.sendEachForMulticast(
          announcementMessage
        );

        console.log(
          `Announcement notification sent to ${res.successCount} devices.`
        );
        console.log(
          `${res.failureCount} failed to receive announcement notif.`
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
      const author = authorDoc.data();
      if (!author) {
        console.error(
          "No author data found in the event, no notifications sent."
        );
        return;
      }

      // NOTIFICATION GOES TO ALL OTHER USERS ==================================

      const allUsersSnapshot = await adminDb.collection("users").get();
      const otherUserTokens: string[] = [];

      // firestore
      const nsnt = `New story by ${author.firstName} ${author.lastName}`;
      const nsnb = `${author.firstName} shared their Willemijn story.`;
      const nsnUrl = `/profile/${author.username}?notif=my-willemijn-story`;

      for (const userDoc of allUsersSnapshot.docs) {
        if (userDoc.id !== newStoryId) {
          // Add a notification to each user's subcollection
          await adminDb.collection(`users/${userDoc.id}/notifications`).add({
            title: nsnt,
            body: nsnb,
            url: nsnUrl,
            createdAt: Timestamp.now(),
            read: false,
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
              title: nsnt,
              body: nsnb,
              icon: "/favicon-32x32.png",
            },
            fcm_options: {
              link: nsnUrl,
            },
          },
          tokens: otherUserTokens,
        };

        const response = await adminMessaging.sendEachForMulticast(
          announcementMessage
        );

        console.log(
          `New Story notification sent to ${response.successCount} devices.`
        );
        console.log(
          `${response.failureCount} failed to receive new story notif.`
        );
      } else {
        console.log("No FCM tokens found for other users.");
      }
    } catch (error) {
      console.error("Error sending story notifications:", error);
    }
  }
);

/**
 * Helper function to get the ordinal suffix of a number.
 *
 * @param {number} num - The number to get the ordinal suffix for.
 * @return {string} The number with its ordinal suffix (e.g., "1st", "2nd").
 */
function getOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = num % 100;

  const suffix =
    remainder >= 11 && remainder <= 13 ? "th" : suffixes[num % 10] || "th";

  return `${num}${suffix}`;
}

/**
 * Check for birthdays and send notifications
 * @return {Promise<void>}
 */
async function runBirthdayCheck() {
  const today = new Date();
  console.log("Checking for birthdays", today);
  const todayMonth = today.getMonth() + 1; // January is 0
  const todayDay = today.getDate();
  const todayYear = today.getFullYear();

  const allUsersSnapshot = await adminDb.collection("users").get();

  allUsersSnapshot.forEach(async (userDoc) => {
    const bdayUData = userDoc.data();
    const birthday = bdayUData.birthday;

    if (!birthday) return;

    const [year, month, day] = birthday.split("-");
    if (parseInt(month) === todayMonth && parseInt(day) === todayDay) {
      console.log(`It's ${bdayUData.firstName}'s birthday`);
      const age = todayYear - parseInt(year);

      try {
        // BIRTHDAY USER ============================================
        const birthdayUserNotificationTitle = `Happy ${getOrdinal(
          age
        )} Birthday!`;
        const bunb = "Wishing you a fantastic day!";
        // Store the notification in Firestore
        await adminDb.collection(`users/${userDoc.id}/notifications`).add({
          title: birthdayUserNotificationTitle,
          body: bunb,
          createdAt: Timestamp.now(),
          read: false,
        });

        // check for FCM tokens
        const birthdayUserTokensSnapshot = await adminDb
          .collection(`users/${userDoc.id}/fcmTokens`)
          .get();

        const birthdayUserTokens = birthdayUserTokensSnapshot.docs.map(
          (doc) => doc.id
        );

        if (birthdayUserTokens.length > 0) {
          const message = {
            webpush: {
              notification: {
                title: birthdayUserNotificationTitle,
                body: bunb,
                icon: "/favicon-32x32.png",
              },
            },
            tokens: birthdayUserTokens,
          };

          await adminMessaging.sendEachForMulticast(message);
        } else {
          console.log("No tokens found for bday user");
        }

        // ALL OTHER USERS ============================================
        const ount = `Happy birthday to ${bdayUData.firstName}`;
        const otherUsersNotificationBody = `It's ${bdayUData.firstName} ${
          bdayUData.lastName
        }'s ${getOrdinal(age)} birthday today.`;
        const ounUrl = `/profile/${bdayUData.username}`;

        for (const otherUserDoc of allUsersSnapshot.docs) {
          if (otherUserDoc.id !== userDoc.id) {
            // Add a notification to each user's subcollection
            await adminDb
              .collection(`users/${otherUserDoc.id}/notifications`)
              .add({
                title: ount,
                body: otherUsersNotificationBody,
                createdAt: Timestamp.now(),
                read: false,
                url: ounUrl,
              });

            // push notifications

            const otherUserTokensSnapshot = await adminDb
              .collection(`users/${otherUserDoc.id}/fcmTokens`)
              .get();

            const otherUserTokens = otherUserTokensSnapshot.docs.map(
              (doc) => doc.id
            );

            if (otherUserTokens.length > 0) {
              const message = {
                webpush: {
                  notification: {
                    title: ount,
                    otherUsersNotificationBody,
                    icon: "/favicon-32x32.png",
                  },
                  fcm_options: {
                    link: ounUrl,
                  },
                },
                tokens: otherUserTokens,
              };

              await adminMessaging.sendEachForMulticast(message);
            } else {
              console.log(
                `No FCM tokens found for ${
                  otherUserDoc.data().firstName
                }. Skipping push notification`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error sending birthday notifications:", error);
      }
    }
  });
}

exports.birthdayCheck = onSchedule(
  {
    schedule: "every day 08:00",
    timeZone: "Europe/Berlin",
  },
  async () => {
    runBirthdayCheck();
  }
);

exports.sendNewEventNotifications = onDocumentCreated(
  "events/{docId}",
  async (e) => {
    const newEventId = e.params.docId;
    const newEventData = e.data?.data();

    if (!newEventData) {
      console.error("No event data found.");
      return;
    }

    console.log("A new event was created:", newEventId);

    try {
      const authorDoc = await adminDb
        .doc(`users/${newEventData.creatorId}`)
        .get();
      const author = authorDoc.data();
      if (!author) {
        console.error(
          "No author data found in the event, no notifications sent."
        );
        return;
      }

      // NOTIFICATION GOES TO ALL OTHER USERS ==================================

      const allUsersSnapshot = await adminDb.collection("users").get();
      const otherUserTokens: string[] = [];

      // firestore
      const nent = `New event: ${newEventData.title}`;
      const nenb = `${author.firstName} ${author.lastName} created an event.`;
      const nenUrl = `/events/${newEventId}`;

      for (const userDoc of allUsersSnapshot.docs) {
        if (userDoc.id !== newEventData.creatorId) {
          // Add a notification to each user's subcollection
          await adminDb.collection(`users/${userDoc.id}/notifications`).add({
            title: nent,
            body: nenb,
            url: nenUrl,
            createdAt: Timestamp.now(),
            read: false,
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
              title: nent,
              body: nenb,
              icon: "/favicon-32x32.png",
            },
            fcm_options: {
              link: nenUrl,
            },
          },
          tokens: otherUserTokens,
        };

        const response = await adminMessaging.sendEachForMulticast(
          announcementMessage
        );

        console.log(
          `New Event notification sent to ${response.successCount} devices.`
        );
        console.log(
          `${response.failureCount} failed to receive new event notif.`
        );
      } else {
        console.log("No FCM tokens found for other users.");
      }
    } catch (error) {
      console.error("Error sending event notifications:", error);
    }
  }
);
