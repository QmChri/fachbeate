import { TechnologistAppointment } from "./technologist-appointment";

export interface WorkshopRequirement extends TechnologistAppointment {
    subject: string;
    company: string;
    amountParticipants: number;
    travelFrom: string;
    travelType: string;
    language: string;
    shouldBeTranslated: boolean;
    seminarPresenter: string;
    hotelBooking: boolean;
    locationAndDesiredPlace: string;
    locationFromDate: Date;
    locationToDate: Date;
    amountSingleRooms: number;
    amountDoubleRooms: number;
    flightBooking: boolean;
    flightHereDateTime: Date;
    flightReturnDateTime: Date;
    flightFrom: string;
    flightTo: string;
    otherTravelRequests: string;
}