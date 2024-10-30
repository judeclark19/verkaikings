import React from "react";
import NavbarUI from "./NavbarUI";
import { getTokenFromCookie } from "@/lib/serverUtils";

function Navbar() {
  const token = getTokenFromCookie();
  return <NavbarUI isLoggedIn={!!token} />;
}

export default Navbar;
