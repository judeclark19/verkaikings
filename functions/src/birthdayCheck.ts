import {adminDb, notifyUsers} from "./utils";
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
export async function runBirthdayCheck() {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const todayYear = today.getFullYear();

  console.log("Checking for birthdays", today);

  try {
    // notify Jude
    const judeMessage = {
      title: "birthdayCheck function just ran",
      body: "admin message",
      url: null,
    };

    notifyUsers({
      userIds: ["6pHYz7jcr7WoqoRWcnIXEn0Y1bm1"],
      notification: judeMessage,
    });

    const allUsersSnapshot = await adminDb.collection("users").get();

    for (const userDoc of allUsersSnapshot.docs) {
      const userData = userDoc.data();
      const birthday = userData.birthday || null;

      if (!birthday) continue;

      const [year, month, day] = birthday.split("-");
      if (parseInt(month) === todayMonth && parseInt(day) === todayDay) {
        console.log("Send birthday notifiactions for user:", userData.username);

        const age = todayYear - parseInt(year);
        const birthdayMessage = {
          title: `Happy ${getOrdinal(age)} Birthday!`,
          body: "Wishing you a fantastic day!",
          url: null,
        };

        await notifyUsers({
          userIds: [userDoc.id],
          notification: birthdayMessage,
        });

        const otherUsers = allUsersSnapshot.docs
          .filter((doc) => doc.id !== userDoc.id)
          .map((doc) => doc.id);

        const generalMessage = {
          title: `Happy birthday to ${userData.firstName}`,
          body: `It's ${userData.firstName} ${userData.lastName}'s ${getOrdinal(
            age
          )} birthday today.`,
          url: `/profile/${userData.username}`,
        };

        await notifyUsers({
          userIds: otherUsers,
          notification: generalMessage,
        });
      }
    }
  } catch (error) {
    console.error("Error in birthday check:", error);
  }
}
