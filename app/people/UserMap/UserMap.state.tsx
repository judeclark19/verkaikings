import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import appState, { CountryUsersType } from "@/lib/AppState";

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
    console.log("Initializing map...");

    const map = new window.google.maps.Map(mapContainer, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapId: process.env.NEXT_PUBLIC_USERMAP_ID
    });

    const service = new window.google.maps.places.PlacesService(map);

    this.mapItems.forEach((mapItem) => {
      // Check cache first
      const cachedPlace = appState.cityDetails[mapItem.cityId];
      if (cachedPlace) {
        console.log("creating marker from cache:", cachedPlace);
        // Create marker from cached data
        this.createMarker(map, cachedPlace, mapItem);
      } else {
        // Fetch details only if not cached
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
              appState.cityNames[mapItem.cityId] = place.name || "";
              appState.saveToLocalStorage(); // Save updated cache
              this.createMarker(map, place, mapItem);
            } else {
              console.error("Place details could not be retrieved:", status);
            }
          }
        );
      }
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
        <h2>${appState.cityNames[place.place_id!]}, ${
      appState.countryNames[mapItem.countryAbbr]
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
