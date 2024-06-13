import { Article } from "./article";

export interface ReasonReport {
    id?:number;
    reason?: number;

    carriedOutActivity?: string;
    presentedArticle: Article[];
    
}
