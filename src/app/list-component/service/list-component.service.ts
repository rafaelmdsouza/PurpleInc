import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonViewModel } from '../../model/PersonViewModel';
import { PersonRequestViewModel } from '../../model/PersonRequestViewModel';

@Injectable({
  providedIn: 'root'
})
export class ListComponentService {

 readonly apiUrl = 'https://purpleinc-api.herokuapp.com/people';

  constructor(
    private http: HttpClient
  ) { }

  getPerson() : Observable<PersonViewModel[]> {
    return this.http.get<PersonViewModel[]>(this.apiUrl);
  }

  getCep(cep: number) : Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  postPerson(data: PersonRequestViewModel): Observable<PersonRequestViewModel> {
    return this.http.post<PersonRequestViewModel>(this.apiUrl, data)
  }

  deletePerson (id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{})
  }

}
