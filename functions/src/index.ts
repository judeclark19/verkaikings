import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";

import {runBirthdayCheck} from "./birthdayCheck";
import {sendWelcomeNotifications} from "./sendWelcomeNotifications";
import {sendNewStoryNotifications} from "./sendNewStoryNotifications";
import {sendNewEventNotifications} from "./sendNewEventNotifications";
import {sendNewQNotifications} from "./sendNewQNotifications";

exports.sendWelcomeNotifications = onDocumentCreated(
  "users/{docId}",
  sendWelcomeNotifications
);

exports.sendNewStoryNotifications = onDocumentCreated(
  "myWillemijnStories/{docId}",
  sendNewStoryNotifications
);

exports.birthdayCheck = onSchedule(
  {
    schedule: "every day 08:00",
    timeZone: "Europe/Berlin",
  },
  async () => {
    await runBirthdayCheck();
  }
);

exports.sendNewEventNotifications = onDocumentCreated(
  "events/{docId}",
  sendNewEventNotifications
);

exports.sendNewQNotifications = onDocumentCreated(
  "qanda/{docId}",
  sendNewQNotifications
);

// (async () => {
//   await runBirthdayCheck();
// })();
