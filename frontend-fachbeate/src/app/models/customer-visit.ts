import { FinalReport } from "./final-report";

export class CustomerVisit {
    id: number;
    companyName?: string;
    customerNr?: string;
    address?: string;
    contactPerson?: string;
    dateOfVisit?: Date;
    productionAmount?: string;
    presentationOfNewProducts: boolean;
    existingProducts: boolean;
    recipeOptimization: boolean;
    sampleProduction: boolean;
    training: boolean;

    finalReport: FinalReport;

    selection?: string[];

    constructor(id: number,
        companyName: string,
        customerNr: string,
        address: string,
        contactPerson: string,
        dateOfVisit: Date,
        presentationOfNewProducts: boolean,
        existingProducts: boolean,
        recipeOptimization: boolean,
        sampleProduction: boolean,
        training: boolean,
        productionAmount: string
    ) {
        this.id = id,
        this.companyName = companyName,
        this.customerNr = customerNr,
        this.address = address,
        this.contactPerson = contactPerson,
        this.dateOfVisit = dateOfVisit,
        this.presentationOfNewProducts = presentationOfNewProducts,
        this.existingProducts = existingProducts,
        this.recipeOptimization = recipeOptimization,
        this.sampleProduction = sampleProduction,
        this.training = training,
        this.productionAmount = productionAmount
        this.finalReport = {}
    }
}