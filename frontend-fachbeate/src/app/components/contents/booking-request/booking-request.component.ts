import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { RoleService } from '../../../services/role.service';
import { HttpService } from '../../../services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Booking } from '../../../models/booking';
import { CheckDialogComponent } from '../check-dialog/check-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { log } from '../../../services/logger.service';
import { environment } from '../../../../environments/environment';
import { MultipleFileUploadRequest } from '../../../models/multiple-file-upload-request';
import { FileUploadRequest } from '../../../models/file-upload-request';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.scss'
})
export class BookingRequestComponent implements OnInit {
  control = new FormControl(null, Validators.required);
  addItem: string = "";

  fileList: NzUploadFile[] = [];
  fileUpload: MultipleFileUploadRequest = { files: [] };

  buttonSelect: String[] = []
  bookingControl = new FormControl<BookingRequestComponent | null>(null, Validators.required);
  freigegeben: boolean = true;
  inputBooking: Booking = {
    flights: [],
    hotelBookings: []
  };

  constructor(private dialog: MatDialog, private translate: TranslateService, private http: HttpService, private route: ActivatedRoute,
    private notificationService: NotificationService, public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.http.getBookingById(parseInt(params.get('id')!)).subscribe({
          next: data => {
            if (data != null) {
              this.inputBooking = data;

              this.inputBooking.mainStartDate = this.convertToDate(this.inputBooking.mainStartDate);
              this.inputBooking.mainEndDate = this.convertToDate(this.inputBooking.mainEndDate);

              if (this.inputBooking.files !== null && this.inputBooking.files !== undefined && this.inputBooking.files.length !== 0) {
                this.fileList = this.inputBooking.files!.map((file, index) => ({
                  uid: index.toString(),
                  name: file.fileName,
                  status: "done",
                  originFileObj: this.base64ToFile(file.fileContent, file.fileName),
                  url: environment.backendApi + "booking/file/" + this.inputBooking.id + "/" + file.fileName
                }));
              }

              this.buttonSelect = [
                (data.hotelBooking) ? "4" : "",
                (data.flightBookingMultiLeg) ? "1" : "",
                (data.flightBookingRoundTrip) ? "2" : "",
                (data.trainTicketBooking) ? "3" : "",
                (data.carRental) ? "5" : "",
                (data.otherReq) ? "6" : ""
              ].filter(p => p != "");
            }
          },
          error: err => {
            log("booking-request: ", err)
          }
        });
      }
    });
  }

  base64ToFile(base64: string, filename: string): File {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename);
  }

  checkRequired(): boolean {
    var requirements: string[] = [
      (this.inputBooking.employeeNameAndCompany === null || this.inputBooking.employeeNameAndCompany === undefined || this.inputBooking.employeeNameAndCompany === "") ? "BOOKING_REQUEST.employeeNameAndCompany" : "",
      (this.inputBooking.reasonForTrip === null || this.inputBooking.reasonForTrip === undefined || this.inputBooking.reasonForTrip === "") ? "BOOKING_REQUEST.reasonForTrip" : "",
      (this.inputBooking.mainStartDate === null || this.inputBooking.mainStartDate === undefined) ? "CUSTOMER_REQUIREMENTS.from_to" : "",
      (this.inputBooking.mainEndDate === null || this.inputBooking.mainEndDate === undefined) ? "CUSTOMER_REQUIREMENTS.from_to" : "",
    ];


    if (this.inputBooking.hotelBooking) {
      this.inputBooking.hotelBookings.forEach(s => {
        if (s.hotelLocation === null || s.hotelLocation === undefined || s.hotelLocation === "") {
          requirements.push("BOOKING_REQUEST.locationAndDesiredArea");
        } if ((s.hotelStayFromDate === null || s.hotelStayFromDate === undefined) && (s.hotelStayToDate === null || s.hotelStayToDate === undefined)) {
          requirements.push("CUSTOMER_REQUIREMENTS.from_to");
        }
      });
    }
    if (this.inputBooking.flightBookingMultiLeg) {
      this.inputBooking.flights.forEach(s => {
        if (s.flightDate === null || s.flightDate === undefined) {
          requirements.push("VISITOR_REGRISTRATION.date");
        } if (s.flightFrom === null || s.flightFrom === undefined) {
          requirements.push("BOOKING_REQUEST.fromAirport");
        } if (s.flightTo === null || s.flightTo === undefined) {
          requirements.push("BOOKING_REQUEST.toAirport");
        }
      });
    }
    if (this.inputBooking.flightBookingRoundTrip) {
      requirements.push(
        (this.inputBooking.flightFrom === null || this.inputBooking.flightFrom === undefined || this.inputBooking.flightFrom === "") ? "BOOKING_REQUEST.fromAirport" : "",
        (this.inputBooking.flightTo === null || this.inputBooking.flightTo === undefined || this.inputBooking.flightTo === "") ? "BOOKING_REQUEST.toAirport" : ""
      );
    }
    if (this.inputBooking.trainTicketBooking) {
      requirements.push(
        (this.inputBooking.trainFrom === null || this.inputBooking.trainFrom === undefined || this.inputBooking.trainFrom === "") ? "BOOKING_REQUEST.fromTrainStation" : "",
        (this.inputBooking.trainTo === null || this.inputBooking.trainTo === undefined || this.inputBooking.trainTo === "") ? "BOOKING_REQUEST.toTrainStation" : ""
      )
    }
    if (this.inputBooking.carRental) {
      requirements.push(
        (this.inputBooking.carLocation === null || this.inputBooking.carLocation === undefined || this.inputBooking.carLocation === "") ? "BOOKING_REQUEST.pickupAndReturnLocation" : "",
        ((this.inputBooking.carFrom === null || this.inputBooking.carFrom === undefined) && (this.inputBooking.carTo === null || this.inputBooking.carTo === undefined)) ? "CUSTOMER_REQUIREMENTS.from_to" : "");
    }
    /*
     this.buttonSelect = [
          (data.hotelBooking) ? "4" : "",
          (data.flightBookingMultiLeg) ? "1" : "",
          (data.flightBookingRoundTrip) ? "2" : "",
          (data.trainTicketBooking) ? "3" : "",
          (data.carRental) ? "5" : "",
          (data.otherReq) ? "6" : ""
        ].filter(p => p != "");
    */

    requirements = requirements.filter(element => element !== "");
    if (requirements.length !== 0) {
      this.translate.get(['STANDARD.please_fill_required_fields', ...requirements.map(element => element)]).subscribe(translations => {
        const message = translations['STANDARD.please_fill_required_fields'];
        const anotherMessage = requirements.map(element => translations[element]).toString();
        this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
      });
    }

    return requirements.length === 0;
  }

  release(department: string) {
    if (department === 'gl' && this.checkRequired()) {
      this.getNotification(2);
      this.inputBooking.releaseManagement = new Date();
      this.inputBooking.releaserManagement = this.roleService.getUserName()
      this.postBooking();

      this.http.sendMail(
        ["abteilungsleitung"],
        "R_" + this.inputBooking.id,
        "Freigabe GL",
        "Im Request Tool wurde eine Reisebuchung Anforderung (Nr." + this.inputBooking.id + ") eingegeben und seitens GL freigegeben - bitte um kontrolle und Freigabe durch AL."
      ).subscribe();
      this.getNotification(10)
    }
    else if (department === 'al' && this.checkRequired()) {
      this.getNotification(3);
      this.inputBooking.releaseSupervisor = new Date();
      this.inputBooking.releaserSupervisor = this.roleService.getUserName()
      this.postBooking();

      this.http.sendMail(
        ["fachberater", "front-office", "creator"],
        "R_" + this.inputBooking.id,
        "Freigabe AL",
        "Ihre Reisebuchung Anforderung (Nr." + this.inputBooking.id + ") wurde erfolgreich freigegeben. Bitte prüfen Sie noch einmal ihre Anforderung, es ist möglich das Daten aus organisatorischen Gründen geändert wurden"
      ).subscribe();
      this.getNotification(11)
    }
  }



  getPdf() {
    if (this.inputBooking.id === null || this.inputBooking.id === undefined) {
      this.getNotification(9)
    }
    else {
      this.downloadFile();
      this.getNotification(8)
    }
  }

  checkPopup() {
    //if (this.checkRequired()) {
    const dialogRef = this.dialog.open(CheckDialogComponent, {
      width: '50%',
      data: 3
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === true) {
          this.postBooking();
        }
      });
    // }
  }

  postBooking() {
    var sendmail: boolean = false;

    if (this.checkRequired()) {
      if (this.inputBooking.id === null || this.inputBooking.id === undefined || this.inputBooking.id === 0) {
        this.inputBooking.dateOfCreation = new Date();
        this.inputBooking.creator = this.roleService.getUserName();
        sendmail = true;
        this.getNotification(12);
      }
      this.inputBooking.lastEditor = this.roleService.getUserName();

      this.inputBooking.showUser = true;

      (this.inputBooking.mainStartDate !== null && this.inputBooking.mainStartDate !== undefined) ? new Date(this.inputBooking.mainStartDate!.toString()).setHours(5) : "";
      (this.inputBooking.mainEndDate !== null && this.inputBooking.mainEndDate !== undefined) ? new Date(this.inputBooking.mainStartDate!.toString()).setHours(5) : "";
      this.inputBooking.lastEditor = this.inputBooking.lastEditor;

      this.inputBooking.hotelBookings.forEach(element => {
        element.hotelStayFromDate = (element.hotelStayFromDate !== null && element.hotelStayFromDate !== undefined) ? new Date(new Date(element.hotelStayFromDate!.toString()).setHours(5)) : undefined;
        element.hotelStayToDate = (element.hotelStayToDate !== null && element.hotelStayToDate !== undefined) ? new Date(new Date(element.hotelStayToDate!.toString()).setHours(5)) : undefined;
      });

      this.inputBooking.flights.forEach(element => {
        element.flightDate = (element.flightDate !== null && element.flightDate !== undefined) ? new Date(new Date(element.flightDate!.toString()).setHours(5)) : undefined;
      });
      this.inputBooking.carFrom = (this.inputBooking.carFrom !== null && this.inputBooking.carFrom !== undefined) ? new Date(new Date(this.inputBooking.carFrom!.toString()).setHours(5)) : undefined;

      this.http.postBookingRequest(this.inputBooking).subscribe({
        next: data => {
          this.getNotification(1);
          this.inputBooking = data;

          if (this.fileList.length !== 0 && data.id !== 0 && data.id !== undefined && data.id !== null) {
            this.http.postFiles(this.fileUpload, "booking_" + data.id!).subscribe();
          }


          if (sendmail) {
            this.http.sendMail(
              ["geschaeftsleitung"],
              "R_" + this.inputBooking.id,
              "Eingabe Reisebuchung Anforderung",
              "Im Request Tool wurde ein neue Reisebuchung Anforderung (Nr." + this.inputBooking.id + ") eingegeben - bitte um Freigabe durch GL."
            ).subscribe();
          }

          this.buttonSelect = [
            (data.hotelBooking) ? "4" : "",
            (data.flightBookingMultiLeg) ? "1" : "",
            (data.flightBookingRoundTrip) ? "2" : "",
            (data.trainTicketBooking) ? "3" : "",
            (data.carRental) ? "5" : "",
            (data.otherReq) ? "6" : ""
          ].filter(p => p != "");
        },
        error: err => {
          log("booking-request: ", err)
        }
      })
    }
  }

  changeSelections() {
    this.inputBooking.flightBookingMultiLeg = this.buttonSelect.includes("1");
    this.inputBooking.flightBookingRoundTrip = this.buttonSelect.includes("2");
    this.inputBooking.trainTicketBooking = this.buttonSelect.includes("3");
    this.inputBooking.hotelBooking = this.buttonSelect.includes("4");
    this.inputBooking.carRental = this.buttonSelect.includes("5");
    this.inputBooking.otherReq = this.buttonSelect.includes("6");


    if (this.inputBooking.flightBookingMultiLeg && this.inputBooking.flights.length === 0) {
      this.addTab(1);
    }
    if (this.inputBooking.hotelBooking && this.inputBooking.hotelBookings.length === 0) {
      this.addTab(2);
    }
  }

  addTab(type: number) {
    if (type === 1) {
      this.inputBooking.flights = [...this.inputBooking.flights, {}]
    } else if (type === 2) {
      this.inputBooking.hotelBookings = [...this.inputBooking.hotelBookings, {}]
    }
  }

  deleteLast(type: number) {
    if (this.inputBooking.flights.length > 1 && type === 1) {
      this.inputBooking.flights.pop();
    } else if (this.inputBooking.hotelBookings.length > 1 && type === 2) {
      this.inputBooking.hotelBookings.pop();
    }
  }

  convertToDate(date: any): Date | undefined {
    return (date !== null && date !== undefined) ? new Date(date.toString()) : undefined;
  }

  downloadFile() {
    this.http.getBookingPdf(this.inputBooking.id!).subscribe(
      (response: Blob) => {
        this.saveFile(response, "Reiseanforderung_" + this.inputBooking.id + ".pdf")
      });
  }

  private saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const icCorrectFileType = file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/heif';
    const isLt2M = file.size! / 1024 / 1024 < 1;

    if (!icCorrectFileType) {
      this.getNotification(1);
      return false;
    }
    if (this.fileList.length >= 5) {
      this.getNotification(2);
      return false;
    }
    if (!isLt2M) {
      this.getNotification(3);
      return false;
    }
    // Datei zur Liste hinzufügen
    this.fileList = [...this.fileList, file];
    this.getNotification(0);
    return true;
  };

  handleChange(info: { fileList: NzUploadFile[] }): void {
    this.fileList = info.fileList;

    this.fileUpload = this.convertFileListToBase64()

  }

  convertFileListToBase64() {
    var multipleFileUpload: MultipleFileUploadRequest = { files: [] };

    this.fileList.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Data = (fileReader.result as string).split(',')[1]; // Entferne den Base64-Header

        var tmpFile: FileUploadRequest = { fileContent: base64Data, fileName: file.name }
        multipleFileUpload.files!.push(tmpFile);
      };
      fileReader.readAsDataURL(file.originFileObj as File); // Konvertiere Datei zu base64
    });

    return multipleFileUpload;
  }


  getNotification(type: number) {
    switch (type) {
      case 1: { //Formular wurde gesendet
        if (this.freigegeben) {
          this.translate.get('STANDARD.form_sent').subscribe((translatedMessage: string) => {
            this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
          });
        }
        break;
      }
      case 2: { // Freigabe GL
        this.translate.get('STANDARD.approval_from_gl_granted').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        this.freigegeben = false;
        break;
      }
      case 3: { // Freigabe AL
        this.translate.get('STANDARD.approval_from_al_granted').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        this.freigegeben = false;
        break;
      }
      case 4: { //Files hochgeladen
        this.translate.get('ABSCHLUSSBERICHT.files_uploaded').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, '', 'topRight');
        });
        break;
      }
      case 5: { //Files nicht erlaubt
        this.translate.get(['ABSCHLUSSBERICHT.files_allowed', 'ABSCHLUSSBERICHT.files_allowed_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_allowed'];
            const message2 = translations['ABSCHLUSSBERICHT.files_allowed_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 6: { // maximal 5 Files
        this.translate.get(['ABSCHLUSSBERICHT.files_count', 'ABSCHLUSSBERICHT.files_count_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_count'];
            const message2 = translations['ABSCHLUSSBERICHT.files_count_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 7: { //maximal 2 MB per file
        this.translate.get(['ABSCHLUSSBERICHT.files_size', 'ABSCHLUSSBERICHT.files_size_2'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['ABSCHLUSSBERICHT.files_size'];
            const message2 = translations['ABSCHLUSSBERICHT.files_size_2'];
            this.notificationService.createBasicNotification(4, message1, message2, 'topRight');
          });
        break;
      }
      case 8: { // Pdf wurde erstellt
        this.translate.get('STANDARD.pdf1').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(0, translatedMessage, "Reiseanforderung_" + this.inputBooking.id + ".pdf", 'topRight');
        }); break;
      }
      case 9: { // Pdf konnte nicht erstellt werden
        this.translate.get('STANDARD.pdf2').subscribe((translatedMessage: string) => {
          this.notificationService.createBasicNotification(4, translatedMessage, "Reiseanforderung_" + this.inputBooking.id + ".pdf", 'topRight');
        }); break;
      }
      case 10: { // Freigabe GL
        this.translate.get(['MAIL.sended', 'MAIL.gl'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.gl'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 11: { // Freigabe AL
        this.translate.get(['MAIL.sended', 'MAIL.al'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.al'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      case 12: { // Eingabe Reisebuchung Anforderung
        this.translate.get(['MAIL.sended', 'MAIL.A_4'])
          .subscribe((translations: { [key: string]: string }) => {
            const message1 = translations['MAIL.sended'];
            const message2 = translations['MAIL.A_4'];
            this.notificationService.createBasicNotification(0, message1, message2, 'topRight');
          });
        break;
      }
      /*case 4: { // Pflichtfelder ausfüllen

        this.translate.get(['STANDARD.please_fill_required_fields', 'STANDARD.assigned_representative']).subscribe(translations => {
          const message = translations['STANDARD.please_fill_required_fields'];
          const anotherMessage = translations['STANDARD.assigned_representative'];
          this.notificationService.createBasicNotification(4, message, anotherMessage, 'topRight');
        }); break;
      } */
    }
  }


}
