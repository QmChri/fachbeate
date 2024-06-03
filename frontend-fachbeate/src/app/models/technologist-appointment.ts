import { Technologist } from "./technologist";

export interface TechnologistAppointment {
    id?: number;
    requestedTechnologist?: Technologist;
    startDate?: Date;
    endDate?: Date;
    releaseManagement?: Date;
    releaseSupervisor?: Date;
    flightBooking?: boolean;
    hotelBooking?: boolean;
    reason?: string;
}