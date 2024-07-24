import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /**
   * *Propiedades
   */
  private URL: string = 'https://rivendel.com.es/query.php';

  constructor(private httpClient: HttpClient) { }

  public http(data: any): Observable<Object> { return this.httpClient.post(this.URL, data) }
}
