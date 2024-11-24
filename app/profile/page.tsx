import { Metadata } from "next";
import MyProfile from "./MyProfile";

export const metadata: Metadata = {
  title: "My Profile | Willemijn's World Website"
};

function ProfilePage() {
  return <MyProfile />;
}

export default ProfilePage;
