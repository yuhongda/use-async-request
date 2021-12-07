import { useState } from 'react'
import './App.css'
import { Radio, Button, List, Spin } from 'antd'
import { useAsyncRequest } from '../../src'
import axios from 'axios'
import { getStoryIds } from './api/hnApi'
import Story from './Story'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: #fff;
`

type ResultDataType<T> = T[]
type payloadType = {
  storyType: string
}

function StoryList() {
  const [storyType, setStoryType] = useState<string>('newstories')
  const { data, loading, error, refetch, request, reset } = useAsyncRequest<
    ResultDataType<number>,
    typeof getStoryIds,
    payloadType
  >({
    defaultData: [],
    requestFunction: getStoryIds,
    payload: {
      storyType
    },
    transformFunction: (res) => {
      if (res.data) {
        return Object.values(res.data)
      } else {
        return []
      }
    },
    axiosCancelTokenSource: axios.CancelToken.source()
  })

  const onRequestClick = async () => {
    const d = await request()
    console.log(d)
  }

  return (
    <Wrapper>
      <Radio.Group onChange={(e) => setStoryType(e.target.value)} value={storyType}>
        <Radio.Button value="newstories">newstories</Radio.Button>
        <Radio.Button value="topstories">topstories</Radio.Button>
        <Radio.Button value="beststories">beststories</Radio.Button>
      </Radio.Group>
      <Button onClick={() => refetch()}>Refetch</Button>
      <Button onClick={() => reset()}>Reset</Button>
      <Button onClick={onRequestClick}>Request</Button>
      {error && <p>{error}</p>}
      <Spin spinning={loading}>
        {data && (
          <List
            itemLayout="horizontal"
            dataSource={data.slice(0, 10)}
            renderItem={(item) => <Story storyId={item} />}
          />
        )}
      </Spin>
    </Wrapper>
  )
}

export default StoryList
