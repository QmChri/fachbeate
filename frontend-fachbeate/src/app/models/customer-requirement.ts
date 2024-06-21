import { Company } from "./company";
import { CustomerVisit } from "./customer-visit";
import { Representative } from "./representative";
import { Technologist } from "./technologist";

export interface CustomerRequirement{
    id?: number;
    requestedTechnologist?: Technologist;
    startDate?: Date;
    endDate?: Date;

    dateOfCreation?: Date;

    releaseManagement?: Date;
    releaserManagement?: string;

    releaseSupervisor?: Date;
    releaserSupervisor?: string;

    creator?: string;
    lastEditor?: string;
    
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
