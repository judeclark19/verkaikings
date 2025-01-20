import { Metadata } from "next/types";
import Fundraisers from "./Fundraisers";

export const metadata: Metadata = {
  title: "Fundraisers | Willemijn's World Website"
};

const FundraiserPage = () => {
  return <Fundraisers />;
};

export default FundraiserPage;
