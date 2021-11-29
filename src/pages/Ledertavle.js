import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getFirestore, collection } from 'firebase/firestore'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import { day } from './Kalender'

export function LedertavleSide() {
  const [data, setData] = useState([])
  const [value, loading, error] = useCollectionOnce(collection(getFirestore(), 'users'))

  useEffect(() => {
    if (value) {
      const groupedByScore = Array(25)
        .fill(0)
        .map(() => [])

      value.docs
        .map((doc) => ({ username: doc.id, ...doc.data() }))
        .filter((doc) => doc.show !== false)
        .sort((a, b) => b.score - a.score)
        .forEach((doc) => {
          groupedByScore[doc.score].push(doc)
        })

      setData(groupedByScore.reverse())
    }
  }, [value])

  return (
    <>
      <h1>Ledertavle</h1>
      <Container>
        {loading && 'Henter data ...'}
        {error && 'Kunne ikke hente date for øyeblikket'}
        {!loading &&
          data.map((docs) => {
            if (!docs.length) return null
            return (
              <div key={docs[0].score}>
                <h3 title={`${docs.length} person${docs.length === 1 ? '' : 'er'} har ${docs[0].score} lodd`}>
                  {docs[0].score} lodd ({docs.length})
                </h3>
                <Table>
                  {docs.map(({ username, displayName = '', score }) => {
                    return (
                      <Row key={username}>
                        <Name>{displayName || username}</Name>
                        <Score>{Math.max(0, Math.min(10, day, score))}</Score>
                      </Row>
                    )
                  })}
                </Table>
              </div>
            )
          })}
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #4c1616;
  width: 100%;
  max-width: 600px;
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Name = styled.div``
const Score = styled.div``
