import { AdvancedFlightBooking } from "./advanced-flight-booking";

export interface Booking {
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
  assumptionOfCosts?: string;
  
  flightBookingMultiLeg?: boolean;
  flightBookings: AdvancedFlightBooking[];
  
  flightBookingRoundTrip?: boolean;
  flightFrom?: string;
  alternativeFlightFrom?: string;
  flightTo?: string;
  alternativeFlightTo?: string;
  
  trainTicketBooking?: boolean;
  trainFrom?: string;
  alternativeTrainFrom?: string;
  trainTo?: string;
  alternativeTrainTo?: string;
  
  hotelBooking?: boolean;
  hotelLocation?: string;
  hotelFrom?: Date;
  hotelTo?: Date;
  otherHotelNotes?: string;
  
  carRental?: boolean;
  carLocation?: string;
  carFrom?: Date;
  carTo?: Date;
  otherCarNotes?: string;
}
