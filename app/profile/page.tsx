import { Metadata } from "next";
import MyProfile from "./MyProfile";

import { decodeToken, readTokenFromCookie } from "@/lib/readTokenFromCookie";

export const metadata: Metadata = {
  title: "My Profile | Verkaikings"
};

function ProfilePage() {
  const decodedToken = decodeToken();

  return <MyProfile userId={decodedToken.user_id} />;
}

export default ProfilePage;
