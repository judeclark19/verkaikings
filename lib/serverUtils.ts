import { cookies } from "next/headers";

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
