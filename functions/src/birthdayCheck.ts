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
    const allUsersSnapshot = await adminDb.collection("users").get();

    for (const userDoc of allUsersSnapshot.docs) {
      const userData = userDoc.data();
      const birthday = userData.birthday || null;

      if (!birthday) continue;

      const isMonthDayOnly = birthday.startsWith("--");
      let year; let month; let day;

      if (isMonthDayOnly) {
        month = birthday.split("-")[2];
        day = birthday.split("-")[3];
        year = null;
      } else {
        year = birthday.split("-")[0];
        month = birthday.split("-")[1];
        day = birthday.split("-")[2];
      }

      if (parseInt(month) === todayMonth && parseInt(day) === todayDay) {
        console.log("Send birthday notifiactions for user:", userData.username);

        // notify Jude
        const judeMessage = {
          title: `birthday notifs sent for ${userData.username}`,
          body: "admin message",
          url: null,
        };

        notifyUsers({
          userIds: ["6pHYz7jcr7WoqoRWcnIXEn0Y1bm1"],
          notification: judeMessage,
        });

        const messageTitle = isMonthDayOnly ?
          "Happy Birthday!" :
          `Happy ${getOrdinal(todayYear - parseInt(year))} Birthday!`;

        const birthdayMessage = {
          title: messageTitle,
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

        const messageBody = isMonthDayOnly ?
          `It's ${userData.firstName}'s birthday today.` :
          `It's ${userData.firstName} ${userData.lastName}'s ${getOrdinal(
            todayYear - parseInt(year)
          )} birthday today.`;

        const generalMessage = {
          title: `Happy birthday to ${userData.firstName}`,
          body: messageBody,
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
