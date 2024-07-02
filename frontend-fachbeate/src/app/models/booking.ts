import { Flightbooking } from "./flightbooking";

export interface Booking {

  flightBookings: Flightbooking[],

  carRenting?: boolean;
  hotelBooking?: boolean;
  trainTicket?: boolean;
  forkFlightBooking?: boolean;
  flightBooking?: boolean;
}
