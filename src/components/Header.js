import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Login } from './Login'

export const Header = () => {
  const location = useLocation()
  const path = location.pathname

  return (
    <Container>
      <Links>
        <StyledLink to="/" $active={path === '/' || path.startsWith('/luke')}>
          KALENDER
        </StyledLink>
        <StyledLink to="/ledertavle" $active={path === '/ledertavle'}>
          LEDERTAVLE
        </StyledLink>
        <StyledLink to="/regler" $active={path === '/regler'}>
          REGLER
        </StyledLink>
        <StyledLink to="/foreldre" $active={path === '/foreldre'}>
          TIL FORELDRE
        </StyledLink>
      </Links>
      <Login />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  text-align: center;
  margin: 16px 32px 2rem;
  color: #fff;
  column-gap: 32px;
  row-gap: 8px;
`

const Links = styled.div`
  display: flex;
  flex-flow: row wrap;
  column-gap: 32px;
  row-gap: 8px;
`

const StyledLink = styled(Link)`
  color: #fff;
  white-space: nowrap;
  border-bottom: ${(props) => (props.$active ? '2px solid #fff' : 'none')};

  :hover {
    border-bottom: 2px solid #fff;
  }
`
