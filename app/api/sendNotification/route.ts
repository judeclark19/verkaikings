import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, notification } = await req.json();

    const tokensSnapshot = await adminDb
      .collection(`users/${userId}/fcmTokens`)
      .get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.id);

    // Store the notification in Firestore regardless of tokens
    const notificationDoc = {
      title: notification.title,
      body: notification.body,
      url: notification.url || null,
      createdAt: Timestamp.now(),
      read: false
    };

    await adminDb
      .collection(`users/${userId}/notifications`)
      .add(notificationDoc);

    if (tokens.length === 0) {
      // No tokens found, so we can't send a push notification.
      // The notification is still stored for the user to see in the list.
      return NextResponse.json({
        message: "Notification stored but no FCM tokens found."
      });
    }

    const message = {
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: "/favicon-32x32.png"
        },
        fcm_options: {
          link: notification.url || "https://verkaikings.netlify.app/"
        }
      },
      tokens
    };

    // console.log("Tokens:", tokens);
    // console.log("Message Payload:", JSON.stringify(message, null, 2));

    const response = await adminMessaging.sendEachForMulticast(message);

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error sending notification:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
