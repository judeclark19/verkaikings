import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { CountryUsersType } from "../People.state";
import placeDataCache from "@/lib/PlaceDataCache";

type MapItem = {
  cityId: string;
  users: DocumentData[];
  countryAbbr: string;
};

class UserMapState {
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  isInitialized = false;
  mapItems: MapItem[] = [];
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
        if (city !== "No city listed") {
          this.mapItems.push({
            cityId: city,
            countryAbbr: country,
            users: countryObject.cities[city]
          });
        }
      });
    });
  }

  initializeMap(mapContainer: HTMLElement) {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapContainer, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapId: process.env.NEXT_PUBLIC_USERMAP_ID
    });

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
            this.createMarker(map, place, mapItem);
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
    mapItem: MapItem
  ) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: place.geometry?.location,
      title: place.name
    });

    const contentString = `<div class="info-window">
        <h2>${placeDataCache.cityNames[place.place_id!]}, ${
      placeDataCache.countryNames[mapItem.countryAbbr]
    }</h2>
        <ul>
        ${mapItem.users
          .map(
            (user) =>
              `<li>
                <a href="/profile/${user.username}">
                  <button>
                  ${user.firstName} ${user.lastName}
                  </button>
                </a>
              </li>`
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
