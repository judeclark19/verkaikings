import React, { useEffect, useState } from "react";
import CityPicker from "../CityPicker";
import { DocumentData } from "firebase-admin/firestore";
import { Skeleton, Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { fetchCityName } from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import { toJS } from "mobx";

const City = observer(
  ({
    user,
    userId,
    setUser,
    setPlaceId
  }: {
    user: DocumentData;
    userId: string;
    setUser: (user: DocumentData) => void;
    setPlaceId: (placeId: string | null) => void;
  }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [cityId, setCityId] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        if (myProfileState.user) {
          setIsLoading(true); // Start loading
          const fetchedCityName = await fetchCityName(myProfileState.user);
          myProfileState.setCityName(fetchedCityName);
          setIsLoading(false); // End loading
          console.log("City user from state", toJS(myProfileState.user));
        }
      };

      fetchData();
    }, [myProfileState.user]);

    if (isLoading) {
      return <Skeleton />;
    }

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
            setPlaceId={setPlaceId}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            <Typography component="p">
              City: {myProfileState.cityName}
            </Typography>
            <EditFieldBtn setState={setIsEditing} />
          </div>
        )}
      </>
    );
  }
);

export default City;
