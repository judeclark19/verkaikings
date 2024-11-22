import { Metadata } from "next";
import PeopleList from "./PeopleList";

export const metadata: Metadata = {
  title: "People | Willemijn's World Website"
};

const PeoplePage = async () => {
  return <PeopleList />;
};

export default PeoplePage;
