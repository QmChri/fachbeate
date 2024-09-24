import { AdvancedFlightBooking } from "./advanced-flight-booking";
import { Hotelbooking } from "./hotelbooking";

export interface Booking {
  id?: number;
  dateOfCreation?: Date;
  showUser?: boolean;

  releaserManagement?: string;
  releaseManagement?: Date;

  releaserSupervisor?: string;
  releaseSupervisor?: Date;

  creator?: string;
  lastEditor?: string;

  employeeNameAndCompany?: string;
  reasonForTrip?: string;
  mainStartDate?: Date;
  mainEndDate?: Date;
  otherNotes?: string;

  flightBookingMultiLeg?: boolean;
  flights: AdvancedFlightBooking[];

  flightBookingRoundTrip?: boolean;
  flightFrom?: string;
  alternativeFlightFrom?: string;
  flightTo?: string;
  alternativeFlightTo?: string;

  trainTicketBooking?: boolean;
  trainFrom?: string;
  trainStartDate?: string;
  trainTo?: string;
  trainEndDate?: string;
  trainOtherNotes?: string;

  hotelBooking?: boolean;
  hotelBookings: Hotelbooking[]

  otherReq?: boolean;
  preferredTime?: string;
  windowCorridor?: string;
  luggageCount?: number;
  luggageWeight?: string;
  otherReqOtherNotes?: string;

  carRental?: boolean;
  carLocation?: string;
  carFrom?: Date;
  carTo?: Date;
  otherCarNotes?: string;

  files?: { fileName: string, fileContent: string }[];

}
