import { Waypoint } from "./waypoint";

export interface InternationaleFahrten {
    eu: boolean;
    eu_ch: boolean;
    inland: boolean;
}

export interface Tour {
    userId: string;
    waypoints: Waypoint[];
    tourId: string;
    vehiceId?: string;
    startTime: number;
    endTime: number;
    internationaleFahrten?: InternationaleFahrten;
}