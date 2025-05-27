import { Waypoint } from "./waypoint";

export interface Tour {
    userId: string;
    waypoints: Waypoint[];
    tourId: string;
    vehiceId?: string;
    startTime: number;
    endTime: number;
    internationaleFahrten?: boolean;

}