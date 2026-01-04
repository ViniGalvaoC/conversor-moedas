export interface CurrencyInfo {
  code: string;       // Ex: USD
  codein: string;     // Ex: BRL
  name: string;       // Ex: Dólar Americano/Real Brasileiro
  high: string;       // Valor máximo
  low: string;        // Valor mínimo
  varBid: string;     // Variação
  pctChange: string;  // Porcentagem de variação
  bid: string;        // Valor de compra (o que vais usar para a cotação)
  ask: string;        // Valor de venda
  timestamp: string;
  create_date: string;
}

// A API retorna um objeto onde a chave é o par (ex: USDBRL)
export interface AwesomeApiResponse {
  [key: string]: CurrencyInfo;
}