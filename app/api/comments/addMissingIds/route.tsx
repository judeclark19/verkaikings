// app/api/comments/addMissingIds/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * Generates a unique id using Firebase Admin SDK.
 * Leverages Firestore's document ID generation without creating a document.
 */
function generateUniqueId(): string {
  // Create a dummy document reference to generate a Firestore ID
  return adminDb.collection("dummy").doc().id;
}

/**
 * This route expects a POST request with a JSON payload like:
 * {
 *   "collectionName": "myWillemijnStories",
 *   "fieldName": "comments" // or "answers" if you're updating qanda docs
 * }
 *
 * It iterates over all documents in the provided collection,
 * checks each comment in the specified field, and assigns an id
 * if one is missing.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 } // Return a 401 Unauthorized status
    );
  }

  try {
    const { collectionName, fieldName } = await req.json();

    if (!collectionName || !fieldName) {
      return NextResponse.json(
        { error: "collectionName and fieldName are required" },
        { status: 400 }
      );
    }

    const collectionRef = adminDb.collection(collectionName);
    const snapshot = await collectionRef.get();

    let updatedCount = 0;

    // Iterate over each document in the collection
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const commentsArray = data[fieldName] || [];

      // Only proceed if the field exists and is an array
      if (Array.isArray(commentsArray) && commentsArray.length > 0) {
        const updatedComments = commentsArray.map((comment: any) => {
          // If there's no id, add one
          if (!comment.id) {
            updatedCount++;
            return { ...comment, id: generateUniqueId() };
          }
          return comment;
        });

        // Only update the document if we have modified any comment
        if (JSON.stringify(updatedComments) !== JSON.stringify(commentsArray)) {
          await doc.ref.update({
            [fieldName]: updatedComments
          });
        }
      }
    }

    return NextResponse.json({
      message: `Migration complete: Updated ${updatedCount} comments without ids.`
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
