export interface ReasonReport {
    id?:number;
    reason?: number;

    carriedOutActivity?: string;
    //presentedArticle?: Map<number, string>;
    
    reworkByTechnologist?: boolean;
    reworkByTechnologistDoneUntil?: Date;
    state?: boolean;

    reworkByRepresentive?: boolean;
    reworkByRepresentativeDoneUntil?: Date;

}
