import React, { useState } from 'react'
import './App.css'
import { Button, Spin, Alert, Card, Pagination } from 'antd'
import { AsyncRequest } from '../../src'
import { getStoryIds, getStoryById } from './api/hnApi'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
  display: flex;
  background-color: #fafafa;
`

const Loading = styled.div`
  display: flex;
  min-height: 100px;
  align-items: center;
  justify-content: center;
`

type StoryData = {
  by: string
  url: string
  title: string
}

const SingleStory: React.FC<{}> = (props) => {
  const StorySuccess: React.FC<{ data: StoryData[]; refetch: () => void }> = ({
    data,
    refetch
  }) => {
    const { title = '', url = '', by = '' } = data?.[0]
    return (
      <Card
        title={
          <>
            by: <strong>{by}</strong>
          </>
        }
        style={{ width: 300 }}
      >
        <a href={url}>{title}</a>
        <p>
          <Button onClick={() => refetch()}>refetch</Button>
        </p>
      </Card>
    )
  }

  const Story: React.FC<{ data: number[][] }> = ({ data }) => {
    const list = (data && data[0] && Object.values(data[0]).slice(0, 10)) || []
    const [storyId, setStoryId] = useState(list[0])

    return (
      <>
        <AsyncRequest
          requestFunctions={[
            {
              func: getStoryById,
              payload: { storyId }
            }
          ]}
          success={StorySuccess}
          loading={
            <Spin spinning>
              <Loading />
            </Spin>
          }
          error={({ error, refetch }) => (
            <>
              <Alert
                message={
                  <>
                    {error.message}
                    <Button onClick={() => refetch()} size="small">
                      refetch
                    </Button>
                  </>
                }
                type="error"
                showIcon
              />
            </>
          )}
        />
        <Pagination
          style={{ marginTop: 10 }}
          defaultCurrent={1}
          pageSize={1}
          total={list.length}
          onChange={(page, _) => setStoryId(list[page - 1])}
        />
      </>
    )
  }

  return (
    <Container>
      <AsyncRequest
        requestFunctions={[
          {
            func: getStoryIds,
            payload: { storyType: 'topstories' }
          }
        ]}
        success={Story}
      />
    </Container>
  )
}

export default SingleStory
