import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// example req
// {
//   "notification": {
//     "title": "New feature launched",
//     "body": "Check out our new Q and A feature!",
//     "url": "/qanda"
// }

export async function POST(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notification } = await req.json();

    // Validate notification payload
    if (!notification?.title || !notification?.body) {
      return NextResponse.json(
        { error: "Invalid notification payload." },
        { status: 400 }
      );
    }

    // Store the notification in Firestore for all users
    const usersSnapshot = await adminDb.collection("users").get();
    const batch = adminDb.batch();

    usersSnapshot.docs.forEach((userDoc) => {
      const userId = userDoc.id;
      const notificationDoc = {
        title: notification.title,
        body: notification.body,
        url: notification.url || null,
        createdAt: Timestamp.now(),
        read: false
      };

      const userNotificationsRef = adminDb
        .collection(`users/${userId}/notifications`)
        .doc();
      batch.set(userNotificationsRef, notificationDoc);
    });

    await batch.commit();

    // Retrieve all FCM tokens
    const allTokens: string[] = [];
    for (const userDoc of usersSnapshot.docs) {
      const tokensSnapshot = await adminDb
        .collection(`users/${userDoc.id}/fcmTokens`)
        .get();

      tokensSnapshot.docs.forEach((doc) => {
        allTokens.push(doc.id);
      });
    }

    if (allTokens.length === 0) {
      return NextResponse.json({
        message: "Notification stored but no FCM tokens found."
      });
    }

    // Pushing notification to all tokens
    const message = {
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: "/favicon-32x32_v2.png"
        },
        fcm_options: {
          link: notification.url || "https://verkaikings.netlify.app/"
        }
      },
      tokens: allTokens
    };

    const response = await adminMessaging.sendEachForMulticast(message);

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error sending notifications:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
