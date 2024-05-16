import { Technologist } from "./technologist";

export interface FinalReport {
    technologist?: Technologist;
    company?: string;
    dateOfVisit?: Date;
    reason?: boolean[];

    customerFeedback?: string;
    nextSteps?: string;
    nextStepsTechnologist?: string;
    nextStepsUntil?: string;
    furtherInformations?: string;
}
