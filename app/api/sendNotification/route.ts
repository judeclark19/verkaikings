import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_APP_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 } // Return a 401 Unauthorized status
    );
  }

  try {
    const { userId, notification } = await req.json();

    const tokensSnapshot = await adminDb
      .collection(`users/${userId}/fcmTokens`)
      .get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.id);

    if (tokens.length === 0) {
      return NextResponse.json(
        { message: "No FCM tokens found for user." },
        { status: 404 }
      );
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      tokens
    };

    console.log("Tokens:", tokens);
    console.log("Message Payload:", JSON.stringify(message, null, 2));

    // Send push notifications
    const response = await adminMessaging.sendEachForMulticast(message);

    // Store the notification in Firestore
    const notificationDoc = {
      title: notification.title,
      body: notification.body,
      url: notification.url || null, // Optional
      createdAt: Timestamp.now()
    };

    await adminDb
      .collection(`users/${userId}/notifications`)
      .add(notificationDoc);

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
