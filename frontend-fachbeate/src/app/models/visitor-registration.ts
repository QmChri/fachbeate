import { Guest } from "./guest";
import { Hotelbooking } from "./hotelbooking";
import { PlannedDepartmentVisit } from "./planned-department-visit";
import { Representative } from "./representative";

export interface VisitorRegistration {
    id?: number;
    
    showUser?: boolean;

    name?: string;
    inputReason?: string;
    reason?: string;
    fromDate?: Date;
    fromTime?: string;
    toDate?: Date;
    toTime?: string;
    customerOrCompany?: string;
    arrivalFromCountry?: string;
    reasonForVisit?: string;
    languageEN?: boolean;
    representative?: Representative;
    stayFromDate?: Date;
    stayFromTime?: string;
    stayToDate?: Date;
    stayToTime?: string;
    numberOfPeopleTour?: number;
    tourLanguageEN?: boolean;
    tourDate?: Date;
    tourTime?: string;
    numberOfPeopleMeetingRoom?: number;
    meetingRoomDate?: Date;
    meetingRoomTime?: string;

    releaseManagement?: Date;
    releaserManagement?: string;

    releaseSupervisor?: Date;
    releaserSupervisor?: string;

    creator?: string;
    lastEditor?: string;

    hotelBookings: Hotelbooking[]

    lunchNumber?: number;
    mealDateFrom?: Date;
    mealDateTo?: Date;
    lunchTime?: string;
    veganMeals?: number;
    halalMeals?: number;
    otherMealsDescription?: string;
    otherMealsNumber?: number;
    transferFromDate?: Date;
    transferToDate?: Date;
    otherTravelRequirements?: string;
    transferFrom?: string;
    transferTo?: string;
    plannedDepartmentVisits: PlannedDepartmentVisit[];

    hotelBooking?: boolean;
    flightBooking?: boolean;
    trip?: boolean;
    companyTour?: boolean;
    meal?: boolean;
    customerPresent?: boolean;
    diploma?: boolean;

    guests?: Guest[];
}
