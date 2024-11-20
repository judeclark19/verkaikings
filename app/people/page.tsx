import { Metadata } from "next";
import { fetchUsers } from "@/lib/serverUtils";
import PeopleList from "./PeopleList";

export const metadata: Metadata = {
  title: "People | Willemijn's World Website"
};

const PeoplePage = async () => {
  const users = await fetchUsers();

  return <PeopleList users={users} />;
};

export default PeoplePage;
