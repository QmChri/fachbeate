import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private history: string[] = [];
  private performanceHistory: string[] = [];

  constructor() {
  }

  log(message: string) {
    let msg = new Date + ": " + JSON.stringify(message)

    this.history.push(msg);
    console.log(msg);
  }

  performance(
    componentName: string,
    message: string,
    time: number,
  ) {

    this.performanceHistory.push(`${componentName} [${this.getUniqueId()}] ${message} at ${time.toFixed(6)} ms (${(time/1000).toFixed(3)}s)`);
    //console.log(`${componentName} [${componentId}] ${state} at ${time.toFixed(6)} ms (${(time/1000).toFixed(3)}s)`);
  }

  getUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getHistory(): string[] {
    return this.history;
  }

  getPerformanceHistory(): string[] {
    return this.performanceHistory;
  }

}
