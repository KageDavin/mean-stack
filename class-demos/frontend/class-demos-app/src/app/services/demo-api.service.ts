import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DemoApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/demos';

  getDemos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
