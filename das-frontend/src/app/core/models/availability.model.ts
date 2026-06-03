export type AvailabilityDay = 'Sunday'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday';
export const AVAILABILITY_DAYS: AvailabilityDay[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export interface SetAvailabilityRequest {
  dayOfWeek: AvailabilityDay; startTime: string; endTime: string; isAvailable: boolean;
}
export interface AvailabilityResponse {
  id: string; doctorId: string; dayOfWeek: string; startTime: string; endTime: string; isAvailable: boolean;
}
