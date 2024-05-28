import { ReasonReport } from "./reason-report";
import { Technologist } from "./technologist";

export interface FinalReport {

    id?: number;
    state?: string;

    technologist?: string;
    representative?: string;
    dateOfVisit?: Date;
    company?: string;
    companyNr?: string;

    reasonReports?: ReasonReport[];

    customerContactDate?: Date;
    responseCustomer?: string;
    furtherActivities?: string;
    doneUntil?: Date;
    // Mit Plus Möglichkeit noch einmal dasselbe einzugeben (Folge Nacharbeit)??

    interestingProducts?: string;
    requestCompleted?: boolean;
    summaryFinalReport?: string;
}
