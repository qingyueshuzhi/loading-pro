import { Spinner } from './spinner';

export interface ILoading {
  timeout?: number;
  spinner?: Spinner;
}

export interface ILoadingStatus {
  loading: boolean;
  id?: string;
}

export interface ISpinnerOption {
  slot: ISlot;
  text: string;
  size: number;
}

export interface ISlot {
  template?: string;
  style?: string;
  color?: string;
}

export interface ILoadingStateChange {
  newState: boolean;
}
