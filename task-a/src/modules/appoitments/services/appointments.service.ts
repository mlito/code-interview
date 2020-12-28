/* eslint-disable @typescript-eslint/tslint/config */

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { from,of } from 'rxjs';
import { combineAll, filter, map, tap } from 'rxjs/operators';

import { ListAppointmentQS } from '../dto/requests/ListAppointmentQS';

const jsonPath = 'C:\\Users\\admin\\Dropbox\\Projects\\code-interview\\providers\\providers.json';
@Injectable()
export class AppointmentsService {
  private data: any[];
  constructor(
  ) {
    this.loadData();
  }
  private loadData(): void {
    this.data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  getAppointments(query: ListAppointmentQS) {
    return of(this.data).pipe(
      // eslint-disable-next-line no-restricted-syntax
      map ((data: any) => {
        let items = data;
        if (query.specialty) {
          items = items.filter(dta => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let filterItem = true;
            dta.specialties.forEach((item) => {
            if (item.toLowerCase() === query.specialty.toLowerCase()) {
              filterItem = false;
            } });
            return filterItem;
          });
        }
        if (query.minScore) {
          items = items.filter(dta => dta.score >= parseInt(query.minScore , 10));
        }
        if (query.date) {
          items = items.filter(dta => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let filterItem = true;
            dta.availableDates.forEach((date: {from: number ; to: number}) => {
            if (dta.from <= query.date && dta.to >= query.date) {
              filterItem = false;
            } });
            return filterItem;
          });
        }
        return items;
      }),
    );

  }

}
