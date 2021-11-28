import styled from 'styled-components'
import { getFirestore, collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { day } from './Kalender'

export function LedertavleSide() {
  const [value, loading, error] = useCollection(collection(getFirestore(), 'users'))

  return (
    <>
      <h1>Ledertavle</h1>
      <Container>
        {loading && 'Henter data ...'}
        {error && 'Kunne ikke hente date for øyeblikket'}
        {!loading &&
          value &&
          value.docs
            .map((doc) => ({ username: doc.id, ...doc.data() }))
            .filter((doc) => doc.show !== false)
            .sort((a, b) => b.score - a.score)
            .map(({ username, displayName = '', score }) => {
              return (
                <div key={username}>
                  {displayName || username}: {Math.min(day, score)}
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
`
