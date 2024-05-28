export interface ReasonReport {
    id?:number;
    reason?: number;

    carriedOutActivity?: string;
    presentedArticle?: string;
    
    reworkByTechnologist?: boolean;
    reworkByTechnologistDoneUntil?: Date;
    state?: boolean;

    reworkByRepresentive?: boolean;
    reworkByRepresentativeDoneUntil?: Date;

}
