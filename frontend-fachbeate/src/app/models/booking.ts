import { Flightbooking } from "./flightbooking";

export interface Booking {

  creator?: string;
  flightBookings: Flightbooking[],

  releaseManagement?: Date;
  releaserManagement?: string;

  releaseSupervisor?: Date;
  releaserSupervisor?: string;


  carRenting?: boolean;
  hotelBooking?: boolean;
  trainTicket?: boolean;
  forkFlightBooking?: boolean;
  flightBooking?: boolean;
}
