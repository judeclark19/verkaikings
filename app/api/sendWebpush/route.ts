import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscription, userId } = await req.json();

  if (!subscription || !userId) {
    return NextResponse.json(
      { error: "Missing subscription or userId" },
      { status: 400 }
    );
  }

  try {
    const subscriptionsRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("pushSubscriptions");

    // Check for existing subscription
    const existingSubscription = await subscriptionsRef
      .where("endpoint", "==", subscription.endpoint)
      .get();

    if (!existingSubscription.empty) {
      return NextResponse.json({
        message: "Subscription already exists."
      });
    }

    // Save the subscription
    await subscriptionsRef.add({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date()
    });

    return NextResponse.json({ message: "Subscription saved successfully" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription." },
      { status: 500 }
    );
  }
}
