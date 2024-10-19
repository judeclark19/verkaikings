"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, authListener } from "@/lib/firebase"; // Adjust path as needed

const WelcomeMessage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Firebase Auth:", auth);
  }, []);

  useEffect(() => {
    authListener((user) => {
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Logged in as {auth.currentUser?.email}</div>;

  return <div>Please log in</div>;
};

export default WelcomeMessage;
