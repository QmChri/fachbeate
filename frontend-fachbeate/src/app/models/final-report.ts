import { Technologist } from "./technologist";

export interface FinalReport {

    id?: number;

    technologist?: string;
    company?: string;
    dateOfVisit?: Date;
    reason?: number[];

    customerFeedback?: string;
    nextSteps?: string;
    nextStepsTechnologist?: string;
    nextStepsUntil?: string;
    furtherInformation?: string;
}
