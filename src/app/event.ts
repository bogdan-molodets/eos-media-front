export class Event {
  id: number;
  title: string;
  description: string;
  event_type: number;
  start_date: number;
  approval_status: boolean;
  end_date: string;
  event_lat: number;
  event_lon: number;
  affected_area: object;
}
