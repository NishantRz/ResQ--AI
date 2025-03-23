
// Location tracking service

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface GeoLocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private lastLocation: LocationData | null = null;
  private locationListeners: ((location: LocationData) => void)[] = [];

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public startTracking(options: GeoLocationOptions = {}): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.lastLocation = locationData;
          this.notifyListeners(locationData);
          resolve(locationData);
          
          // Start watching position
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              const newLocation: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
              };
              
              this.lastLocation = newLocation;
              this.notifyListeners(newLocation);
            },
            (error) => {
              console.error("Error watching position:", error);
            },
            {
              enableHighAccuracy: options.enableHighAccuracy ?? true,
              maximumAge: options.maximumAge ?? 0,
              timeout: options.timeout ?? 30000
            }
          );
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          maximumAge: options.maximumAge ?? 0, 
          timeout: options.timeout ?? 30000
        }
      );
    });
  }

  public stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log("Location tracking stopped");
    }
  }

  public getLastLocation(): LocationData | null {
    return this.lastLocation;
  }

  public isTracking(): boolean {
    return this.watchId !== null;
  }

  public addLocationListener(listener: (location: LocationData) => void): void {
    this.locationListeners.push(listener);
  }

  public removeLocationListener(listener: (location: LocationData) => void): void {
    this.locationListeners = this.locationListeners.filter(l => l !== listener);
  }

  private notifyListeners(location: LocationData): void {
    this.locationListeners.forEach(listener => {
      try {
        listener(location);
      } catch (error) {
        console.error("Error in location listener:", error);
      }
    });
  }

  // Simulate movement for testing purposes
  public simulateMovement(radius: number = 0.01): void {
    if (!this.lastLocation) return;
    
    const interval = setInterval(() => {
      if (!this.lastLocation || !this.isTracking()) {
        clearInterval(interval);
        return;
      }
      
      // Generate random movement within radius
      const randomLat = this.lastLocation.latitude + (Math.random() - 0.5) * radius;
      const randomLng = this.lastLocation.longitude + (Math.random() - 0.5) * radius;
      
      const simulatedLocation: LocationData = {
        latitude: randomLat,
        longitude: randomLng,
        accuracy: 10,
        timestamp: Date.now()
      };
      
      this.lastLocation = simulatedLocation;
      this.notifyListeners(simulatedLocation);
    }, 5000);
  }
}

// Export as singleton instance
export const locationService = LocationService.getInstance();
export default locationService;
