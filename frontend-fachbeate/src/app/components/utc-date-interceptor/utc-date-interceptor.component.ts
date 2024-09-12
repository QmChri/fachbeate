import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UtcDateInterceptorComponent implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Überprüfe, ob der Request ein Body hat und klone ihn
    const clonedRequest = req.clone({
      body: this.convertDatesToUTC(req.body)
    });

    // Führe den Request mit dem neuen Body weiter
    return next.handle(clonedRequest);
  }

  // Funktion zur Umwandlung von Datumswerten in UTC
  private convertDatesToUTC(data: any): any {
    if (!data || typeof data !== 'object') {
      return data; // Wenn kein Body vorhanden ist oder keine Objektdaten übermittelt werden
    }

    const convertedData = { ...data }; // Kopiere das ursprüngliche Objekt

    Object.keys(convertedData).forEach(key => {
      // Wenn der Wert ein Datum ist, in UTC umwandeln
      if (convertedData[key] instanceof Date) {
        convertedData[key] = this.convertDateToUTC(convertedData[key]);
      }
    });

    return convertedData;
  }

  // Funktion zur Konvertierung von Date-Objekten in UTC-Format (ISO-String)
  private convertDateToUTC(date: Date): string {
    if (!date) {
      return "";
    }
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
  }
}
