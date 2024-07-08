import { Company } from "./company";
import { Guest } from "./guest";
import { Hotelbooking } from "./hotelbooking";
import { Representative } from "./representative";
import { Technologist } from "./technologist";

export interface WorkshopRequirement{
    id?: number;
    
    showUser?: boolean;

    requestedTechnologist?: Technologist[];
    startDate?: Date;
    endDate?: Date;

    dateOfCreation?: Date;

    releaseManagement?: Date;
    releaserManagement?: string;

    releaseSupervisor?: Date;
    releaserSupervisor?: string;

    creator?: string;
    lastEditor?: string;

    
    flightBooking?: boolean;
    hotelBooking?: boolean;
    reason?: string;

    subject?: string;
    
    company?: Company;
    customer?: string;


    amountParticipants?: number;
    travelFrom?: string;
    travelType?: string;
    language?: string;
    shouldBeTranslated?: boolean;
    
    
    representative?: Representative;

    hotelBookings?: Hotelbooking[];    
    
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
    mealDateFrom?: Date;
    mealDateTo?: Date;
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
