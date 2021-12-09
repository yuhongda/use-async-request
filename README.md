# use-async-request
> A custom React Hook for async request.

![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-92.1%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)


![Size](https://badgen.net/bundlephobia/minzip/use-async-request)

## Installation

```js
npm install --save use-async-request

OR

yarn add use-async-request
```

## Usage

```jsx
import { useAsyncRequest } from 'use-async-request'

async function getStoryById(params: Record<string, any>) {
  return axios({
    url: `item/${params.storyId}.json?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News new stories failed',
    cancelToken: params.source?.token
  })
}

const Story: React.FC<{ storyId: number }> = ({ storyId }) => {
  const { data, loading, error, refetch, request, reset } = useAsyncRequest<any, typeof getStoryById>({
    defaultData: null,
    requestFunction: getStoryById,
    payload: {
      storyId
    },
  })

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {(data && (
        <>
          <p><a href={data.url}>{data.title}</a></p>
          <p>{data.by}</p>
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

## Roadmap

- [x] Batch async request
- [x] `<AsyncRequest /> ` components w/ demo
- [ ] persisted
- [ ] More detail docs
