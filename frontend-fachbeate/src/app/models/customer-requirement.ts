import { Company } from "./company";
import { CustomerVisit } from "./customer-visit";
import { Representative } from "./representative";
import { Technologist } from "./technologist";

export interface CustomerRequirement{
    id?: number;
    showUser?: boolean;

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
    company?: Company;
    contact?: string;
    representative?: Representative;
    customerVisits: CustomerVisit[];
    furtherNotes?: string;
    internalNote?: string;

}
