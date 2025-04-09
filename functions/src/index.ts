import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";

import {runBirthdayCheck} from "./birthdayCheck";
import {sendWelcomeNotifications} from "./sendWelcomeNotifications";
import {sendNewStoryNotifications} from "./sendNewStoryNotifications";
import {sendNewEventNotifications} from "./sendNewEventNotifications";
import {sendNewQNotifications} from "./sendNewQNotifications";

const functionsDisabled = true;

exports.sendWelcomeNotifications = functionsDisabled ?
  () => null :
  onDocumentCreated("users/{docId}", sendWelcomeNotifications);

exports.sendNewStoryNotifications = functionsDisabled ?
  () => null :
  onDocumentCreated("myWillemijnStories/{docId}", sendNewStoryNotifications);

exports.sendNewEventNotifications = functionsDisabled ?
  () => null :
  onDocumentCreated("events/{docId}", sendNewEventNotifications);

exports.sendNewQNotifications = functionsDisabled ?
  () => null :
  onDocumentCreated("qanda/{docId}", sendNewQNotifications);

exports.birthdayCheck = functionsDisabled ?
  () => null :
  onSchedule(
    {schedule: "every day 08:00", timeZone: "Europe/Berlin"},
    async () => {
      await runBirthdayCheck();
    }
  );
