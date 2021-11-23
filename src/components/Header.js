import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

export const Header = () => {
  const location = useLocation()
  const path = location.pathname

  return (
    <Container>
      <TextContainer>
        {path !== '/' && (
          <StyledLink to="/" $active={path === '/'}>
            <i className="fas fa-arrow-left" /> Tilbake til kalenderen
          </StyledLink>
        )}
      </TextContainer>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  text-align: center;
  font-size: clamp(1.5rem, calc(10px + 2vmin), 2rem);
  color: ${(props) => (props.$active ? '#fff' : '#61dafb')};
  flex-basis: 300px;
  white-space: nowrap;
  z-index: 1;
`

const TextContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-flow: row wrap;
  padding-top: max(80px, 10vw);
`
