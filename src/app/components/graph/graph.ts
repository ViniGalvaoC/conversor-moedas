import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, inject, signal, Output, EventEmitter } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../../services/currency';
import { days } from '../../constants/days';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl:  './graph.html',
  imports: [FormsModule],
  styles: [`canvas { max-height: 300px; width: 100% !important; }`]
})
export class Graph implements OnChanges {
  @ViewChild('chartCanvas') canvas!: ElementRef;
  @Input() fromCurrency: string = 'USD'; // Recebe do componente pai
  @Input() toCurrency: string = 'BRL'; // Recebe do componente pai
  @Input() selectedInterval: number = 7;
  @Output() intervalChanged = new EventEmitter<number>();
  private currencyService = inject(Currency);
  days = signal(days);
  chart: any;

  constructor(private http: HttpClient) {}

  // Toda vez que o usuário mudar a moeda no conversor, o gráfico atualiza
  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromCurrency'] || changes['toCurrency']) {
      this.fetchHistory();
    }
  }

  onIntervalChange(){
    this.intervalChanged.emit(this.selectedInterval);
    this.fetchHistory();
  }

  fetchHistory() {
    this.currencyService.getHistory(this.selectedInterval,this.fromCurrency,this.toCurrency)
      .subscribe(data => {
        // A API retorna do mais recente para o mais antigo, precisamos inverter (.reverse())
        const labels = data.map(item => new Date(Number(item.timestamp) * 1000).toLocaleDateString()).reverse();
        const prices = data.map(item => parseFloat(item.bid)).reverse();
        
        this.updateChart(labels, prices);
      });
  }

  updateChart(labels: string[], prices: number[]) {
    if (this.chart) this.chart.destroy(); // Limpa o gráfico anterior

    const pair = `${this.fromCurrency}-${this.toCurrency}`

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Histórico ${pair} (${this.selectedInterval} dias)`,
          data: prices,
          borderColor: '#4285f4', // Azul Google
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          fill: true,
          tension: 0.3 // Deixa a linha curva/suave
        }]
      }
    });
  }
}