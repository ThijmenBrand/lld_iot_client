export interface UserResponse {
  deviceId: string;
  calendarId: string;
  widgetType?: string;
}

export interface User {
  id: string;
  deviceId: string;
  deviceSecret: string;
  calendarId?: string;
  widgetType?: string;
}
