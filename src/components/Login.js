import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import firebaseApp from '../firebase'
import { usableNames, CSSShadows } from '../constants'
import { Button } from './Button'
import { useStore } from '../store'

const auth = getAuth(firebaseApp)

export function Login() {
  const [user, loading] = useAuthState(auth)
  const [displayName, setDisplayName] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [loggingInFeedback, setLoggingInFeedback] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)
  const [creatingUserFeedback, setCreatingUserFeedback] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [displayNameInput, setDisplayNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const showLoginModal = useStore((store) => store.showLoginModal)
  const setShowLoginModal = useStore((store) => store.setShowLoginModal)

  const updateDisplayName = async (displayName, username) => {
    await updateProfile(auth.currentUser, {
      displayName,
    })
    await updateDoc(doc(getFirestore(), 'users', username), {
      displayName,
    })
    setDisplayName(displayName)
  }

  const login = useCallback(() => {
    const run = async () => {
      const email = usernameInput + '@kodeklubben.no'
      setLoggingIn(true)
      try {
        await signInWithEmailAndPassword(auth, email, passwordInput)
        setShowLoginModal(false)
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            setLoggingInFeedback(
              'Brukernavnet burde helst bare bestå av bokstaver fra a til å, tall (0-9), punktum (.) og bindestrek (-)'
            )
            break
          case 'auth/user-not-found':
            setLoggingInFeedback('Denne brukeren finnes ikke.')
            break
          case 'auth/wrong-password':
            setLoggingInFeedback('Det var feil passord.')
            break
          default:
            setLoggingInFeedback('Du fikk en ukjent error: ' + error.code)
        }
      }
      setLoggingIn(false)
    }
    run()
  }, [usernameInput, passwordInput, setShowLoginModal])

  const register = useCallback(() => {
    const run = async () => {
      const email = usernameInput + '@kodeklubben.no'
      setCreatingUser(true)
      try {
        await createUserWithEmailAndPassword(auth, email, passwordInput)
        await signInWithEmailAndPassword(auth, email, passwordInput)
        await setDoc(doc(getFirestore(), 'users', usernameInput), { score: 0, displayName: displayNameInput })
        await updateDisplayName(displayNameInput, usernameInput)
        setShowLoginModal(false)
      } catch (error) {
        switch (error.code) {
          case 'auth/weak-password':
            setCreatingUserFeedback('Du må ha et sterkere passord. Minst 6 tegn. Prøv på nytt!')
            break
          case 'auth/email-already-in-use':
            setCreatingUserFeedback('Denne brukeren finnes. Du må lage et annet brukernavn.')
            break
          default:
            if (error.code) alert('Du fikk en ukjent error: ' + error.code + '. Du må muligens prøve på nytt!')
            else alert('Du fikk en ukjent error: ' + error + '. Du må muligens prøve på nytt!')
            setShowLoginModal(false)
            console.error(error)
        }
      }
      setCreatingUser(false)
    }
    run()
  }, [usernameInput, displayNameInput, passwordInput, setShowLoginModal])

  const logout = () => {
    signOut(auth)
  }

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName)
    }
  }, [user])

  const generateRandomName = () => {
    const index = Math.floor(Math.random() * usableNames.length)
    const word = usableNames[index]
    if (word.endsWith('-')) {
      return 'Anonymt ' + usableNames[index].slice(0, -1)
    }
    return 'Anonym ' + usableNames[index]
  }

  const setUsername = (name) => {
    setUsernameInput(name.replace(/[^a-z0-9\-_øæå.]/gi, ''))
  }

  useEffect(() => {
    if (showLoginModal) {
      setDisplayNameInput(generateRandomName())
    }
  }, [showLoginModal])

  if (loading) {
    return <Container>Laster inn ...</Container>
  }

  if (user) {
    const username = user.email.replace('@kodeklubben.no', '')
    return (
      <Container>
        <DisplayName
          title="Trykk for å endre visningsnavnet ditt"
          onClick={() => {
            const newDisplayName = prompt('Velg navnet som vises på ledertavlen', displayName || username)
            if (newDisplayName) {
              updateDisplayName(newDisplayName, username)
            }
          }}
        >
          Hei, <b>{displayName ? `${displayName} (${username})` : username}</b>!
        </DisplayName>
        <TextButton onClick={logout}>LOGG UT</TextButton>
      </Container>
    )
  }

  const loginOnEnter = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  const registerOnEnter = (e) => {
    if (e.key === 'Enter') {
      register()
    }
  }

  return (
    <Container>
      <TextButton onClick={() => setShowLoginModal(true)}>LOGG INN / LAG EN BRUKER</TextButton>
      {showLoginModal && (
        <ModalContainer onClick={() => setShowLoginModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseModalButton onClick={() => setShowLoginModal(false)} />
            <h2 style={{ marginTop: 16 }}>Lag ny bruker</h2>
            <InputField>
              <Label>Brukernavn</Label>
              <Input value={usernameInput} onChange={(e) => setUsername(e.target.value)} onKeyPress={registerOnEnter} />
            </InputField>
            <InputField>
              <Label>Visningsnavn</Label>
              <Input
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                onKeyPress={registerOnEnter}
              />
              <NewDisplayName
                onClick={() => {
                  setDisplayNameInput(generateRandomName())
                }}
              />
            </InputField>
            <InputField>
              <Label>Passord</Label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={registerOnEnter}
              />
            </InputField>
            {creatingUserFeedback && <Feedback>{creatingUserFeedback}</Feedback>}
            <Button onClick={register} disabled={creatingUser || !usernameInput || !displayNameInput || !passwordInput}>
              {creatingUser ? (
                <>
                  Lager bruker <i className="fas fa-sync fa-spin" />
                </>
              ) : (
                <>Lag en bruker</>
              )}
            </Button>
            <h2 style={{ marginTop: 32 }}>Logg inn</h2>
            <InputField>
              <Label>Brukernavn</Label>
              <Input value={usernameInput} onChange={(e) => setUsername(e.target.value)} onKeyPress={loginOnEnter} />
            </InputField>
            <InputField>
              <Label>Passord</Label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={loginOnEnter}
              />
            </InputField>
            {loggingInFeedback && <Feedback>{loggingInFeedback}</Feedback>}
            <Button onClick={login} disabled={loggingIn || !usernameInput || !passwordInput}>
              {loggingIn ? (
                <>
                  Logger inn <i className="fas fa-sync fa-spin" />
                </>
              ) : (
                <>Logg inn</>
              )}
            </Button>
          </Modal>
        </ModalContainer>
      )}
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

const DisplayName = styled.span`
  cursor: pointer;

  :hover {
    border-bottom: 2px solid #fff;
  }
`

const TextButton = styled.span`
  cursor: pointer;

  :hover {
    border-bottom: 2px solid #fff;
  }
`

const ModalContainer = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #0002;
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: center;
`

const Modal = styled.div`
  position: relative;
  background-color: #000;
  border-radius: 8px;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  max-height: calc(100% - 32px);
  overflow: auto;
  margin: 16px;
  padding: 16px;
  ${CSSShadows.large}
`

const InputField = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
  font-size: 16px;
  margin-bottom: 16px;
  position: relative;
`

const Feedback = styled.div`
  color: #a00;
  font-style: italic;
  width: 100%;
  font-size: 16px;
  margin-bottom: 16px;
`

const Input = styled.input`
  flex: 1 0 200px;
  background: #fff2;
  color: #fff;
  border-radius: 4px;
  border: none;
  padding: 12px calc(8px + 36px) 12px 8px;
  font-size: 16px;
`

const Label = styled.span`
  flex: 0 0 100px;
  text-align: center;
`

const NewDisplayName = styled.i.attrs({
  className: 'fas fa-sync',
})`
  cursor: pointer;
  flex: 0 0 auto;
  position: absolute;
  right: 16px;
  bottom: 13px;
`

const CloseModalButton = styled.i.attrs({
  className: 'fas fa-close',
})`
  position: absolute;
  right: 18px;
  top: 12px;
  cursor: pointer;
`
