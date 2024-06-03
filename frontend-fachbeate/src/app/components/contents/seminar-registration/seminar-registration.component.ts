import { Component, OnInit } from '@angular/core';
import { WorkshopRequirement } from '../../../models/workshop-requirement';
import { HttpService } from '../../../services/http.service';
import { Technologist } from '../../../models/technologist';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seminar-registration',
  templateUrl: './seminar-registration.component.html',
  styleUrl: './seminar-registration.component.scss'
})
export class SeminarRegistrationComponent implements OnInit{
  buttonSelect: string[] = []

  addItem: string = "";
  reasonSelect: number = 0;
  languages: string[] = ['DE','EN','RU'];


  addToList(addItem: string){
    this.languages.push(addItem);
  }

  inputWorkshop: WorkshopRequirement = {
    //0- Vegan, 1- Vegetarisch, 2- Sonstige
    mealWishes: [undefined!, undefined!, undefined!]
  };

  technologists: Technologist[] = [];

  constructor(private http: HttpService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    console.log(this.inputWorkshop.tripDateTime);
    
    this.route.paramMap.subscribe(params => {
      if(params.get('id') != null){
        this.http.getWorkshopById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if(data != null){
              this.inputWorkshop = data;
              console.log(data);
              
              this.buttonSelect = [
                (data.hotelBooking)?"1":"",
                (data.flightBooking)?"2":"",
                (data.trip)?"3":"",
                (data.companyTour)?"4":"",
                (data.meal)?"5":"",
                (data.customerPresent)?"6":"",
                (data.diploma)?"7":""
              ].filter(p => p != "");
            }
          },
          error: err => {
            console.log(err);
          }
        });
      }
    });

    this.getTechnologists();
  }

  getTechnologists(){
    this.http.getActiveTechnologist().subscribe({
      next: data => {
        this.technologists = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  changeTechnolgist($event: any) {
    this.inputWorkshop.requestedTechnologist = this.technologists.find(elemnt => elemnt.id === $event);
  }

  changeSelections(event: any, section: number){   
    this.buttonSelect = (section === 0)?this.buttonSelect.filter(number => Number(number) >= 6 && Number(number) <= 7):this.buttonSelect.filter(number => Number(number) >= 1 && Number(number) <= 5);
    this.buttonSelect = [...this.buttonSelect, ...event.value]

    this.inputWorkshop.hotelBooking = this.buttonSelect.includes("1");
    this.inputWorkshop.flightBooking = this.buttonSelect.includes("2");
    this.inputWorkshop.trip = this.buttonSelect.includes("3");
    this.inputWorkshop.companyTour = this.buttonSelect.includes("4");
    this.inputWorkshop.meal = this.buttonSelect.includes("5");
    this.inputWorkshop.customerPresent = this.buttonSelect.includes("6");
    this.inputWorkshop.diploma = this.buttonSelect.includes("7");
  }

  postWorkshopRequest(){

    console.log(this.inputWorkshop);
    this.inputWorkshop.reason = "Seminar"


    this.http.postWorkshop(this.inputWorkshop).subscribe({
      next: data => {
        this.inputWorkshop = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  changeDate(event: any, date?: Date){
    console.log(event);
    
  }

}
