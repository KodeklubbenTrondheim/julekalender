import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { runCode } from 'client-side-python-runner'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import mdIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import { useStore } from '../store'
import { Button } from '../components/Button'
import { luker } from '../luker'

const md = mdIt({
  langPrefix: 'language-',
  highlight: function (code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, {
          language,
        }).value
      } catch (ex) {}
    }

    return ''
  },
})

export function LukeSide() {
  const { lukeNr } = useParams()
  const [data, setData] = useState({})
  const [error, setError] = useState('')
  const userId = useStore((store) => store.userId)
  const setShowLoginModal = useStore((store) => store.setShowLoginModal)

  useEffect(() => {
    const nr = parseInt(lukeNr)

    if (/^\d+$/.test(lukeNr) && nr >= 1 && nr <= 24) {
      if (nr > luker['2021'].length) {
        setError('Kan være du var litt tidlig ute med denne ...')
        return
      }
      const luke = luker['2021'][nr - 1]
      setData({
        ...luke,
        description: luke.description.replace(/{([^}]+)}/g, `_![$1](${process.env.PUBLIC_URL}/images/$1.png)_`),
      })
      setError('')
    } else {
      setError(
        `Vi kan ikke finne luke "${lukeNr}". Er det et tall mellom 1 og 24? I så fall må vi oppdatere nissetallsystemene våre!`
      )
    }
  }, [lukeNr])

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  const addLukeToScore = async (username) => {
    if (username) {
      const data = (await getDoc(doc(getFirestore(), 'users', username))).data()
      const lukeId = 'luke' + lukeNr
      const score = Object.keys(data).filter((e) => e.startsWith('luke')).length
      if (!(lukeId in data) || score !== data.score) {
        await updateDoc(doc(getFirestore(), 'users', username), {
          score: score + 1,
          [lukeId]: 11121,
        })
      }
    }
  }

  return (
    <>
      <h1>
        <LukeNr>Luke {lukeNr}:</LukeNr> {data.title}
      </h1>
      <Markdown>{data.description}</Markdown>
      <Container>
        {!userId ? (
          <Button
            onClick={() => {
              setShowLoginModal(true)
            }}
          >
            Kjør kode! (Logg inn / Lag bruker først)
          </Button>
        ) : (
          <Button
            onClick={async () => {
              await runCode("print('Luke " + lukeNr + "')", { use: 'skulpt' })
              await addLukeToScore(userId)
            }}
          >
            Kjør kode!
          </Button>
        )}
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

const LukeNr = styled.span`
  color: #fff8;
`

const ErrorMessage = styled.h1`
  color: #a88;
`

function Markdown({ children = '', ...props }) {
  const [renderedMarkdown, setRenderedMarkdown] = useState('')

  useEffect(() => {
    setRenderedMarkdown(md.render(children.replace(/\\n/g, '\n')))
  }, [children])

  return <RenderedMarkdown dangerouslySetInnerHTML={{ __html: renderedMarkdown }} {...props} />
}

const RenderedMarkdown = styled.div`
  text-align: left;
  width: 100%;
  max-width: 640px;

  img {
    max-width: 100%;
  }

  p img {
    vertical-align: middle;
    height: 40px;
  }
`
