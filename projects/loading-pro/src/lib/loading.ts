import { BehaviorSubject } from 'rxjs';
import { nanoid } from 'nanoid';

import { ConsoleService } from './console';
import { ILoading, ILoadingStatus } from './model';
import { SpinnerService } from './spinner';
import { defaultSVG, defaultStyle } from './constant';
import { style } from '@angular/animations';

export class LoadingProService {
  private readonly _loading: BehaviorSubject<ILoadingStatus> =
    new BehaviorSubject({ loading: false } as ILoadingStatus);
  private _timeoutId!: ReturnType<typeof setTimeout>;
  private _timeout = 60000; // 60s
  private _loadingIdSet: Set<string> = new Set();
  private _loggingService!: ConsoleService;
  private readonly mainLoadingKey = 'Main_Loading';
  private _loadingMap: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private _spinnerService: SpinnerService;

  constructor(options?: ILoading) {
    this._timeout = options?.timeout ?? 60000;
    this._loggingService = new ConsoleService(Boolean(options?.logging));
    this._spinnerService = new SpinnerService({
      show: Boolean(options?.showSpinner),
      slot: {
        template: options?.spinnerSlot?.template ?? defaultSVG,
        style: options?.spinnerSlot?.style ?? defaultStyle,
      },
    });
  }

  public set timeout(time: number) {
    this._timeout = time;
  }

  public set showSpinner(show: boolean) {
    this._spinnerService.showSpinner = show;
  }

  public get isLoading() {
    return this._loading.getValue();
  }

  public get isLoading$() {
    return this._loading.asObservable();
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
    let loadingId: string = id ?? nanoid();
    const timeoutId = setTimeout(() => {
      this.stopIndividualLoading(loadingId);
      this._loggingService.error('loading ended after timeout', loadingId);
    }, this._timeout);
    this._loadingMap.set(loadingId, timeoutId);
    this._loadingIdSet.add(loadingId);

    return loadingId;
  }

  public stopIndividualLoading(id: string) {
    clearTimeout(this._loadingMap.get(id));
    this._loadingMap.delete(id);
    this._loadingIdSet.delete(id);
  }

  public show(id?: string): string {
    let loadingId: string = id ?? nanoid();

    this._loading.next({ loading: true, id: loadingId });
    this._spinnerService.show();
    this._loadingIdSet.add(loadingId);

    if (Boolean(this._timeoutId)) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = setTimeout(() => {
      this.shutdown();
      this._loggingService.error('loading ended after timeout');
    }, this._timeout);

    this._loadingMap.set(this.mainLoadingKey, this._timeoutId);

    return loadingId;
  }

  public hide(id: string): void {
    if (this._loadingIdSet.has(id)) {
      this._loadingIdSet.delete(id);
    }

    if (this._loadingIdSet.size === 0) {
      this.end();
    }
  }

  public shutdown(): void {
    this._loggingService.error(
      'Not finished loading items when timeout: ',
      Array.from(this._loadingIdSet).join(',')
    );
    this.end();
  }

  private end() {
    clearTimeout(this._timeoutId);
    this._loadingMap.delete(this.mainLoadingKey);
    this._loadingIdSet.clear();
    this._loading.next({ loading: false });
    this._spinnerService.hide();
  }
}
