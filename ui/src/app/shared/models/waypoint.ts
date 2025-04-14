import {InternationaleFahrt} from "./internationalefahrt";
export interface Waypoint {
    latitude: number;
    longitude: number;
    timestamp: number;
    internationaleFahrten: InternationaleFahrt[];

  }
  