import { cookies } from "next/headers";
import { adminDb } from "./firebaseAdmin";
import { DocumentData } from "firebase/firestore";

export function getTokenFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  return token;
}

export function decodeToken() {
  const token = getTokenFromCookie();
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}

export async function fetchUsers() {
  const snapshot = await adminDb.collection("users").get();
  const users: DocumentData[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return users;
}
