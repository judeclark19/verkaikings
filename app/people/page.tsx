import { Metadata } from "next";
import { fetchUsers } from "@/lib/serverUtils";
import PeopleList from "./PeopleList";

export const metadata: Metadata = {
  title: "People | Verkaikings"
};

const PeoplePage = async () => {
  const users = await fetchUsers();

  return <PeopleList users={users} />;
};

export default PeoplePage;
