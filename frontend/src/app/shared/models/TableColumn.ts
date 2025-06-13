export interface TableColumn {
  key: string;
  header: string;
  type: 'text' | 'date' | 'badge' | 'actions' | 'custom';
  dateFormat?: string;
  headerClass?: string;
  cellClass?: string;
  slice?: { start: number; end: number };
}

export interface TableAction<T> {
  label: string;
  action: T;
  route?: string[];
}

export interface DataViewAction {
  icon: string;
  label: string;
  color?: string;
  action: string;
  disabled?: boolean;
}
