import { cookies } from "next/headers";

export async function getTokenFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value ?? null;
  return token;
}

export async function decodeToken() {
  const token = await getTokenFromCookie();
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}
