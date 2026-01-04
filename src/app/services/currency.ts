import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AwesomeApiResponse, CurrencyInfo } from '../models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class Currency {
  private http = inject(HttpClient);
  private apiUrl = 'https://economia.awesomeapi.com.br/json/last';

  // Busca cotação, ex: getExchangeRate('USD-BRL')
  getExchangeRate(code: string, codeIn: string): Observable<CurrencyInfo> {
    const pair = `${code}-${codeIn}`; // Ex: "USD-BRL"
    const key = `${code}${codeIn}`;   // Ex: "USDBRL" (como vem na chave do JSON)

    return this.http.get<AwesomeApiResponse>(`${this.apiUrl}/${pair}`).pipe(
      // 'data' é o objeto completo que a API retornou
      map(data => data[key]) 
    );
  }
}
