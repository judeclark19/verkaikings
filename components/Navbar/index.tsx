import React from "react";
import NavbarUI from "./NavbarUI";
import { decodeToken } from "@/lib/serverUtils";

function Navbar() {
  const decodedToken = decodeToken();

  return (
    <NavbarUI isLoggedIn={!!decodedToken} userId={decodedToken?.user_id} />
  );
}

export default Navbar;
