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
import { Company } from '../models/company';
import { Article } from '../models/article';
import {environment} from "../../environments/environment";
import { MainListDTO } from '../models/main-list-dto';
import { TechDateDTO } from '../models/tech-date-dto';

const API_URL = environment.backendApi

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postCustomerRequirement(customerRequirement: CustomerRequirement): Observable<CustomerRequirement>{
      return this.http.post<CustomerRequirement>(API_URL + "customerRequirement", customerRequirement);
  }

  getCustomerRequirementsByUser(type: number, fullname: string[]){
    return this.http.get<MainListDTO[]>(API_URL + "customerRequirement/user", {params: {type: type, fullname: fullname}});
  }

  getCustomerRequirements() {
    return this.http.get<CustomerRequirement[]>(API_URL + "customerRequirement");
  }

  getCustomerById(id: number) {
    return this.http.get<CustomerRequirement>(API_URL + "customerRequirement/id", {params: {id: id}});
  }



  postWorkshop(workshop: WorkshopRequirement): Observable<WorkshopRequirement>{
    return this.http.post<WorkshopRequirement>(API_URL + "workshop", workshop);
  }

  getWorkshopRequirements(){
    return this.http.get<WorkshopRequirement[]>(API_URL + "workshop");
  }

  getWorkshopById(id:number){
    return this.http.get<WorkshopRequirement>(API_URL + "workshop/id", {params: {id: id}});
  }

  getWorkshopByUser(user: number, fullname: string[]): Observable<MainListDTO[]>{
    return this.http.get<MainListDTO[]>(API_URL + "workshop/user", {params: {type: user, fullname: fullname}});
  }


  postVisitorRegistration(visitorRegistration: VisitorRegistration): Observable<VisitorRegistration>{    
    return this.http.post<VisitorRegistration>(API_URL + "visitorRegistration", visitorRegistration);
  }

  getVisitorRegistration(){
    return this.http.get<VisitorRegistration[]>(API_URL + "visitorRegistration");
  }

  getVisitorRegistrationById(id:number){
    return this.http.get<VisitorRegistration>(API_URL + "visitorRegistration/id", {params: {id: id}});
  }

  getVisitorRegistrationByUser(type: number, fullname: string[]){
    
    return this.http.get<MainListDTO[]>(API_URL + "visitorRegistration/user", {params: {type: type, fullname: fullname}});
  }



  getAllTechnologist() : Observable<Technologist[]> {
    return this.http.get<Technologist[]>(API_URL+ "users/technologist");
  }

  /*
  getActiveTechnologist(): Observable<Technologist[]>{
    return this.http.get<Technologist[]>(API_URL + "users/technologist/allActive");
  }
    */

  getActiveWithDates(): Observable<TechDateDTO[]>{
    return this.http.get<TechDateDTO[]>(API_URL + "users/technologist/activeWithDates");
  }

  postTechnologist(technologist: Technologist) {
    return this.http.post(API_URL + "users/technologist", technologist);
  }
  
  
  
  postRepresentative(representative: Representative): Observable<Representative>{
    return this.http.post(API_URL+ "users/representative", representative);
  }  
  
  getAllRepresentative() : Observable<Representative[]> {
    return this.http.get<Representative[]>(API_URL+ "users/representative");
  }

  getActiveRepresentative(): Observable<Representative[]>{
    return this.http.get<Representative[]>(API_URL + "users/representative/allActive");
  }



  postCompany(company: Company): Observable<Company>{
    return this.http.post(API_URL+ "users/company", company);
  }  
  
  getAllCompany() : Observable<Company[]> {
    return this.http.get<Company[]>(API_URL+ "users/company");
  }

  getActiveCompany(): Observable<Company[]>{
    return this.http.get<Company[]>(API_URL + "users/company/allActive");
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

  getOtherAppointmentByUser(type: number, fullname: string[]){
    return this.http.get<TechnologistAppointment[]>(API_URL + "appointment/other/user", {params: {type: type, fullname: fullname}});
  }



  getFinalReports():Observable<FinalReport[]>{
    return this.http.get<FinalReport[]>(API_URL + "appointment/finalReport");
  }

  getFinalReportsByUser(type: number, fullname: string[]):Observable<FinalReport[]>{
    return this.http.get<FinalReport[]>(API_URL + "appointment/finalReportByUser", {params: {type: type, fullname: fullname}});
  }

  postFinalReport(finalReport: FinalReport): Observable<FinalReport>{
    return this.http.post<FinalReport>(API_URL + "appointment/finalReport", finalReport);
  }


  getAllArticles(): Observable<Article[]>{
    return this.http.get<Article[]>(API_URL + "appointment/article");
  }

  changeVisiblility(type: number, id: number):Observable<Boolean>{
    return this.http.get<Boolean>(API_URL + "appointment/visibility", {params: {type: type, id: id}})
  }

}
