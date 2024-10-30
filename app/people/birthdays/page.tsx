import { Metadata } from "next";
import { Skeleton, Typography } from "@mui/material";
import { fetchUsers } from "@/lib/serverUtils";
import BirthdayList from "./BirthdayList";

export const metadata: Metadata = {
  title: "Birthdays | Verkaikings"
};
async function BirthdaysPage() {
  const users = await fetchUsers();

  // sort users into groups by birthday month
  const usersByMonth = users.reduce((acc, user) => {
    const month = user.birthday?.split("-")[1];
    if (!month) return acc;

    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(user);
    return acc;
  }, {});

  return (
    <div>
      <Typography variant="h1">List of Birthdays</Typography>
      {usersByMonth ? (
        <BirthdayList usersByMonth={usersByMonth} />
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

export default BirthdaysPage;
