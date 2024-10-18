import { Metadata } from "next";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Verkaikings"
};

function LoginPage() {
  return (
    <>
      <LoginForm />
      <SignupForm />
    </>
  );
}

export default LoginPage;
