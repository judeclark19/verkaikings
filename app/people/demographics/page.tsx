import { Metadata } from "next";
import { fetchUsers } from "@/lib/serverUtils";
import ByLocation from "./ByLocation/ByLocation";

export const metadata: Metadata = {
  title: "Demographics | Verkaikings"
};

const DemographicsPage = async () => {
  const users = await fetchUsers();

  return <ByLocation users={users} />;
};

export default DemographicsPage;
