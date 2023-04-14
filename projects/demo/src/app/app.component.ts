import { Component } from '@angular/core';
import { LoadingProService } from 'loading-pro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: LoadingProService,
      useFactory: () =>
        new LoadingProService({
          showSpinner: true,
          spinnerSlot: {
            style: `<style>
            .loading-pro-svg {
              height: 100px;
              width: 100px;
              fill: #666;
              animation: loadingCircle 1s infinite linear;
            }
            @keyframes loadingCircle {
              to {
                  transform: rotate(360deg)
              }
            }
            </style>`,
            template: `<svg class="icon loading-pro-svg" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="613"><path d="M384 128a128 128 0 1 1 255.936-0.064A128 128 0 0 1 384 128z m271.552 112.448a128 128 0 1 1 255.936-0.064 128 128 0 0 1-255.936 0.064zM832 512a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m-112.448 271.552a64 64 0 1 1 128 0 64 64 0 0 1-128 0zM448 896a64 64 0 0 1 128 0 64 64 0 0 1-128 0z m-271.552-112.448a64 64 0 0 1 128 0 64 64 0 0 1-128 0z m-32-543.104a96 96 0 0 1 192 0 96 96 0 0 1-192 0zM56 512a72 72 0 1 1 144 0 72 72 0 0 1-144 0z" fill="" p-id="614"></path></svg>`,
          },
        }),
    },
  ],
})
export class AppComponent {
  title = 'demo';
  constructor(private loading: LoadingProService) {
    console.log(this.loading.show());
    this.loading.isLoading$.subscribe(console.error);
  }
}
