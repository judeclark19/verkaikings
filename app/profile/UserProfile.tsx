"use client";

import { DocumentData } from "firebase/firestore";

const UserProfile = ({ user }: { user: DocumentData }) => {
  return (
    <div>
      {user ? (
        <>
          <h1>UserProfile of {user.username}</h1>
          <div>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Country: {user.countryName}</p>
            {/* Render more user details as needed */}
          </div>
        </>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
};

export default UserProfile;
