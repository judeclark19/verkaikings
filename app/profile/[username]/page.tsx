import { Metadata } from "next";
import UserProfile from "./UserProfile";
import { decodeToken } from "@/lib/serverUtils";

export const metadata: Metadata = {
  title: "User Profile | Willemijn's World Website"
};

async function ProfilePage() {
  const decodedToken = await decodeToken();

  return <UserProfile decodedToken={decodedToken} />;
}

export default ProfilePage;
