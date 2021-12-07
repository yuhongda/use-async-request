import logo from './logo.svg'
import './App.css'
import styled from 'styled-components'
import StoryList from './StoryList'
import SingleStory from './SingleStory'
import 'antd/dist/antd.css'
import { Divider, Typography } from 'antd'
const { Title } = Typography;

type ResultDataType<T> = T[]

const Wrapper = styled.div`
  padding: 20px;
`

function App() {
  return (
    <Wrapper>
      <header className="App-header">
        <Title>Hacker News</Title>
        <Title level={2}>use-async-request()</Title>
        <StoryList />
        <Divider />
        <Title level={2}>{'<AsyncRequest />'}</Title>
        <SingleStory />
      </header>
    </Wrapper>
  )
}

export default App
