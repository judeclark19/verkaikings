import { PhoneNumberUtil } from "google-libphonenumber";

export function formatFullBirthday(input: string) {
  // Detect the user's locale or default to "en"
  const userLocale = navigator.language || "en";

  // Check if the input is a month/day format (`--MM-DD`)
  const isMonthDayOnly = input.startsWith("--");

  let date: Date;

  if (isMonthDayOnly) {
    // Extract month and day from the input
    const currentYear = new Date().getFullYear(); // Use the current year for display
    date = new Date(
      `${currentYear}-${input.split("-")[2]}-${input.split("-")[3]}T00:00:00`
    );
  } else {
    // Parse full date (with year)
    date = new Date(`${input}T00:00:00`);
  }

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric"
  };

  // Add "year" to the format options if the input contains a year
  if (!isMonthDayOnly) {
    options.year = "numeric";
  }

  return date.toLocaleDateString(userLocale, options).replace(/,/g, ", ");
}

export function formatBirthday2digit(input: string) {
  let birthday = addYearToBirthday(input);

  // Parse the input string into a Date object
  const date = new Date(`${birthday}T00:00:00`);

  // Detect the user's locale or default to "en"
  const userLocale = navigator.language || "en";

  // Format the date using toLocaleDateString with the detected locale
  return date
    .toLocaleDateString(userLocale, { month: "2-digit", day: "2-digit" })
    .replace(/,/g, ", ");
}

export function checkIfBirthdayToday(birthday: string) {
  if (!birthday) return false;

  let userBirthday = addYearToBirthday(birthday);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = userBirthday.split("-")[1];
  const userBirthdayDay = userBirthday.split("-")[2];

  const isToday =
    parseInt(userBirthdayMonth) === todayMonth &&
    parseInt(userBirthdayDay) === todayDay;

  return isToday;
}

export function checkIfBirthdayRecent(birthday: string) {
  if (!birthday) return false;

  let userBirthday = addYearToBirthday(birthday);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = parseInt(userBirthday.split("-")[1]);
  const userBirthdayDay = parseInt(userBirthday.split("-")[2]);

  const birthdayThisYear = new Date(
    today.getFullYear(),
    userBirthdayMonth - 1,
    userBirthdayDay
  );
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Check if the birthday is within the last 7 days but not today
  return (
    birthdayThisYear < today &&
    birthdayThisYear >= sevenDaysAgo &&
    !(
      birthdayThisYear.getDate() === todayDay &&
      birthdayThisYear.getMonth() + 1 === todayMonth
    )
  );
}

export function addYearToBirthday(birthday: string) {
  if (!birthday) return "";

  if (birthday.startsWith("--")) {
    const currentYear = new Date().getFullYear();
    return `${currentYear}${birthday.slice(1)}`;
  }

  return birthday;
}

export function checkIfBirthdaySoon(birthday: string) {
  if (!birthday) return false;

  let userBirthday = addYearToBirthday(birthday);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = parseInt(userBirthday.split("-")[1]);
  const userBirthdayDay = parseInt(userBirthday.split("-")[2]);

  const birthdayThisYear = new Date(
    today.getFullYear(),
    userBirthdayMonth - 1,
    userBirthdayDay
  );
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  // Check if the birthday is within the next 7 days but not today
  return (
    birthdayThisYear > today &&
    birthdayThisYear <= sevenDaysLater &&
    !(
      birthdayThisYear.getDate() === todayDay &&
      birthdayThisYear.getMonth() + 1 === todayMonth
    )
  );
}

const phoneUtil = PhoneNumberUtil.getInstance();

export function isPhoneValid(phone: string) {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error("Error validating phone number:", error);
    return false;
  }
}

export function cleanNameString(input: string) {
  return input
    .trim() // Remove leading and trailing spaces
    .normalize("NFD") // Normalize string to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove the accents
    .replace(/\s+/g, "_"); // Replace internal spaces with underscores
}

export const deleteQueryParam = () => {
  const currentParams = new URLSearchParams(window.location.search);
  currentParams.delete("query");
  const newPath = `${window.location.pathname}?${currentParams.toString()}`;
  window.history.pushState({}, "", newPath);
};

export const sendNotification = async (
  recipientId: string,
  title: string,
  body: string,
  url: string
) => {
  const response = await fetch("/api/notifications/sendNotification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-secret": process.env.NEXT_PUBLIC_APP_SECRET!
    },
    body: JSON.stringify({
      userId: recipientId,
      notification: {
        title,
        body,
        url
      }
    })
  });

  if (!response.ok) {
    // const errorData = await response.json();
    // console.error("Failed to send notification:", errorData.error);
    return;
  }
};

export const registerPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log(
      "Firebase Messaging Service Worker registered:",
      registration.scope
    );
  } catch (err) {
    console.error("Service Worker registration failed:", err);
  }
};
