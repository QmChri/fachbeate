import { ReasonReport } from "./reason-report";
import { Representative } from "./representative";
import { Technologist } from "./technologist";

export interface FinalReport {

    id?: number;
    state?: string;

    creator?: string;
    representativeEntered?: boolean;
    technologistEntered?: boolean;
    lastEditor?: string;

    technologist?: Technologist;
    representative?: Representative;
    dateOfVisit?: Date;
    company?: string;
    companyNr?: string;

    reasonReports?: ReasonReport[];

    reworkByTechnologist?: boolean;
    reworkByTechnologistDoneUntil?: Date;
    reworkFollowVisits?: boolean;
    
    reworkInformation?: boolean;
    reworkRecipe_optimization?: boolean;
    reworkProduct_development?: boolean;

    
    reworkByRepresentative?: string;
    reworkByRepresentativeDoneUntil?: Date;


    customerContactDate?: Date;
    responseCustomer?: string;
    furtherActivities?: string;
    doneUntil?: Date;

    interestingProducts?: string;
    requestCompleted?: boolean;
    summaryFinalReport?: string;

    reworkToDo?: number[];
}
