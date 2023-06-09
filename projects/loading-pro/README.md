# Loading-pro (V2.0.0)

A simple library for loading status management.

### How to use

npm

```
npm install loading-pro
```

### Use in project

```typescript
import { LoadingPro, Spinner } from 'loading-pro';

const options = {
    text: 'loading...',
    size: 24,
    slot: {
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
            template: `<svg class="icon loading-pro-svg" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="613"><path d="M384 128a128 128 0 1 1 255.936-0.064A128 128 0 0 1 384 128z m271.552 112.448a128 128 0 1 1 255.936-0.064 128 128 0 0 1-255.936 0.064zM832 512a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m-112.448 271.552a64 64 0 1 1 128 0 64 64 0 0 1-128 0zM448 896a64 64 0 0 1 128 0 64 64 0 0 1-128 0z m-271.552-112.448a64 64 0 0 1 128 0 64 64 0 0 1-128 0z m-32-543.104a96 96 0 0 1 192 0 96 96 0 0 1-192 0zM56 512a72 72 0 1 1 144 0 72 72 0 0 1-144 0z" fill="" p-id="614"></path></svg>`,
            color: '#e345e4',
          },, // spinnerSlot and style are optional.
};
const spinner = new Spinner(options);

const loadingOptions = {
  timeout: 8000,
  spinner: spinner
}

const loading =  new LoadingPro(loadingOptions?); // option is optional here
loading.spinner = spinner;
```

---

### Start a loading call

call this method to start a loading call, if user didn't inject id
will return a random id.

> Tips: recommend give an Id for loading, so you can clear see which loading not finished.

```typescript
const loadingId = loading.start("getUserLoading"); // loadingId = 'getUserLoading'
const loadingId = loading.start(); // loadingId = {A random shot id}
```

### End a loading call

call this method to stop a loading, need provide id

```typescript
loading.stop(id); // Id for stop which loading
```
---

### Individual loading will not plus in the normal loading, it has self life time.

### Start Individual Loading

```typescript
loading.startIndividualLoading(id?); // loadingId = given id or {A random shot id}
```

### Stop Individual Loading

```typescript
loading.stopIndividualLoading(id);
```

---

### Get loading status

here i offered two way to get loading status, one is a attribute called **"isLoading"**

```typescript
loading.isLoading; // true
```

if you want to get the id list which is in loading status

```typescript
loading.activeItems; // ['loading1', 'loading2']
```

another way to get loading status is callback function.
you can set the callback function to **loadingStateChangeHandler**
this handler will be called every time the status change

```typescript
  interface ILoadingStateChange {
    newState: boolean;
  }

  loading.loadingStateChangeHandler = ({newState}: ILoadingStateChange) => {
    console.log(newState); // true
  }
```

for the case loading running to timeout, we will shutdown the loading. and there is a callback function
can get the unfinished items.

```typescript
  loading.shutdownHandler = (unfinishedIds: string[]) => {
    console.log(unfinishedIds); // ['1', '2', '3']
  }
```

### Other Method

- update timeout

```typescript
loading.timeout = 80000;
```

- check someone's loading status

```typescript
loading.check(id); // check the given id is in loading status
```

### Spinner
- update percentage value

```typescript
spinner.percentage = value;
```

## Release Note

### July 13, 2023 (Breaking Change)
version: 2.0.0
- refactor LoadingProService to LoadingPro
- move spinner out of LoadingPro, and user need manual construct
- remove rxjs
- add loadingStateChangeHandler and shutdownHandler callback hooks

make it more easier to use

### Apr 5, 2023

- Add spinner feature
- Fix log issue

### Apr 6, 2023

- fix check issue
- enhancement

### Apr 10, 2023

- add show spinner set function
- support user manual inject svg slot as string template

### Apr 11, 2023

- change **shortid** to **nanoid**

### Apr 12, 2023

- Individual loading stop issue fix
- update **show** and **hide** function to **start** and **stop**

### Apr 21, 2023

- add text when loading
- add percentage when loading
- **size** in options for spinner size and text size
- **color** in options for spinner color only support hex and rgb value
