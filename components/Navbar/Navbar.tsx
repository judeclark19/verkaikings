import React from "react";
import NavbarUI from "./NavbarUI";
import { readTokenFromCookie } from "@/lib/readTokenFromCookie";

function Navbar() {
  const token = readTokenFromCookie();
  return <NavbarUI isLoggedIn={!!token} />;
}

export default Navbar;
