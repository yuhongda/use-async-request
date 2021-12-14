# use-async-request
> A custom React Hook for async request.

![async_300x300](https://user-images.githubusercontent.com/259410/145717135-862d19a3-e2df-403a-9aea-59eb6b1a0b93.png)


![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-92.1%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)

![Size](https://badgen.net/bundlephobia/minzip/use-async-request)
[![npm version](https://badge.fury.io/js/use-async-request.svg)](https://badge.fury.io/js/use-async-request)


## 🎨 Features

- 🌟 Make async request w/ loading state, and the request is cancellable
- 🌈 Support multi resquest (request sequentially)
- 🎁 Ship React UI component `<AsyncRequest />`
- 💪 Type safety
- ☘️ Size ≈ 1.2KB


## 🔗 Installation

```js
npm install --save use-async-request

OR

yarn add use-async-request
```

## 🔗 CDN
If you are working w/ [UNPKG](https://unpkg.com/)

[https://unpkg.com/use-async-request@1.1.0/lib/umd/use-async-request.min.js](https://unpkg.com/use-async-request@1.1.0/lib/umd/use-async-request.min.js)



## 🔗 Usage

### 👉 use-async-request

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


## 🔗 Roadmap

- [x] Batch async request
- [x] `<AsyncRequest /> ` React UI components w/ demo
- [ ] persisted
- [ ] More detail docs
