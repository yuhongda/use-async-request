import React from 'react'
import './App.css'
import { Button, List, Spin, Alert } from 'antd'
import { useAsyncRequest } from '../../src'
import { getStoryById } from './api/hnApi'

type StoryData = {
  by: string
  url: string
  title: string
}

const Story: React.FC<{ storyId: number }> = ({ storyId }) => {
  const { data, loading, error, refetch, request, reset } = useAsyncRequest<StoryData | null>({
    defaultData: null,
    requestFunctions: [
      {
        func: getStoryById,
        payload: {
          storyId
        }
      }
    ],
    persistent: true,
    persistentKey: 'story'
  })

  const story = data?.[0] as StoryData | null

  const onRequestClick = async () => {
    const d = await request()
    console.log(d)
  }

  return (
    <List.Item>
      <Spin spinning={loading} />
      {error && <Alert message={error.message} type="error" showIcon />}
      {(story && (
        <>
          <List.Item.Meta title={<a href={story.url}>{story.title}</a>} description={story.by} />
        </>
      )) || <div></div>}
      <div>
        <Button onClick={() => refetch()}>Refetch</Button>
        <Button onClick={() => reset()}>Reset</Button>
        <Button onClick={onRequestClick}>Request</Button>
      </div>
    </List.Item>
  )
}

export default Story
