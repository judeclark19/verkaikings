import React from "react";
import NavbarUI from "./NavbarUI";
import { getTokenFromCookie } from "@/lib/utils";

function Navbar() {
  const token = getTokenFromCookie();
  return <NavbarUI isLoggedIn={!!token} />;
}

export default Navbar;
