import { Article } from "./article";

export interface ReasonReport {
    id?:number;
    reason?: number;

    presentedArticle: Article[];

}
