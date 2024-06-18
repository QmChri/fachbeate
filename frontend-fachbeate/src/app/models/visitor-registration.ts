import { Guest } from "./guest";
import { Hotelbooking } from "./hotelbooking";
import { PlannedDepartmentVisit } from "./planned-department-visit";

export interface VisitorRegistration {
    id?: number;
    dateOfCreation?: Date;
    name?: string;
    typeOfFormular?: string;
    // typeOfFormular zu reason umbenennen
    //TODO neues Feld hinzugefügt --> muss im Backend noch gemacht werden
    reason?: string;
    fromDate?: Date;
    fromTime?: string;
    toDate?: Date;
    toTime?: string;
    customerOrCompany?: string;
    arrivalFromCountry?: string;
    reasonForVisit?: string;
    languageEN?: boolean;
    responsibleSupervisor?: string;
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

    //TODO neu muss im Backend noch hinzugefügt werden
    hotelBookings: Hotelbooking[]

    lunchNumber?: number;
    lunchDate?: Date;
    lunchTime?: string;
    veganMeals?: number;
    vegetarianMeals?: number;
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
