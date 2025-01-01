import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import myProfileState from "../../MyProfile.state";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { cleanNameString } from "@/lib/clientUtils";
import { UserDocType } from "@/lib/UserList";
import appState from "@/lib/AppState";

const NameEditingForm = observer(
  ({ closeModal }: { closeModal: () => void }) => {
    const [firstName, setFirstName] = useState(
      myProfileState.user?.firstName || ""
    );
    const [lastName, setLastName] = useState(
      myProfileState.user?.lastName || ""
    );
    const [username, setUsername] = useState(
      myProfileState.user?.username || ""
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      const userDoc = doc(db, "users", myProfileState.userId!);
      setLoading(true);

      try {
        // Update Firestore user document
        await updateDoc(userDoc, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username
        });

        // Update Firebase Auth displayName
        const user = auth.currentUser; // Ensure `auth` is imported from Firebase
        if (user) {
          await updateProfile(user, {
            displayName: `${cleanNameString(firstName)}_${cleanNameString(
              lastName
            )}`
          });

          const userDocSnapshot = await getDoc(userDoc);
          if (userDocSnapshot.exists()) {
            // Access the document data
            const userData = userDocSnapshot.data();
            // console.log("User data:", userData);
            myProfileState.setUser(userData as UserDocType);
          }
          console.log("Firebase displayName updated successfully");
        }
        appState.setSnackbarMessage("Name updated successfully");
      } catch (error) {
        alert(`Error updating Name: ${error}`);
        console.error("Error updating Name: ", error);
      } finally {
        setLoading(false);
        closeModal();
      }
    };

    useEffect(() => {
      setUsername(`${cleanNameString(firstName)}_${cleanNameString(lastName)}`);
    }, [firstName, lastName]);

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "2rem auto 0 auto"
        }}
      >
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <TextField
          id="username-preview"
          label="Resulting username"
          value={username}
          variant="standard"
          disabled
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {loading ? <CircularProgress color="inherit" size={14} /> : "Save"}
          </Button>
        </Box>
      </Box>
    );
  }
);

export default NameEditingForm;
