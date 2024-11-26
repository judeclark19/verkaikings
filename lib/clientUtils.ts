export function formatFullBirthday(input: string) {
  // Parse the input string into a Date object
  const date = new Date(`${input}T00:00:00`);

  // Detect the user's locale or default to "nl"
  const userLocale = navigator.language || "nl";

  // Format the date using toLocaleDateString with the detected locale
  return date
    .toLocaleDateString(userLocale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    .replace(/,/g, ", ");
}

export function formatBirthday2digit(input: string) {
  // Parse the input string into a Date object
  const date = new Date(`${input}T00:00:00`);

  // Detect the user's locale or default to "nl"
  const userLocale = navigator.language || "nl";

  // Format the date using toLocaleDateString with the detected locale
  return date
    .toLocaleDateString(userLocale, { month: "2-digit", day: "2-digit" })
    .replace(/,/g, ", ");
}

export function checkIfBirthdayToday(birthday: string) {
  if (!birthday) return false;

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = birthday.split("-")[1];
  const userBirthdayDay = birthday.split("-")[2];

  const isToday =
    parseInt(userBirthdayMonth) === todayMonth &&
    parseInt(userBirthdayDay) === todayDay;

  return isToday;
}

export function checkIfBirthdayRecent(birthday: string) {
  if (!birthday) return false;

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = parseInt(birthday.split("-")[1]);
  const userBirthdayDay = parseInt(birthday.split("-")[2]);

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

export function checkIfBirthdaySoon(birthday: string) {
  if (!birthday) return false;

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = parseInt(birthday.split("-")[1]);
  const userBirthdayDay = parseInt(birthday.split("-")[2]);

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
