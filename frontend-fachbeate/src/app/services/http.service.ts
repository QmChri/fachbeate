import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerRequirement } from '../models/customer-requirement';
import { Observable } from 'rxjs';
import { Technologist } from '../models/technologist';
import { WorkshopRequirement } from '../models/workshop-requirement';
import { TechnologistAppointment } from '../models/technologist-appointment';
import { Representative } from '../models/representative';
import { FinalReport } from '../models/final-report';
import { VisitorRegistration } from '../models/visitor-registration';



const API_URL = "http://10.2.3.72:8079/"


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postCustomerRequirement(customerRequirement: CustomerRequirement): Observable<CustomerRequirement>{
    console.log(customerRequirement);
    
    return this.http.post<CustomerRequirement>(API_URL + "appointment/customerRequirement", customerRequirement);
  }

  getCustomerRequirements() {
    return this.http.get<CustomerRequirement[]>(API_URL + "appointment/customerRequirement");
  }

  getCustomerById(id: number) {
    return this.http.get<CustomerRequirement>(API_URL + "appointment/customerRequirement/id", {params: {id: id}});
  }



  postWorkshop(workshop: WorkshopRequirement): Observable<WorkshopRequirement>{
    return this.http.post<WorkshopRequirement>(API_URL + "appointment/workshop", workshop);
  }

  getWorkshopRequirements(){
    return this.http.get<WorkshopRequirement[]>(API_URL + "appointment/workshop");
  }

  getWorkshopById(id:number){
    return this.http.get<WorkshopRequirement>(API_URL + "appointment/workshop/id", {params: {id: id}});
  }


  postVisitorRegistration(visitorRegistration: VisitorRegistration): Observable<VisitorRegistration>{
    return this.http.post<VisitorRegistration>(API_URL + "appointment/visitorRegistration", visitorRegistration);
  }

  getVisitorRegistration(){
    return this.http.get<VisitorRegistration[]>(API_URL + "appointment/visitorRegistration");
  }

  getVisitorRegistrationById(id:number){
    return this.http.get<VisitorRegistration>(API_URL + "appointment/visitorRegistration/id", {params: {id: id}});
  }



  getAllTechnologist() : Observable<Technologist[]> {
    return this.http.get<Technologist[]>(API_URL+ "technologist");
  }

  getActiveTechnologist(): Observable<Technologist[]>{
    return this.http.get<Technologist[]>(API_URL + "technologist/allActive");
  }

  postTechnologist(technologist: Technologist) {
    return this.http.post(API_URL + "technologist", technologist);
  }



  postRepresentative(representative: Representative): Observable<Representative>{
    return this.http.post(API_URL+ "technologist/representative", representative);
  }  
  
  getAllRepresentative() : Observable<Representative[]> {
    return this.http.get<Representative[]>(API_URL+ "technologist/representative");
  }

  getActiveRepresentative(): Observable<Representative[]>{
    return this.http.get<Representative[]>(API_URL + "technologist/representative/allActive");
  }


  postOtherDate(date: TechnologistAppointment): Observable<TechnologistAppointment>{
    return this.http.post<TechnologistAppointment>(API_URL + "appointment/other", date);
  }

  getOtherAppointments(): Observable<TechnologistAppointment[]>{
    return this.http.get<TechnologistAppointment[]>(API_URL + "appointment/other")
  }

  getOtherAppointmentById(id: number): Observable<TechnologistAppointment>{
    return this.http.get<TechnologistAppointment>(API_URL + "appointment/other/id",{params: {id: id}})
  }


  getFinalReports():Observable<FinalReport[]>{
    return this.http.get<FinalReport[]>(API_URL + "appointment/finalReport");
  }

}
