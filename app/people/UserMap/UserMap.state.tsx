import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";

type MapItem = {
  cityId: string;
  users: DocumentData[];
  countryAbbr: string;
};

class UserMapState {
  usersWithCity: DocumentData[] = [];
  isInitialized = false;
  mapItems: MapItem[] = [];
  cityNames: Record<string, string> = {};
  openInfoWindow: google.maps.InfoWindow | null = null;
  markers = new Map<string, google.maps.marker.AdvancedMarkerElement>();
  infoWindows = new Map<string, google.maps.InfoWindow>();
  map: google.maps.Map | null = null;

  constructor(users: DocumentData[], cityNames: Record<string, string>) {
    makeAutoObservable(this);
    this.usersWithCity = users.filter((user) => user.cityId);
    this.cityNames = cityNames;

    // INIT MAP ITEMS
    Object.keys(userList.usersByCountry).forEach((country) => {
      const countryObject = userList.usersByCountry[country];
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
    if (this.map) {
      console.log("Map is already initialized.");
      return;
    }

    if (!window.google) return;
    console.log("Initializing map...");

    this.map = new window.google.maps.Map(mapContainer, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapId: process.env.NEXT_PUBLIC_USERMAP_ID
    });

    const service = new window.google.maps.places.PlacesService(this.map);

    this.mapItems.forEach((mapItem) => {
      const cachedPlace = appState.cityDetails[mapItem.cityId];
      if (cachedPlace) {
        this.createMarker(cachedPlace, mapItem);
      } else {
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
              appState.saveToLocalStorage();
              this.createMarker(place, mapItem);
            } else {
              console.error("Place details could not be retrieved:", status);
            }
          }
        );
      }
    });

    this.isInitialized = true;
  }

  createMarker(place: google.maps.places.PlaceResult, mapItem: MapItem) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: place.geometry?.location,
      title: place.name
    });

    this.markers.set(mapItem.cityId, marker);

    const infoWindow = new google.maps.InfoWindow({
      content: this.generateInfoWindowContent(mapItem)
    });

    this.infoWindows.set(mapItem.cityId, infoWindow);

    marker.addListener("click", () => {
      if (this.openInfoWindow) {
        this.openInfoWindow.close();
      }
      infoWindow.open(this.map, marker);
      this.openInfoWindow = infoWindow;
    });
  }

  generateInfoWindowContent(mapItem: MapItem) {
    return `<div class="info-window">
      <h2>${appState.cityNames[mapItem.cityId]}, ${
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
  }

  updateInfoWindowContent(cityId: string, updatedUsers: DocumentData[]) {
    const infoWindow = this.infoWindows.get(cityId);
    if (infoWindow) {
      const mapItem = this.mapItems.find((item) => item.cityId === cityId);
      if (mapItem) {
        mapItem.users = updatedUsers;
        infoWindow.setContent(this.generateInfoWindowContent(mapItem));
      }
    }
  }

  updateMarkerVisibility(filteredUsers: DocumentData[]) {
    const visibleCityIds = new Set(
      filteredUsers.map((user) => user.cityId).filter((id) => !!id)
    );

    this.markers.forEach((marker, cityId) => {
      if (visibleCityIds.has(cityId)) {
        marker.map = this.map; // Show marker
        const updatedUsers = filteredUsers.filter(
          (user) => user.cityId === cityId
        );
        this.updateInfoWindowContent(cityId, updatedUsers);
      } else {
        marker.map = null; // Hide marker
      }
    });
  }
}

export default UserMapState;
