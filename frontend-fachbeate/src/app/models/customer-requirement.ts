import { CustomerVisit } from "./customer-visit";
import { TechnologistAppointment } from "./technologist-appointment";

export interface CustomerRequirement extends TechnologistAppointment {
    company: string;
    contact: string;
    customerVisits: CustomerVisit[];
    flightBooking: string;
    hotelBooking: string;
    furtherNotes: string;
    internalNote: string;
}
