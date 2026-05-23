import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Timesheet, TimesheetRequest } from '../models/timesheet.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimesheetService {
  private url = `${environment.apiUrl}/timesheets`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Timesheet[]>(this.url); }
  getByDesenvolvedor(desenvolvedorId: number) { return this.http.get<Timesheet[]>(`${this.url}/desenvolvedor/${desenvolvedorId}`); }
  getBySprint(sprintId: number) { return this.http.get<Timesheet[]>(`${this.url}/sprint/${sprintId}`); }
  create(data: TimesheetRequest) { return this.http.post<Timesheet>(this.url, data); }
  update(id: number, data: TimesheetRequest) { return this.http.put<Timesheet>(`${this.url}/${id}`, data); }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
