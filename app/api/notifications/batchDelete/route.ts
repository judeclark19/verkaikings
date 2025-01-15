import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// Example req body:
// {
//   "searchValues": {
//     "title": "Anne_'s Birthday",
//     "body": "Happy Birthday Anne_!",
//     "url": "/profile/Anne_"
//   }
// }

export async function DELETE(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchValues } = await req.json();

    if (!searchValues || Object.keys(searchValues).length === 0) {
      return NextResponse.json(
        { error: "Missing searchValues for deleting notifications." },
        { status: 400 }
      );
    }

    const usersSnapshot = await adminDb.collection("users").get();
    const batch = adminDb.batch();
    let deleteCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const notificationsRef = adminDb.collection(
        `users/${userDoc.id}/notifications`
      );

      const notificationsSnapshot = await notificationsRef.get();

      for (const notificationDoc of notificationsSnapshot.docs) {
        const notification = notificationDoc.data();

        // Check if the notification matches the criteria for deletion
        const matchesTitle =
          searchValues.title &&
          notification.title?.includes(searchValues.title);
        const matchesBody =
          searchValues.body && notification.body?.includes(searchValues.body);
        const matchesUrl =
          searchValues.url && notification.url?.includes(searchValues.url);

        if (matchesTitle || matchesBody || matchesUrl) {
          batch.delete(notificationDoc.ref);
          deleteCount++;
        }
      }
    }

    if (deleteCount === 0) {
      return NextResponse.json({
        message: "No matching notifications found for deletion."
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: `Deleted ${deleteCount} matching notifications successfully.`
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error deleting notifications:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
