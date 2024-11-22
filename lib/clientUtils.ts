export function formatBirthday(input: string) {
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
