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

    // Store the notification in Firestore
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

    // check for FCM tokens

    const tokensSnapshot = await adminDb
      .collection(`users/${userId}/fcmTokens`)
      .get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.id);

    if (tokens.length === 0) {
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
          icon: "/favicon-32x32.png"
        },
        fcm_options: {
          link: notification.url || "https://verkaikings.netlify.app/"
        }
      },
      tokens
    };

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
