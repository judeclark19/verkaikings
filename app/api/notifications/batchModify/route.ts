import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// Example req body:
// {
//   "searchValues": {
//     "oldTitle": "Anne_B's Birthday",
//     "newTitle": "Anne_'s Birthday",
//     "oldBody": "Happy Birthday Anne_B!",
//     "newBody": "Happy Birthday Anne_!",
//     "oldUrl": "/profile/Anne_B",
//     "newUrl": "/profile/Anne_"
//   }
// }

export async function PATCH(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchValues } = await req.json();

    if (!searchValues || Object.keys(searchValues).length === 0) {
      return NextResponse.json(
        { error: "Missing searchValues for updating notifications." },
        { status: 400 }
      );
    }

    const usersSnapshot = await adminDb.collection("users").get();

    const batch = adminDb.batch();

    for (const userDoc of usersSnapshot.docs) {
      const notificationsRef = adminDb.collection(
        `users/${userDoc.id}/notifications`
      );

      const notificationsSnapshot = await notificationsRef.get();

      for (const notificationDoc of notificationsSnapshot.docs) {
        const notification = notificationDoc.data();

        const updatedFields: Record<string, string> = {};

        // Check and replace fields
        if (
          searchValues.oldTitle &&
          notification.title?.includes(searchValues.oldTitle)
        ) {
          updatedFields.title = notification.title.replace(
            searchValues.oldTitle,
            searchValues.newTitle || searchValues.oldTitle
          );
        }

        if (
          searchValues.oldBody &&
          notification.body?.includes(searchValues.oldBody)
        ) {
          updatedFields.body = notification.body.replace(
            searchValues.oldBody,
            searchValues.newBody || searchValues.oldBody
          );
        }

        if (
          searchValues.oldUrl &&
          notification.url?.includes(searchValues.oldUrl)
        ) {
          updatedFields.url = notification.url.replace(
            searchValues.oldUrl,
            searchValues.newUrl || searchValues.oldUrl
          );
        }

        // If there are updates, add to batch
        if (Object.keys(updatedFields).length > 0) {
          batch.update(notificationDoc.ref, updatedFields);
        }
      }
    }

    await batch.commit();

    return NextResponse.json({
      message: "Notifications updated successfully."
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating notifications:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
