import { Technologist } from "./technologist"

export interface TechDateDTO {
    technologist: Technologist;
    appointments: Date[][];
}
