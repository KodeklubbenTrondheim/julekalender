import { useEffect } from 'react'
import styled from 'styled-components'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'

import firebaseApp from './firebase'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import { useStore } from './store'
import { LukeSide } from './pages/Luke'
import { KalenderSide } from './pages/Kalender'
import { LedertavleSide } from './pages/Ledertavle'
import { Header } from './components/Header'

const auth = getAuth(firebaseApp)

function App() {
  const [user, loading] = useAuthState(auth)
  const setUserId = useStore((store) => store.setUserId)

  useEffect(() => {
    if (!loading) setUserId(user?.email.replace('@kodeklubben.no', '') || '')
  }, [user, loading, setUserId])

  const Router = process.env.REACT_APP_STATIC_HOSTING ? HashRouter : BrowserRouter

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
            <Route path="/ledertavle" exact>
              <LedertavleSide />
            </Route>
            <Route path="/regler" exact>
              <InfoContainer>
                <h1>Regler</h1>
                <ol>
                  <li>
                    Lag kun én bruker til deg selv. Vi ønsker ikke at du lager flere brukere for å øke vinnersjansen
                    din. Blir dette oppdaget vil du ikke kunne vinne.
                  </li>
                  <li>
                    Lag passende brukernavn. Hvis vi synes brukernavnet ditt er upassende kommer vi til å endre hvordan
                    det synes for andre.
                  </li>
                  <li>
                    Kun bruk web-applikasjonen slik den er ment. Vi er klar over at kalenderen kan "hackes", men det er
                    ikke OK. Blir det oppdaget blir du utestengt. Dette kan også ødelegge morroa for andre som følger
                    reglene.
                  </li>
                </ol>
              </InfoContainer>
            </Route>
            <Route path="/foreldre" exact>
              <InfoContainer>
                <h1>Til foreldre</h1>
                <p>
                  Vi i kodeklubben ønsker å fremme programmering som et verktøy for å løse problemer for alle i alle
                  aldre. Denne kode-kalenderen er laget for dem som ikke har kommet i gang med programmering, men ønsker
                  å finne ut av hva det handler om.
                </p>
                <p>
                  Det er viktig å nevne at programmering ikke burde være det eneste man holder på med, selv om det fort
                  kan bli slik, men heller en av mange andre aktiviteter. Vi har derfor gjort det slik at man får "lodd"
                  for maks 10 av lukene, slik at man ikke føler seg presset til å klare alle 24 lukene (undertegnede har
                  blitt bitt av denne på andre kode-kalendere). En stor andel av lukene er også enkle slik at 10 luker
                  skal være overkommelig for alle som vil prøve seg. Den andre andelen er markert med "Vanskelig" og er
                  der for de som liker en utfordring.
                </p>
                <h2>Gjør det sosialt</h2>
                <p>
                  Vi kan også anbefale å løse lukene i denne kalenderen med andre og gjøre det til en sosial aktivitet.
                  Du kan lese mer om spesielt en teknikk som har vist seg å være svært nyttig når man lærer
                  programmering her:{' '}
                  <a href="https://meetedison.com/pair-programming-in-education/">
                    https://meetedison.com/pair-programming-in-education/
                  </a>
                  .
                </p>
                <h2>Etter kalenderen</h2>
                <p>
                  Når man er ferdig med kalenderen (man har klart 10 luker) håper vi at interessen for å utforske
                  programmering har økt og at man nå vet mer hva det handler om. Det finnes mange ressurser på internett
                  om hvordan man kommer i gang med alt mulig. YouTube er en spesielt bra plass å starte ettersom det er
                  community-drevet og basert på popularitet. Ellers er det bare å være kreativ og prøve å kombinere
                  programmering med andre interesser, som for eksempel matlaging (lage oppskrift eller handleliste),
                  lage hverdagsplaner (lage en kalender eller en todo-liste) og sosiale aktiviteter (stiv heks
                  (micro:bit), stein-saks-papir, rødt-og-grønt lys).
                </p>
              </InfoContainer>
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
  padding: 0 32px 64px;
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

const InfoContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  text-align: left;

  li {
    margin: 32px 0;
  }
`
