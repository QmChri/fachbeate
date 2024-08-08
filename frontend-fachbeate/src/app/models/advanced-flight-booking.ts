export interface AdvancedFlightBooking {
    flightDate?: Date;
    flightFrom?: string;
    alternativeFlightFrom?: string;
    flightTo?: string;
    alternativeFlightTo?: string;
    preferredTime?: string;
    luggageCount?: number;
    luggageWeight?: string;
    otherNotes?: string;
}