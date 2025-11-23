export interface IPaged<TRow =any , TStats = any > {
  rows: TRow[];
  stats?: TStats;       // opcional
  startingOn?: string;  // opcional para relatórios simples
  endingOn?: string;
  page?: number;
  perPage?: number;
  rowsCount: number;
}
