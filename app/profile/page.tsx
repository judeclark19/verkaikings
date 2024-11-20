import { Metadata } from "next";
import MyProfile from "./MyProfile";

import { decodeToken } from "@/lib/serverUtils";

export const metadata: Metadata = {
  title: "My Profile | Willemijn's World Website"
};

function ProfilePage() {
  const decodedToken = decodeToken();

  return <MyProfile userId={decodedToken.user_id} />;
}

export default ProfilePage;
