"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, authListener } from "@/lib/firebase"; // Adjust path as needed

const FirebaseTest = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Firebase Auth:", auth);
  }, []);

  useEffect(() => {
    authListener((user) => {
      if (user) {
        // User is logged in, redirect to profile page
        router.push("/profile");
      } else {
        // User is not logged in, redirect to login page
        router.push("/login");
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div>Checking user...</div>;

  return <div>Redirecting...</div>;
};

export default FirebaseTest;
