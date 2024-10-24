import { Metadata } from "next";
import MyProfile from "./MyProfileGetter";

export const metadata: Metadata = {
  title: "My Profile | Verkaikings"
};

function ProfilePage() {
  return <MyProfile />;
}

export default ProfilePage;
