# use-async-request
> A Custom React Hook for async request.

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

