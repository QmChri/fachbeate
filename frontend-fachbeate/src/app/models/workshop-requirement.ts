import { Technologist } from "./technologist";
import { TechnologistAppointment } from "./technologist-appointment";

export interface WorkshopRequirement{
    id?: number;
    
    requestedTechnologist?: Technologist[];
    startDate?: Date;
    endDate?: Date;
    releaseManagement?: Date;
    releaseSupervisor?: Date;
    flightBooking?: boolean;
    hotelBooking?: boolean;
    reason?: string;

    subject?: string;
    company?: string;
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

    companyTour?: boolean;
    tourAmount?: number;
    tourDateTime?: Date;
    languageEnglish?: boolean;

    meal?: boolean;
    mealAmount?: number;
    mealDateTime?: Date;
    mealWishesVegan?: number;
    mealWishesVegetarian?: number;
    otherMealWishes?: string;
    otherMealWishesAmount?: number;

    customerPresent?: boolean;
    diploma?: boolean;
    otherRequests?: string;


    techSelection: number[];
}
