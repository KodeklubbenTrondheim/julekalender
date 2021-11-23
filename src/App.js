import styled from 'styled-components'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { LukeSide } from './pages/Luke'
import { KalenderSide } from './pages/Kalender'
import { Header } from './components/Header'

function App() {
  return (
    <Router>
      <Container>
        <Header />
        <Content>
          <Switch>
            <Route path="/" exact>
              <KalenderSide />
            </Route>
            <Route path="/luke/:lukeNr" exact>
              <LukeSide />
            </Route>
          </Switch>
        </Content>
      </Container>
    </Router>
  )
}

export default App

const Container = styled.div`
  background-color: #4c1616;
  text-align: center;
  min-height: 100vh;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`
