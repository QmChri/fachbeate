import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerRequirement } from '../models/customer-requirement';
import { Observable } from 'rxjs';
import { Technologist } from '../models/technologist';



const API_URL = "http://localhost:8080/"


@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private http: HttpClient) { }

  postCustomerRequirement(customerRequirement: CustomerRequirement): Observable<CustomerRequirement>{
    return this.http.post<CustomerRequirement>(API_URL + "appointment/customerRequirement", customerRequirement);
  }


  getTechnologist(): Observable<Technologist[]>{
    return this.http.get<Technologist[]>(API_URL + "technologist/allActive");
  }

}
