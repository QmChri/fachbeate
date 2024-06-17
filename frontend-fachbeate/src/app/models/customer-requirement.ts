import { Company } from "./company";
import { CustomerVisit } from "./customer-visit";
import { Representative } from "./representative";
import { Technologist } from "./technologist";
import { TechnologistAppointment } from "./technologist-appointment";

export interface CustomerRequirement{
    id?: number;
    requestedTechnologist?: Technologist;
    startDate?: Date;
    endDate?: Date;

    dateOfCreation?: Date;

    releaseManagement?: Date;
    releaseSupervisor?: Date;
    flightBooking?: boolean;
    hotelBooking?: boolean;
    reason?: string;
    company?: Company;
    contact?: string;
    representative?: Representative;
    customerVisits: CustomerVisit[];
    furtherNotes?: string;
    internalNote?: string;

}
