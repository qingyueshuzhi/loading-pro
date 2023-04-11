export interface ILoading {
  showSpinner?: boolean;
  timeout?: number;
  logging?: boolean;
  spinnerSlot?: ISlot;
}

export interface ILoadingStatus {
  loading: boolean;
  id?: string;
}

export interface ISpinnerOption {
  show: boolean;
  slot: ISlot;
}

export interface ISlot {
  template: string;
  style?: string;
}

// export interface ISize {
//   width: number;
//   height: number;
// }
