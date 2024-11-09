import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Verkaikings"
};

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;
