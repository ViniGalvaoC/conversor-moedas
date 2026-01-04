import { Component, signal, inject , computed, Output, EventEmitter} from '@angular/core';
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
  @Output() currencyChanged = new EventEmitter<{from: string, to: string}>();
  @Output() conversionDone = new EventEmitter<CurrencyInfo>();
  private currencyService = inject(Currency);
  // Estados reativos
  amount = signal<number>(1);
  currencies = signal(currencies);
  fromCurrency = signal('USD');
  toCurrency = signal('BRL');
  result = signal<CurrencyInfo | null>(null);
  loading = signal(false);
  private lastState = { from: '', to: '' };

  convert() {
    this.loading.set(true);
        // Avisa o componente pai que houve uma troca
    this.currencyChanged.emit({
      from: this.fromCurrency(),
      to: this.toCurrency()
    });
    
    this.currencyService.getExchangeRate(this.fromCurrency(), this.toCurrency())
      .subscribe({
        next: (data) => {
          this.result.set(data);
          this.loading.set(false);
          this.conversionDone.emit(data); // Avisa o pai e manda os dados
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

  switchCurrencies() {
    const temp = this.fromCurrency();
    this.fromCurrency.set(this.toCurrency());
    this.toCurrency.set(temp);
    this.saveState()
    this.convert(); // Atualiza o cálculo local
  }

  // Esta função apenas checa se as moedas ficaram iguais
  checkAndConvert() {
    if (this.fromCurrency() === this.toCurrency()) {
      this.fromCurrency.set(this.lastState.from);
      this.toCurrency.set(this.lastState.to);
      // Se ficou igual, o switch resolve o problema e já chama o convert()
      this.switchCurrencies();
    } else {
      // Se são diferentes, apenas segue a vida e converte
      this.convert();
    }
  }

  saveState(){
    this.lastState = {
      from: this.fromCurrency(), 
      to: this.toCurrency()
    };
  }
}
