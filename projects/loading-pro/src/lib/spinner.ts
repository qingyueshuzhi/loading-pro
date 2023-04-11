import { ISpinnerOption, ISlot } from './model';

export class SpinnerService {
  private _loadingContainer!: HTMLDivElement | null;
  private _showSpinner = false;
  private _slot: ISlot;
  constructor(private option: ISpinnerOption) {
    this._showSpinner = option.show;
    this._slot = option.slot;
  }

  public set showSpinner(value: boolean) {
    this._showSpinner = value;
  }

  show() {
    if (this._showSpinner && !this._loadingContainer) {
      this._loadingContainer = this.getSpinner(
        this._slot.template,
        this._slot.style ?? ``
      );
      document.body.appendChild(this._loadingContainer);
    }
  }

  hide() {
    if (this._loadingContainer) {
      document.body.removeChild(this._loadingContainer);

      this._loadingContainer = null;
    }
  }

  getSpinner(svg: string, style: string) {
    const container = document.createElement('div');
    container.className = 'loading-pro-container';
    container.innerHTML = `
    <style>
      .loading-pro-container {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: #56565622;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    ${style}
    ${svg}
    `;

    return container;
  }
}
