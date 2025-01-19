import { Metadata } from "next/types";
import Fundraiser from "./Fundraiser";

export const metadata: Metadata = {
  title: "Fundraisers | Willemijn's World Website"
};

const FundraiserDetailPage = () => {
  return <Fundraiser />;
};

export default FundraiserDetailPage;
