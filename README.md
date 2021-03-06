# 📦 use-async-request
> A custom React Hook for async request.

![async_300x300](https://user-images.githubusercontent.com/259410/145717135-862d19a3-e2df-403a-9aea-59eb6b1a0b93.png)


![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)

![Size](https://badgen.net/bundlephobia/minzip/use-async-request)
[![npm version](https://badge.fury.io/js/use-async-request.svg)](https://badge.fury.io/js/use-async-request)


## 🎨 Features

- 🌟 Make async request w/ loading state, and the request is cancellable
- 🌈 Support multi resquest (request sequentially by default)
- 🎁 Ship React UI component `<AsyncRequest />`
- 💪 Type safety
- ☘️ Size ≈ 1.2KB


## Installation

```js
npm install --save use-async-request

OR

yarn add use-async-request
```

## CDN
If you are working w/ [UNPKG](https://unpkg.com/)

[https://unpkg.com/use-async-request@1.1.0/lib/umd/use-async-request.min.js](https://unpkg.com/use-async-request@1.1.0/lib/umd/use-async-request.min.js)



## Usage

### 👉 useAsyncRequest()

```jsx
import { useAsyncRequest } from 'use-async-request'

async function getStoryById(params: Record<string, any>) {
  return axios({
    url: `item/${params.storyId}.json?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News new stories failed',
    signal: params.controller?.signal
  })
}

const Story: React.FC<{ storyId: number }> = ({ storyId }) => {
  const { data, loading, error, refetch, request, reset } = useAsyncRequest<any>({
    defaultData: null,
    requestFunctions: [{
      func: getStoryById,
      payload: {
        storyId
      },  
    }],
  })

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {(data && data[0] && (
        <>
          <p><a href={data[0].url}>{data[0].title}</a></p>
          <p>{data[0].by}</p>
        </>
      )) || <div></div>}
      <div>
        <Button onClick={() => refetch()}>Refetch</Button>
        <Button onClick={() => reset()}>Reset</Button>
      </div>
    </div>
  )
}
```

### 👉 `<AsyncRequest />`

```jsx
<AsyncRequest
  requestFunctions={[
    {
      func: getStoryById,
      payload: { storyId }
    }
  ]}
  success={StorySuccess}
  loading={
    <span>Loading...</span>
  }
  error={({ error, refetch }) => (
    <div>
      {error.message}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  )}
/>

async function getStoryById(params) {
  return axios({
    url: `https://hacker-news.firebaseio.com/v0/item/${params.storyId}.json?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News story failed',
    signal: params.controller?.signal,
  });
}

const StorySuccess = ({ data, refetch }) => {
  const { title = "", url = "", by = "" } = data?.[0];
  return (
    <section>
      <p><a href={url}>{title}</a></p>
      <p>{by}</p>
      <button onClick={() => refetch()}>refetch</button>
    </section>
  );
};
```

## Options

- `defaultData` 
> The default data to render.

Type: `any`  
Default: `null`

- `requestFunctions`
> The request APIs goes here. you can set payload and transform function for every single request.

Type: `RequestFunction<TData>[]`  
Default: `[]`

- `requestFunctions.func`
> The request function

Type: `(...args: any[]) => Promise<any>`  

- `requestFunctions.payload`
> The request function should be like below. params can take instance of AbortController in order to cancel request.
```js
async function getStoryIds(params) {
  return axios({
    url: `${params.storyType}.json?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News new stories failed',
    signal: params.controller?.signal
  })
}
```

Type: `(...args: any[]) => Promise<any>`  

- `requestFunctions.transform`
> you can use this option to process the data that receive from Api

Type: `(res: any) => TData`  

- `auto`
> using this option to make request run automatically

Type: `boolean`  
Default: `true`

- `persistent`
> Enable data persistent. If set it `true`, the data that request from api will store into `localStorage` with given key(`persistentKey`), and then the next request data will be load from localStorage instead. The persistent data will always be available until `persistentExpiration` date.  
> ⚠️ NOTE: `refetch()` and `request()` will ignore `persistent`, it will always load data through api function, AND refresh the `expiration` date.

Type: `boolean`  
Default: `false`

- `persistentKey`
> The prefix key of the persisted data, which the entire key base on it. The entire key will generate like below:   
> ⚠️ NOTE: This option needs to be set with `persistent` at the same time.
```js
// generate key
const key = `${persistentKey}-${JSON.stringify(
  requestFunctions.map((req) => {
    return { name: req.func.name, payload: req.payload }
  })
)}`
```

Type: `string`  
Default: `''`

- `persistentExpiration`
> The expiration time. (ms)

Type: `number`  
Default: `1000 * 60`

## Returns

- `data`
> The data that you request

- `loading`
> The loading statement

Type: `boolean`

- `error`

- `refetch`
> retrigger the request action

Type: `() => void`

- `request`
> If you want to request data manually, use this.

Type: `() => Promise<(Data | null)[] | null>`

- `reset`
> Back to the start, render using the `defaultData`

Type: `() => void`

## Roadmap

- [x] Batch async request
- [x] `<AsyncRequest /> ` React UI components w/ demo
- [ ] Add `sequentially` option for multi requests
- [x] persistent
- [ ] More detail docs
