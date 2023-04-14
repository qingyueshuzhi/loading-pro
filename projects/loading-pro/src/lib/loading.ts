import { BehaviorSubject, lastValueFrom, tap } from 'rxjs';
import { nanoid } from 'nanoid';

import { ConsoleService } from './console';
import { ILoading, ILoadingStatus } from './model';
import { SpinnerService } from './spinner';
import { MAIN_LOADING_KEY, defaultSVG, defaultStyle } from './constant';

export class LoadingProService {
  private readonly _loading: BehaviorSubject<ILoadingStatus> =
    new BehaviorSubject({ loading: false } as ILoadingStatus);
  private _timeout = 60000; // 60s
  private _loadingIdSet: Set<string> = new Set();
  private _individualLoadingIdSet: Set<string> = new Set();
  private _loggingService!: ConsoleService;
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
    let loadingId: string = id ?? nanoid(8);
    const timeoutId = setTimeout(() => {
      this.stopIndividualLoading(loadingId);
      this._loggingService.error('loading ended after timeout', loadingId);
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
    this._loading.next({ loading: true, id: loadingId });
    this._spinnerService.show();

    if (Boolean(this._loadingMap.has(MAIN_LOADING_KEY))) {
      clearTimeout(this._loadingMap.get(MAIN_LOADING_KEY));
    }
    const timeoutId = setTimeout(() => {
      this.shutdown();
      this._loggingService.error('loading ended after timeout');
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
    this._loggingService.error(
      'Not finished loading items when timeout: ',
      Array.from(this._loadingIdSet).join(',')
    );
    this.end();
  }

  /**
   * @deprecated going to remove at v1.2.0, please use "start()"
   * @param id string
   */
  public show(id?: string) {
    this.start(id);
  }

  /**
   * @deprecated going to remove at v1.2.0, please use "stop()"
   * @param id string
   */
  public hide(id: string) {
    this.stop(id);
  }

  private end() {
    clearTimeout(this._loadingMap.get(MAIN_LOADING_KEY));
    this._loadingMap.delete(MAIN_LOADING_KEY);
    this._loadingIdSet.clear();
    this._loading.next({ loading: false });
    this._spinnerService.hide();
  }
}
