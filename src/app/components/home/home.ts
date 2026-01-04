import { Component, signal } from '@angular/core';
import { Graph } from '../graph/graph';
import { Converter } from '../converter/converter';
import { CurrencyInfo } from '../../models/currency.model';

@Component({
  selector: 'app-home',
  imports: [Graph, Converter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  from = signal('USD');
  to = signal('BRL');
  // Estado para armazenar o resultado da conversão
  currentResult = signal<CurrencyInfo | null>(null);
  currentInterval = signal(7); // Padrão: 7 dias

  // Função para atualizar o intervalo vindo do gráfico
  updateInterval(days: number) {
    this.currentInterval.set(days);
  }

  handleConversion(data: CurrencyInfo) {
    this.currentResult.set(data);
  }

  // Se o usuário trocar a moeda (Switch), limpamos o gráfico até que ele converta de novo
  handleSwitch(event: any) {
    this.from.set(event.from);
    this.to.set(event.to);
    this.currentResult.set(null);
  }
}