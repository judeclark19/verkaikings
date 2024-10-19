"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, authListener } from "@/lib/firebase"; // Adjust path as needed

const NewsFeed = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Firebase Auth:", auth);
  }, []);

  useEffect(() => {
    authListener((user) => {
      if (user) {
        setLoading(false);
      } else {
        // User is not logged in, redirect to login page
        router.push("/login");
      }
    });
  }, [router]);

  if (loading) return <div>Checking user...</div>;

  return <div>Logged in as {auth.currentUser?.email}, Show news feed</div>;
};

export default NewsFeed;
