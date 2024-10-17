import { Metadata } from "next";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Verkaikings"
};

function LoginPage() {
  return (
    <>
      <h1>Login Page</h1>
      <LoginForm />
      <SignupForm />
    </>
  );
}

export default LoginPage;
