import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { createBreakpoint } from 'react-use'
import { CSSShadows } from '../constants'
import { useDocument } from 'react-firebase-hooks/firestore'
import { doc, getFirestore } from '@firebase/firestore'
import { useStore } from '../store'

const lukeBredde = 160
const gap = 32
const margin = 64

const useBreakpoints = createBreakpoint({
  small: 0,
  medium: lukeBredde * 3 + gap * 2 + margin * 2,
  large: lukeBredde * 4 + gap * 3 + margin * 2,
})

const screens = {
  small: {
    columns: 2,
    size: `min(${lukeBredde}px, calc(50vw - ${margin}px))`,
    layout: `
      1 5
      21 20
      14 14
      2 8
      24 24
      24 24
      7 3
      12 15
      12 6
      9 6
      16 17
      4 13
      4 23
      11 18
      19 19
      22 10`,
  },
  medium: {
    columns: 3,
    size: lukeBredde + 'px',
    layout: `
      1 5 21
      20 14 14
      2 8 3
      24 24 3
      24 24 7
      15 12 6
      9 17 17
      16 4 13
      23 4 11
      18 19 19
      22 22 10`,
  },
  large: {
    columns: 4,
    size: lukeBredde + 'px',
    layout: `
      1 5 21 20
      14 14 2 8
      24 24 3 7
      24 24 15 12
      6 9 17 17
      6 16 4 13
      23 23 4 11
      18 19 19 11
      22 22 10 11`,
  },
}

export const day = process.env.REACT_APP_DAY
  ? parseInt(process.env.REACT_APP_DAY)
  : Math.floor((Date.now() - new Date(2021, 11, 1, 7).getTime()) / (1000 * 60 * 60 * 24)) + 1
const hardLuker = [5, 9, 12, 15, 17, 19, 22]

export function KalenderSide() {
  const [gridTemplateAreas, setGridTemplateAreas] = useState('')
  const [gridTemplateColumns, setGridTemplateColumns] = useState('')
  const [gridAutoRows, setGridAutoRows] = useState('')
  const [userData, setUserData] = useState({})
  const breakpoint = useBreakpoints()
  const userId = useStore((store) => store.userId)
  const [value] = useDocument(userId && doc(getFirestore(), 'users', userId))

  useEffect(() => {
    const { layout, size, columns } = screens[breakpoint]
    setGridTemplateAreas("'" + layout.trim().replace(/(\d+)/g, 'l$1').replace(/\n\s*/g, "' '") + "'")
    setGridTemplateColumns(`repeat(${columns}, ${size})`)
    setGridAutoRows(size)
  }, [breakpoint])

  useEffect(() => {
    if (value) {
      setUserData(value.data() || {})
    }
  }, [value])

  return (
    <Container>
      <SupTitle>Kodeklubbens</SupTitle>
      <Title>Kodekalender 2021</Title>
      <PricesText>
        Vinn en kino-billett! 📽🍿 Vi deler ut en kino-billett til 10 heldige deltakere. Jo flere luker du klarer å løse,
        jo større sjanse får du (opp til 10 luker).
      </PricesText>
      {'score' in userData && <PricesText>Du har nå {userData.score} av 10 lodd i trekningen 24. desember</PricesText>}
      <DisclaimerText>
        Dette er et prøveprosjekt fra Kodeklubben i Trondheim, så det kan komme endringer underveis.
      </DisclaimerText>
      <Grid
        style={{
          gridTemplateAreas,
          gridTemplateColumns,
          gridAutoRows,
        }}
      >
        {Array(24)
          .fill(0)
          .map((_, i) => {
            const lukeNr = i + 1
            const open = lukeNr <= day
            return (
              <Luke
                key={i}
                to={open ? 'luke/' + lukeNr : ''}
                $lukeNr={lukeNr}
                $open={open}
                $solved={open && 'luke' + lukeNr in userData}
                title={open ? '' : `Denne åpner ${lukeNr}. desember kl 07:00`}
              >
                {lukeNr}
                {hardLuker.includes(lukeNr) && <HardLuke>Vanskelig</HardLuke>}
              </Luke>
            )
          })}
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${`calc(${lukeBredde}px * 4 + ${gap}px * 3)`};
`

const Grid = styled.div`
  display: grid;
  gap: ${gap + 'px'};
  text-align: center;
  margin-top: 70px;
`

const Luke = styled(Link)`
  grid-area: ${(props) => 'l' + props.$lukeNr};
  background-color: ${(props) => (props.$open ? (props.$solved ? '#0f04' : '#7118') : '#0003')};
  color: white;
  cursor: ${(props) => (props.$open ? 'pointer' : 'default')};
  text-align: center;
  border-radius: 16px;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  transition-property: box-shadow background-color;
  transition-duration: 0.2s;

  :hover {
    background-color: ${(props) => (props.$open ? (props.$solved ? '#0f05' : '#711b') : '#0003')};
    ${(props) => (props.$open ? CSSShadows.large : '')}
  }
`

const HardLuke = styled.h2`
  position: absolute;
  bottom: 16px;
  font-size: 0.5em;
  color: #fff8;
`

const SupTitle = styled.h2`
  color: #fff8;
  margin-bottom: 8px;
`

const Title = styled.h1`
  color: #fff;
  margin-top: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
  text-shadow: 0 4px 32px #0008;
`

const DisclaimerText = styled.p`
  color: #fff8;
  font-size: 0.75em;
`

const PricesText = styled.p`
  color: #fff;
  font-size: 0.75em;
`
