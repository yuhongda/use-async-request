import axios from './axios'

export async function getStoryIds(params: Record<string, any>) {
  return axios({
    url: `${params.storyType}.json?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News new stories failed',
    cancelToken: params.source?.token
  })
}

export async function getStoryById(params: Record<string, any>) {
  return axios({
    url: `item/${params.storyId}.json?print=pretty`,
    // url: `item/${params.storyId}.json${['1',''][Math.floor(Math.random()*2)]}?print=pretty`,
    method: 'get',
    params,
    errorTitle: 'Get Hacker News new stories failed',
    cancelToken: params.source?.token
  })
}
