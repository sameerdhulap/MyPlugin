/**
 * Geofence region types
 */
export type RegionType = 'circle' | 'isochrone';

/**
 * Location of custom profile to fetch
 */
export type ProfileSource = 'local' | 'external';

/**
 * GeofenceRegion structure
 */
export interface GeofenceRegion {
  regionId: string;
  lat: number;
  lng: number;
  radius: number;
  type: RegionType;
}
