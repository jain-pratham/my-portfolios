export interface Point {
  x: number;
  y: number;
}

export interface ZoneRules {
  alertAfterSeconds: number;
  enabled: boolean;
  afterHoursOnly: boolean;
}

export interface IZone {
  _id: string;
  cameraId: string;
  name: string;
  type: "RESTRICTED" | "VALUABLE" | "CASH_COUNTER" | "STORAGE" | "DOOR" | "CUSTOM";
  points: Point[];
  enabled: boolean;
  rules: ZoneRules;
}

export interface ICamera {
  _id: string;
  cameraKey: string;
  locationName?: string;
  name?: string;
  streamUrl?: string;
  streamType?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "demo";
  company?: string;
  token?: string;
}
