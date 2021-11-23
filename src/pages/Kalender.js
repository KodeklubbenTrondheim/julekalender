import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { createBreakpoint } from 'react-use'
import { CSSShadows } from '../constants'

const useBreakpoints = createBreakpoint({
  small: 0,
  medium: 700,
  large: 1000,
})

const screens = {
  small: {
    columns: 2,
    size: 'min(200px, calc(50vw - 64px))',
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
    size: '200px',
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
    size: '200px',
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

const day = 1

export function KalenderSide() {
  const [gridTemplateAreas, setGridTemplateAreas] = useState('')
  const [gridTemplateColumns, setGridTemplateColumns] = useState('')
  const [gridAutoRows, setGridAutoRows] = useState('')
  const breakpoint = useBreakpoints()

  useEffect(() => {
    const { layout, size, columns } = screens[breakpoint]
    setGridTemplateAreas("'" + layout.trim().replace(/(\d+)/g, 'l$1').replace(/\n\s*/g, "' '") + "'")
    setGridTemplateColumns(`repeat(${columns}, ${size})`)
    setGridAutoRows(size)
  }, [breakpoint])

  return (
    <Container>
      <SupTitle>Kodeklubbens ...</SupTitle>
      <Title>Kodekalender 2021</Title>
      {/*<p>Ny kodeoppgave hver dag frem til 24. desember.</p>*/}
      <PricesText>
        Vinn en kino-billett! 📽🍿 Vi deler ut kino-billetter til 10 heldige deltakere. Jo flere luker du klarer å løse,
        jo større sjans får du.
      </PricesText>
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
                title={open ? '' : `Denne åpner ${lukeNr}. desember kl 07:00`}
              >
                {lukeNr}
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
  max-width: calc(200px * 4 + 32px * 3);
`

const Grid = styled.div`
  display: grid;
  gap: 32px;
  text-align: center;
`

const Luke = styled(Link)`
  grid-area: ${(props) => 'l' + props.$lukeNr};
  background-color: ${(props) => (props.$open ? '#0f04' : '#7118')};
  color: white;
  cursor: ${(props) => (props.$open ? 'pointer' : 'not-allowed')};
  text-align: center;
  border-radius: 16px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${CSSShadows.medium}
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

const PricesText = styled.p`
  color: #fff8;
  font-size: 0.75em;
  margin-bottom: 70px;
`
