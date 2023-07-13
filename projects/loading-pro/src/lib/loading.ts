import { nanoid } from 'nanoid';

import { LogManager } from './console';
import { ILoading, ILoadingStateChange } from './model';
import { Spinner } from './spinner';
import { MAIN_LOADING_KEY } from './constant';

export class LoadingPro {
  public loadingStateChangeHandler = ({ newState }: ILoadingStateChange) => {};
  public shutdownHandler = (unfinishedIds: string[]) => {};

  private _timeout = 60000; // 60s
  private _loadingIdSet: Set<string> = new Set();
  private _individualLoadingIdSet: Set<string> = new Set();
  private _logManager!: LogManager;
  private _loadingMap: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private _spinner: Spinner | undefined;
  private _isLoading: boolean = false;

  constructor(options?: ILoading) {
    this._timeout = options?.timeout ?? 60000;
    this._logManager = new LogManager();
  }

  public set spinner(spinner: Spinner) {
    this._spinner = spinner;
  }

  public get spinner(): Spinner {
    return this._spinner as Spinner;
  }

  public set timeout(time: number) {
    this._timeout = time;
  }

  public get activeItems() {
    return Array.from(this._loadingIdSet);
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(value: boolean) {
    if (value === this._isLoading) return;
    this._isLoading = value;
    if (this.loadingStateChangeHandler) {
      this.loadingStateChangeHandler({ newState: value });
    }
  }

  /**
   *
   * @param id the loading id for checking
   * @returns boolean, is the given id in loading
   */
  public check(id: string): boolean {
    return this._loadingIdSet.has(id);
  }

  /**
   *
   * @param id
   * @returns
   */
  public startIndividualLoading(id?: string) {
    let loadingId: string = id ?? nanoid(8);

    const timeoutId = setTimeout(() => {
      this.stopIndividualLoading(loadingId);
      this._logManager.error('loading ended after timeout', loadingId);
    }, this._timeout);

    this._loadingMap.set(loadingId, timeoutId);
    this._individualLoadingIdSet.add(loadingId);

    return loadingId;
  }

  public stopIndividualLoading(id: string) {
    if (!this._loadingMap.has(id)) return;
    clearTimeout(this._loadingMap.get(id));
    this._loadingMap.delete(id);

    if (!this._individualLoadingIdSet.has(id)) return;
    this._individualLoadingIdSet.delete(id);
  }

  public start(id?: string): string {
    let loadingId: string = id ?? nanoid(8);
    this.isLoading = true;
    this._spinner?.show();

    if (Boolean(this._loadingMap.has(MAIN_LOADING_KEY))) {
      clearTimeout(this._loadingMap.get(MAIN_LOADING_KEY));
    }
    const timeoutId = setTimeout(() => {
      this.shutdown();
      this._logManager.error('loading ended after timeout');
    }, this._timeout);

    this._loadingIdSet.add(loadingId);
    this._loadingMap.set(MAIN_LOADING_KEY, timeoutId);

    return loadingId;
  }

  public stop(id: string): void {
    if (this._loadingIdSet.has(id)) {
      this._loadingIdSet.delete(id);
    }

    if (this._loadingIdSet.size === 0) {
      this.end();
    }
  }

  public shutdown(): void {
    this._logManager.error(
      'Not finished loading items when timeout: ',
      Array.from(this._loadingIdSet).join(',')
    );

    if (this.shutdownHandler) {
      this.shutdownHandler(Array.from(this._loadingIdSet));
    }

    this.end();
  }

  private end() {
    clearTimeout(this._loadingMap.get(MAIN_LOADING_KEY));
    this._loadingMap.delete(MAIN_LOADING_KEY);
    this._loadingIdSet.clear();
    this.isLoading = false;
    this._spinner?.hide();
  }
}
