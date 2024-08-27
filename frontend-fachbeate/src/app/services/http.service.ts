import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { environment } from "../../environments/environment";
import { MainListDTO } from '../models/main-list-dto';
import { TechDateDTO } from '../models/tech-date-dto';
import { Booking } from '../models/booking';
import { Support } from '../models/support';

const API_URL = environment.backendApi

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  postCustomerRequirement(customerRequirement: CustomerRequirement): Observable<CustomerRequirement> {
    return this.http.post<CustomerRequirement>(API_URL + "customerRequirement", customerRequirement);
  }

  getCustomerRequirementsByUser(type: number, fullname: string[]) {
    return this.http.get<MainListDTO[]>(API_URL + "customerRequirement/user", { params: { type: type, fullname: fullname } });
  }

  getCustomerRequirements() {
    return this.http.get<CustomerRequirement[]>(API_URL + "customerRequirement");
  }

  getCustomerById(id: number) {
    return this.http.get<CustomerRequirement>(API_URL + "customerRequirement/id", { params: { id: id } });
  }



  postWorkshop(workshop: WorkshopRequirement): Observable<WorkshopRequirement> {
    return this.http.post<WorkshopRequirement>(API_URL + "workshop", workshop);
  }

  getWorkshopRequirements() {
    return this.http.get<WorkshopRequirement[]>(API_URL + "workshop");
  }

  getWorkshopById(id: number) {
    return this.http.get<WorkshopRequirement>(API_URL + "workshop/id", { params: { id: id } });
  }

  getWorkshopByUser(user: number, fullname: string[]): Observable<MainListDTO[]> {
    return this.http.get<MainListDTO[]>(API_URL + "workshop/user", { params: { type: user, fullname: fullname } });
  }


  postVisitorRegistration(visitorRegistration: VisitorRegistration): Observable<VisitorRegistration> {
    return this.http.post<VisitorRegistration>(API_URL + "visitorRegistration", visitorRegistration);
  }

  getVisitorRegistration() {
    return this.http.get<VisitorRegistration[]>(API_URL + "visitorRegistration");
  }

  getVisitorRegistrationById(id: number) {
    return this.http.get<VisitorRegistration>(API_URL + "visitorRegistration/id", { params: { id: id } });
  }

  getVisitorRegistrationByUser(type: number, fullname: string[]) {

    return this.http.get<MainListDTO[]>(API_URL + "visitorRegistration/user", { params: { type: type, fullname: fullname } });
  }



  getAllTechnologist(): Observable<Technologist[]> {
    return this.http.get<Technologist[]>(API_URL + "users/technologist");
  }

  getActiveTechnologist(): Observable<Technologist[]> {
    return this.http.get<Technologist[]>(API_URL + "users/technologist/allActive");
  }

  getActiveWithDates(): Observable<TechDateDTO[]> {
    return this.http.get<TechDateDTO[]>(API_URL + "users/technologist/activeWithDates");
  }

  postTechnologist(technologist: Technologist) {
    return this.http.post(API_URL + "users/technologist", technologist);
  }



  postRepresentative(representative: Representative): Observable<Representative> {
    return this.http.post(API_URL + "users/representative", representative);
  }

  getAllRepresentative(): Observable<Representative[]> {
    return this.http.get<Representative[]>(API_URL + "users/representative");
  }

  getActiveRepresentative(): Observable<Representative[]> {
    return this.http.get<Representative[]>(API_URL + "users/representative/allActive");
  }



  postCompany(company: Company): Observable<Company> {
    return this.http.post(API_URL + "users/company", company);
  }

  getAllCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(API_URL + "users/company");
  }

  getActiveCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(API_URL + "users/company/allActive");
  }

  deleteAppointment(entry: TechnologistAppointment) {
    return this.http.delete(API_URL + "appointment/delete", { params: { id: entry.id! } });
  }

  postOtherDate(date: TechnologistAppointment): Observable<TechnologistAppointment> {
    return this.http.post<TechnologistAppointment>(API_URL + "appointment/other", date);
  }

  getOtherAppointments(): Observable<TechnologistAppointment[]> {
    return this.http.get<TechnologistAppointment[]>(API_URL + "appointment/other")
  }

  getOtherAppointmentById(id: number): Observable<TechnologistAppointment> {
    return this.http.get<TechnologistAppointment>(API_URL + "appointment/other/id", { params: { id: id } })
  }

  getOtherAppointmentByUser(type: number, fullname: string[]) {
    return this.http.get<TechnologistAppointment[]>(API_URL + "appointment/other/user", { params: { type: type, fullname: fullname } });
  }



  getFinalReports(): Observable<FinalReport[]> {
    return this.http.get<FinalReport[]>(API_URL + "appointment/finalReport");
  }

  getFinalReportsByUser(type: number, fullname: string[]): Observable<FinalReport[]> {
    return this.http.get<FinalReport[]>(API_URL + "appointment/finalReportByUser", { params: { type: type, fullname: fullname } });
  }

  postFinalReport(finalReport: FinalReport): Observable<FinalReport> {
    return this.http.post<FinalReport>(API_URL + "appointment/finalReport", finalReport);
  }

  postFinalReportMultiPart(formData: FormData): Observable<FinalReport>{
    return this.http.post<FinalReport>(API_URL + "appointment/finalReportMulti", formData);
  }


  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(API_URL + "appointment/article");
  }

  changeVisiblility(type: number, id: number): Observable<Boolean> {
    return this.http.get<Boolean>(API_URL + "appointment/visibility", { params: { type: type, id: id } })
  }


  postBookingRequest(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(API_URL + "booking", booking);
  }

  getAllBookings(type: number, fullname: string[]) {
    return this.http.get<MainListDTO[]>(API_URL + "booking/user", { params: { type: type, fullname: fullname } });
  }

  getBookingById(id: number) {
    return this.http.get<Booking>(API_URL + "booking/id", { params: { id: id } });
  }

  postSupport(support: Support): Observable<Support> {
    return this.http.post<Support>(API_URL + "support", support);
  }

  headers: HttpHeaders = new HttpHeaders().set('Accept', 'application/octet-stream');

  getMainListPdf() {
    return this.http.get(API_URL + "/pdf/mainList/", { headers: this.headers, responseType: 'blob' });
  }
  getPdf(id: number) {
    return this.http.get(API_URL + "/pdf/customer/" + id, { headers: this.headers, responseType: 'blob' });
  }
  getVisitPdf(id: number) {
    return this.http.get(API_URL + "/pdf/visit/" + id, { headers: this.headers, responseType: 'blob' });
  }
  getWorkshopPdf(id: number) {
    return this.http.get(API_URL + "/pdf/workshop/" + id, { headers: this.headers, responseType: 'blob' });
  }
  getFinalPdf(id: number) {
    return this.http.get(API_URL + "/pdf/final/" + id, { headers: this.headers, responseType: 'blob' });
  }
  getFinalReportListPdf() {
    return this.http.get(API_URL + "/pdf/finalList/", { headers: this.headers, responseType: 'blob' });
  }
  getBookingPdf(id: number) {
    return this.http.get(API_URL + "/pdf/booking/" + id, { headers: this.headers, responseType: 'blob' });
  }
}
