export interface ILoading {
  showSpinner?: boolean;
  timeout?: number;
  logging?: boolean;
  spinnerSlot?: ISlot;
  text?: string;
  size?: number;
}

export interface ILoadingStatus {
  loading: boolean;
  id?: string;
}

export interface ISpinnerOption {
  show: boolean;
  slot: ISlot;
  text: string;
  size: number;
}

export interface ISlot {
  template?: string;
  style?: string;
  color?: string;
}
