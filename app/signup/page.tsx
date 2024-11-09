import { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Verkaikings"
};

function SignupPage() {
  return <SignupForm />;
}

export default SignupPage;
