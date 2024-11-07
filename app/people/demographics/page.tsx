import { Metadata } from "next";
import { fetchUsers } from "@/lib/serverUtils";
import DemographicsUI from "./DemographicsUI";

export const metadata: Metadata = {
  title: "Demographics | Verkaikings"
};

const DemographicsPage = async () => {
  const users = await fetchUsers();

  return <DemographicsUI users={users} />;
};

export default DemographicsPage;
