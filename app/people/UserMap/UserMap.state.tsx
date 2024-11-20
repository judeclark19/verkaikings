import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { CountryUsersType } from "../People.state";

class UserMapState {
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  isInitialized = false;
  mapItems: { cityId: string; users: DocumentData[] }[] = [];
  cityNames: Record<string, string> = {};
  openInfoWindow: google.maps.InfoWindow | null = null; // Track the open InfoWindow

  constructor(
    users: DocumentData[],
    usersByCountry: Record<string, CountryUsersType>,
    cityNames: Record<string, string>
  ) {
    makeAutoObservable(this);
    this.users = users.filter((user) => user.cityId);
    this.usersByCountry = usersByCountry;
    this.cityNames = cityNames;

    // INIT MAP ITEMS
    Object.keys(this.usersByCountry).forEach((country) => {
      const countryObject = this.usersByCountry[country];
      Object.keys(countryObject.cities).forEach((city) => {
        this.mapItems.push({
          cityId: city,
          users: countryObject.cities[city]
        });
      });
    });
  }

  initializeMap() {
    if (!window.google) return;
    const map = new window.google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapId: process.env.NEXT_PUBLIC_USERMAP_ID
      }
    );

    const service = new window.google.maps.places.PlacesService(map);
    this.mapItems.forEach((mapItem) => {
      service.getDetails(
        { placeId: mapItem.cityId },
        (
          place: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            this.createMarker(map, place, mapItem.users);
          } else {
            console.error("Place details could not be retrieved:", status);
          }
        }
      );
    });
    this.isInitialized = true;
  }

  createMarker(
    map: google.maps.Map,
    place: google.maps.places.PlaceResult,
    users: DocumentData[]
  ) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: place.geometry?.location,
      title: place.name
    });

    const contentString = `<div style="color: black;">
        <strong>${this.cityNames[place.place_id!]}</strong>
        <ul>
        ${users
          .map(
            (user) =>
              `<li><a href="/profile/${user.username}">${user.firstName} ${user.lastName}</a></li>`
          )
          .join("")}
        </ul>
        </div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener("click", () => {
      // Close the previously open InfoWindow, if any
      if (this.openInfoWindow) {
        this.openInfoWindow.close();
      }

      // Open the new InfoWindow and set it as the currently open one
      infoWindow.open(map, marker);
      this.openInfoWindow = infoWindow;
    });
  }
}

export default UserMapState;
