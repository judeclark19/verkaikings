import { makeAutoObservable, toJS } from "mobx";
import appState from "@/lib/AppState";
import userList, { UserDocType } from "@/lib/UserList";

type MapItem = {
  cityId: string;
  users: UserDocType[];
  countryAbbr: string;
};

export class UserMapState {
  usersWithCity: UserDocType[] = [];
  isInitialized = false;
  mapItems: MapItem[] = [];
  openInfoWindow: google.maps.InfoWindow | null = null;
  markers = new Map<string, google.maps.marker.AdvancedMarkerElement>();
  infoWindows = new Map<string, google.maps.InfoWindow>();
  map: google.maps.Map | null = null;
  visibleMarkerCount = 0; // Observable property to track visible markers

  constructor() {
    makeAutoObservable(this);
  }

  init(users: UserDocType[]) {
    this.usersWithCity = users.filter((user) => user.cityId);

    // INIT MAP ITEMS
    this.mapItems = [];

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
    if (!window.google || !appState.isInitialized) return;
    console.log("Initializing map...");

    this.map = new window.google.maps.Map(mapContainer, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapId: process.env.NEXT_PUBLIC_USERMAP_ID
    });

    this.mapItems.forEach(async (mapItem) => {
      let cachedPlace = appState.cityDetails[mapItem.cityId];

      if (!cachedPlace) {
        cachedPlace = await appState.fetchCityDetails(mapItem.cityId);
      }
      this.createMarker(cachedPlace, mapItem);
    });

    this.isInitialized = true;
    this.updateVisibleMarkerCount(); // Update visible markers after initialization
  }

  createMarker(place: any, mapItem: MapItem) {
    const position = place.location
      ? { lat: place.location.latitude, lng: place.location.longitude }
      : null;

    if (!position) {
      console.error("No valid location found for place:", place);
      return;
    }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position,
      title: place.displayName?.text || "Unknown Place"
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

  updateInfoWindowContent(cityId: string, updatedUsers: UserDocType[]) {
    const infoWindow = this.infoWindows.get(cityId);
    if (infoWindow) {
      const mapItem = this.mapItems.find((item) => item.cityId === cityId);
      if (mapItem) {
        mapItem.users = updatedUsers;
        infoWindow.setContent(this.generateInfoWindowContent(mapItem));
      }
    }
  }

  updateMarkerVisibility(filteredUsers: UserDocType[]) {
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

    this.updateVisibleMarkerCount(); // Update visible marker count after changing visibility
  }

  updateVisibleMarkerCount() {
    this.visibleMarkerCount = Array.from(this.markers.values()).filter(
      (marker) => marker.map === this.map
    ).length;
  }
}

const userMap = new UserMapState();
export default userMap;
