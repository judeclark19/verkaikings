import React, { useEffect, useState } from "react";
import CityPicker from "../CityPicker";
import { DocumentData } from "firebase-admin/firestore";
import { Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { fetchCityName } from "@/lib/clientUtils";

function City({
  user,
  userId,
  setUser
}: {
  user: DocumentData;
  userId: string;
  setUser: (user: DocumentData) => void;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [cityId, setCityId] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCityName(user, setCityName);
    }
  }, [user]);

  useEffect(() => {
    console.log("City.tsx cityName", cityName);
  }, [cityName]);

  return (
    <>
      {isEditing ? (
        <CityPicker
          cityId={cityId}
          setCityId={setCityId}
          setIsEditing={setIsEditing}
          user={user}
          userId={userId}
          setUser={setUser}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">City: {cityName}</Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
}

export default City;
