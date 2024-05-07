export interface TechnologistAppointment {
    requestedTechnologist: string;
    startDate: Date;
    endDate: Date;
    releaseManagement?: Date;
    releaseSupervisor?: Date;
}