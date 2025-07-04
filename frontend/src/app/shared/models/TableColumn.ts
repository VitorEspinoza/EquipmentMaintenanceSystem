export interface TableColumn<T = any> {
  key: string;
  header: string;
  type: 'text' | 'date' | 'badge' | 'actions' | 'custom';
  defaultValue?: string;
  dateFormat?: string;
  headerClass?: string;
  cellClass?: string | ((element: T) => string);
  slice?: { start: number; end: number };
}

export interface TableAction<T> {
  label: string;
  action: T;
  route?: string[];
}

export interface DataViewAction<T> {
  icon: string;
  label: string;
  color?: string;
  action: T;
  disabled?: boolean;
}
