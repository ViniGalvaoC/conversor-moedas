import { Component, signal, inject , computed} from '@angular/core';
import { Currency } from '../../services/currency';
import { CurrencyInfo } from '../../models/currency.model';
import { currencies } from '../../constants/currencies';
import { FormsModule } from '@angular/forms'; // Importante para o [(ngModel)]
import {DecimalPipe} from '@angular/common'; 

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './converter.html'
})
export class Converter {
  private currencyService = inject(Currency);
  // Estados reativos
  amount = signal<number>(1);
  currencies = signal(currencies);
  fromCurrency = signal('USD');
  toCurrency = signal('BRL');
  result = signal<CurrencyInfo | null>(null);
  loading = signal(false);

  convert() {
    this.loading.set(true);
    this.currencyService.getExchangeRate(this.fromCurrency(), this.toCurrency())
      .subscribe({
        next: (data) => {
          this.result.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Erro ao buscar cotação. Verifique os códigos das moedas.');
        }
      });
  }

  totalConverted = computed(() => {
    const currentResult = this.result();
      if (currentResult){
        return this.amount() * Number(currentResult.bid);
      }
      return 0;
    });

  switchCurrencies(){
    const temp = this.fromCurrency;

    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;

    if(this.result()){
      this.convert();
    }
  }
}
