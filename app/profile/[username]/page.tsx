import { Metadata } from "next";
import UserProfile from "./UserProfile";

export const metadata: Metadata = {
  title: "User Profile | Verkaikings"
};

function ProfilePage() {
  return <UserProfile />;
}

export default ProfilePage;
