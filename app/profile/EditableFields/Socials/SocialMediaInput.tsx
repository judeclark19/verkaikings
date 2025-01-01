import { TextField, Typography } from "@mui/material";
import myProfileState, { MyProfileState } from "../../MyProfile.state";
import EditBtn from "../EditBtn";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { ReactElement, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SaveBtn from "../SaveBtn";
import appState from "@/lib/AppState";

type SocialMediaInputProps = {
  platformName: string;
  platformIcon: ReactElement;
  stateKey: keyof Pick<
    MyProfileState,
    "instagram" | "tiktok" | "duolingo" | "beReal"
  >;
  profileStateSetter: (value: string | null) => void;
  linkPrefix?: string;
};

const SocialMediaInput: React.FC<SocialMediaInputProps> = observer(
  ({
    platformName,
    platformIcon,
    stateKey,
    profileStateSetter,
    linkPrefix
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Ensure the value of stateKey is always string or empty string
    const [temp, setTemp] = useState<string>(myProfileState[stateKey] || "");

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (myProfileState[stateKey] === temp) {
        setIsEditing(false);
        return;
      }

      const userDoc = doc(db, "users", myProfileState.userId!);
      setLoading(true);

      try {
        await updateDoc(userDoc, {
          [stateKey]: temp || null
        });
        profileStateSetter(temp || null);
        setTemp(temp || ""); // Sync `temp` with state
        appState.setSnackbarMessage(`${platformName} updated successfully`);
      } catch (error) {
        alert(`Error updating ${platformName}: ${error}`);
        console.error(`Error updating ${platformName}: `, error);
      } finally {
        setLoading(false);
        setIsEditing(false);
      }
    };

    return (
      <div
        style={{
          height: "76px",
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        {platformIcon}
        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%"
            }}
          >
            <TextField
              label={`${platformName} username`}
              variant="outlined"
              fullWidth
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <SaveBtn loading={loading} />
          </form>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexGrow: 1
            }}
          >
            {linkPrefix && myProfileState[stateKey] ? (
              <Link
                href={`${linkPrefix}${myProfileState[stateKey]}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", flexGrow: 1 }}
              >
                <Typography component="p">
                  {myProfileState[stateKey]}
                </Typography>
              </Link>
            ) : (
              <Typography
                component="p"
                sx={{
                  color: myProfileState[stateKey]
                    ? "inherit"
                    : "text.secondary",
                  flexGrow: 1
                }}
              >
                ({platformName})
              </Typography>
            )}

            <EditBtn setIsEditing={setIsEditing} />
          </div>
        )}
      </div>
    );
  }
);

export default SocialMediaInput;
