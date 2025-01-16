import { Metadata } from "next/types";
import Fundraiser from "./Fundraiser";

export const metadata: Metadata = {
  title: "Fundraiser | Willemijn's World Website"
};

const FundraiserPage = () => {
  return <Fundraiser />;
};

export default FundraiserPage;
