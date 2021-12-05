import React from 'react'
import './App.css'
import { Button, List, Avatar, Spin, Alert } from 'antd'
import { useAsyncRequest } from '../../src'
import axios from 'axios'
import { getStoryById } from './api/hnApi'

const Story: React.FC<{ storyId: number }> = ({ storyId }) => {
  const { data, loading, error, refetch, request, reset } = useAsyncRequest<any, typeof getStoryById>({
    defaultData: null,
    requestFunction: getStoryById,
    payload: {
      storyId
    },
    axiosCancelTokenSource: axios.CancelToken.source()
  })

  const onRequestClick = async () => {
    const d = await request()
    console.log(d)
  }

  return (
    <List.Item>
      <Spin spinning={loading} />
      {error && <Alert message={error.message} type="error" showIcon />}
      {(data && (
        <>
          <List.Item.Meta title={<a href={data.url}>{data.title}</a>} description={data.by} />
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
