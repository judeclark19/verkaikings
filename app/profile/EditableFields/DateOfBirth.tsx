import { Typography } from "@mui/material";
import { checkIfBirthdayToday, formatFullBirthday } from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import CakeIcon from "@mui/icons-material/Cake";
import DOBChangeModal from "../components/DOBChangeModal";
import appState from "@/lib/AppState";

const DateOfBirth = observer(() => {
  if (!myProfileState.user) {
    return;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "space-between",
          height: "76px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "100%"
          }}
        >
          <CakeIcon />
          <Typography
            component="p"
            sx={{
              color: myProfileState.user.birthday ? "inherit" : "text.secondary"
            }}
          >
            {myProfileState.user.birthday
              ? formatFullBirthday(
                  myProfileState.user.birthday,
                  appState.language
                )
              : "(Enter your date of birth)"}{" "}
            {myProfileState.user.birthday &&
              checkIfBirthdayToday(myProfileState.user.birthday) &&
              "🎂"}
          </Typography>
        </div>
        <DOBChangeModal />
      </div>
    </>
  );
});

export default DateOfBirth;
