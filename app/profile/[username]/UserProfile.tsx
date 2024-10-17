"use client";

import { useParams } from "next/navigation";

const UserProfile = () => {
  const params = useParams();
  const { username } = params;

  return (
    <div>
      <h1>Profile of {username}</h1>
      {/* Fetch and display user details based on `username` */}
    </div>
  );
};

export default UserProfile;
