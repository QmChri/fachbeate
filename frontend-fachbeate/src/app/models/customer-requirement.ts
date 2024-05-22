import { CustomerVisit } from "./customer-visit";
import { TechnologistAppointment } from "./technologist-appointment";

export interface CustomerRequirement extends TechnologistAppointment {
    id?: number;
    company?: string;
    contact?: string;
    representative?: string;
    customerVisits: CustomerVisit[];
    furtherNotes?: string;
    internalNote?: string;

}
