import { FinalReport } from "./final-report";

export class CustomerVisit {
    id?: number;
    companyName?: string;
    customerNr?: string;
    address?: string;
    contactPerson?: string;
    fromDateOfVisit?: Date;
    toDateOfVisit?: Date;
    productionAmount?: string;
    presentationOfNewProducts: boolean;
    existingProducts: boolean;
    recipeOptimization: boolean;
    sampleProduction: boolean;
    training: boolean;

    finalReport?: FinalReport;

    editId: number;
    selection?: number[];

    dateSelect?: Date[];

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
        this.editId = 0;
        this.id = id,
            this.companyName = companyName,
            this.customerNr = customerNr,
            this.address = address,
            this.contactPerson = contactPerson,
            this.toDateOfVisit = dateOfVisit,
            this.fromDateOfVisit = dateOfVisit
            this.presentationOfNewProducts = presentationOfNewProducts,
            this.existingProducts = existingProducts,
            this.recipeOptimization = recipeOptimization,
            this.sampleProduction = sampleProduction,
            this.training = training,
            this.productionAmount = productionAmount
        this.finalReport = {}
    }
}