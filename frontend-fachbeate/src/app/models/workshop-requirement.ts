import { Guest } from "./guest";
import { Technologist } from "./technologist";

export interface WorkshopRequirement{
    id?: number;
    
    requestedTechnologist?: Technologist[];
    startDate?: Date;
    endDate?: Date;

    dateOfCreation?: Date;

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
    tripDate?: Date;
    tripTime?: string;
    tripLocation?: string;
    otherTripRequests?: string;

    companyTour?: boolean;
    tourAmount?: number;
    tourDate?: Date;
    tourTime?: string;
    languageEnglish?: boolean;

    meal?: boolean;
    mealAmount?: number;
    mealDate?: Date;
    mealTime?: string;
    mealWishesVegan?: number;
    mealWishesVegetarian?: number;
    otherMealWishes?: string;
    otherMealWishesAmount?: number;

    customerPresent?: boolean;
    diploma?: boolean;
    otherRequests?: string;


    guests?: Guest[];

    techSelection: number[];
}
