import logo from './logo.svg'
import './App.css'
import styled from 'styled-components'
import StoryList from './StoryList'
import 'antd/dist/antd.css'

type ResultDataType<T> = T[]

const Wrapper = styled.div`
  padding: 20px;
`

function App() {
  return (
    <Wrapper>
      <header className="App-header">
        <h1>Hacker News</h1>
        <StoryList />
      </header>
    </Wrapper>
  )
}

export default App
