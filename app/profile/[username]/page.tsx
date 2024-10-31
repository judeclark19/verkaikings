import { Metadata } from "next";
import UserProfile from "./UserProfile";
import { decodeToken } from "@/lib/serverUtils";

export const metadata: Metadata = {
  title: "User Profile | Verkaikings"
};

function ProfilePage() {
  const decodedToken = decodeToken();

  return <UserProfile decodedToken={decodedToken} />;
}

export default ProfilePage;
