import { defaultSVG } from './constant';
import { ISpinnerOption, ISlot } from './model';

export class Spinner {
  private _loadingContainer!: HTMLDivElement | null;
  private _slot: ISlot;
  private _text: string;
  private _fontSize: number;
  constructor(private option: ISpinnerOption) {
    this._slot = option.slot;
    this._text = option.text;
    this._fontSize = option.size;
  }

  public set percentage(value: number) {
    const target = document.querySelector('#loading__pro-percentage');
    if (target) {
      target.innerHTML = `${Number(value)}%`;
    }
  }

  show() {
    if (!this._loadingContainer) {
      this._loadingContainer = this.getSpinner(
        this._slot.template ?? defaultSVG,
        this._slot.style ?? ``,
        this._text
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

  private getSpinner(svg: string, style: string, text: string) {
    const container = document.createElement('div');
    container.className = 'loading__pro-container';
    const defaultStyleEle = this.getDefaultStyle();
    container.innerHTML = `
    ${style}
    <div class="loading__pro-container-svg-container">
      ${svg}
      <span id="loading__pro-percentage"></span>
    </div>
    <span class="loading__pro-container-text">${text}</span>
    `;

    container.append(defaultStyleEle);
    return container;
  }

  getDefaultStyle() {
    const styleEle = document.createElement('style');
    styleEle.className = 'loading__pro-default-style';
    const text = document.createTextNode(`.loading__pro-container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background-color: #56565622;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: ${this._fontSize}px;
    }

    .loading__pro-container-text {
      margin-top: 4px;
    }

    .loading__pro-container-svg-container {
      position: relative;
    }

    #loading__pro-percentage {
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: ${this._fontSize}px;
    }
    `);
    styleEle.appendChild(text);
    console.log(styleEle);

    return styleEle;
  }
}
