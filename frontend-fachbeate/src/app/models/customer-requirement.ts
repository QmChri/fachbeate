import { CustomerVisit } from "./customer-visit";
import { Representative } from "./representative";
import { TechnologistAppointment } from "./technologist-appointment";

export interface CustomerRequirement extends TechnologistAppointment {
    id?: number;
    company?: string;
    contact?: string;
    representative?: Representative;
    customerVisits: CustomerVisit[];
    furtherNotes?: string;
    internalNote?: string;

}
