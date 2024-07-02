import { ReasonReport } from "./reason-report";
import { Representative } from "./representative";
import { Technologist } from "./technologist";

export interface FinalReport {

    id?: number;
    state?: string;

    creator?: string;
    lastEditor?: string;

    technologist?: Technologist;
    representative?: Representative;
    dateOfVisit?: Date;
    company?: string;
    companyNr?: string;

    reasonReports?: ReasonReport[];

    reworkByTechnologist?: boolean;
    reworkByTechnologistDoneUntil?: Date;
    reworkByTechnologistState?: string;

    reworkByRepresentative?: string;
    reworkByRepresentativeDoneUntil?: Date;


    customerContactDate?: Date;
    responseCustomer?: string;
    furtherActivities?: string;
    doneUntil?: Date;

    interestingProducts?: string;
    requestCompleted?: boolean;
    summaryFinalReport?: string;
}
