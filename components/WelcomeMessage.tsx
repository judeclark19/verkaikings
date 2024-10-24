"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, authListener } from "@/lib/firebase"; // Adjust path as needed
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";

const WelcomeMessage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Firebase Auth:", auth);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // If user is authenticated, redirect to profile (or another protected page)
        router.push("/profile");
      } else {
        // If user is not authenticated, redirect to login
        // router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Logged in as {auth.currentUser?.email}</div>;

  return (
    <div>
      Please{" "}
      <Link href="/login" style={{ color: "white" }}>
        log in
      </Link>
      .
    </div>
  );
};

export default WelcomeMessage;
