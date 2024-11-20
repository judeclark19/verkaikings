import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Willemijn's World Website"
};

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;
