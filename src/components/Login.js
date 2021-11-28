import styled from 'styled-components'

import firebaseApp from '../firebase'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

const auth = getAuth(firebaseApp)

export const login = async () => {
  const username = prompt('Brukernavn:') || ''
  if (!username) {
    alert('Du må skrive inn et brukernavn')
    return
  }
  const email = username + '@kodeklubben.no'
  const password = prompt(
    'Passord: (Minst 6 tegn. Finnes ikke brukeren fra før lager vi en ny bruker med dette passordet)'
  )
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        alert('Brukernavnet burde helst bare bestå av bokstaver fra a til å, tall (0-9), punktum (.) og bindestrek (-)')
        break
      case 'auth/user-not-found':
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          await signInWithEmailAndPassword(auth, email, password)
          await setDoc(doc(getFirestore(), 'users', username), {})
          alert('Vi lagde en ny bruker med dette brukernavnet: ' + username)
        } catch (error2) {
          switch (error2.code) {
            case 'auth/weak-password':
              alert('Du må ha et sterkere passord. Minst 6 tegn. Prøv på nytt!')
              break
            default:
              alert('Du fikk en ukjent error: ' + error2.code + '. Du må prøve på nytt!')
          }
        }
        break
      default:
        alert('Du fikk en ukjent error: ' + error.code)
    }
  }
  return username
}

const logout = () => {
  signOut(auth)
}

export function Login() {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <Container>Laster inn ...</Container>
  }

  if (user) {
    const username = user.displayName || user.email.replace('@kodeklubben.no', '')

    return (
      <Container>
        <span>
          Hei, <b>{username}</b>!
        </span>
        <TextButton onClick={logout}>LOGG UT</TextButton>
      </Container>
    )
  }

  return (
    <Container>
      <TextButton onClick={login}>LOGG INN / LAG EN BRUKER</TextButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  column-gap: 32px;
  row-gap: 8px;
  margin-left: auto;
  color: #fff;
`

const TextButton = styled.span`
  cursor: pointer;

  :hover {
    border-bottom: 2px solid #fff;
  }
`
