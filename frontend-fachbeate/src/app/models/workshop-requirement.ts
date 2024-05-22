import { TechnologistAppointment } from "./technologist-appointment";

export interface WorkshopRequirement extends TechnologistAppointment {
    subject: string;
    company: string;
    amountParticipants?: number;
    travelFrom?: string;
    travelType?: string;
    language?: string;
    shouldBeTranslated?: boolean;
    seminarPresenter?: string;

    
    locationAndDesiredPlace?: string;
    locationFromDate?: Date;
    locationToDate?: Date;
    amountSingleRooms?: number;
    amountDoubleRooms?: number;

    
    flightHereDateTime?: Date;
    flightReturnDateTime?: Date;
    flightFrom?: string;
    flightTo?: string;
    otherTravelRequests?: string;

    trip?: boolean;
    tripDateTime?: Date;
    tripLocation?: string;
    otherTripRequests?: string;

    meal?: boolean;
    mealAmount?: number;
    mealDateTime?: Date;
    mealWishes?: number[];
    customerPresent?: boolean;
    diploma?: boolean;
    otherRequests?: string;
}
