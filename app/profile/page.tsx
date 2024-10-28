import { Metadata } from "next";
import MyProfile from "./MyProfile";

import { decodeToken, getTokenFromCookie } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Profile | Verkaikings"
};

function ProfilePage() {
  const decodedToken = decodeToken();

  return <MyProfile userId={decodedToken.user_id} />;
}

export default ProfilePage;
