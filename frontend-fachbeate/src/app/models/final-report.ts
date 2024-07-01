import { ReasonReport } from "./reason-report";

export interface FinalReport {

    id?: number;
    state?: string;

    technologist?: string;
    representative?: string;
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
