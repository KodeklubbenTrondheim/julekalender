import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { runCode } from 'client-side-python-runner'
import { Button } from '../components/Button'
import { luker } from '../luker'
import { useParams } from 'react-router'
import mdIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

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
        description: luke.description.replace(/{(\w+\([^)]*\))}/g, `_![$1](${process.env.PUBLIC_URL}/blokker/$1.png)_`),
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

  return (
    <>
      <h1>
        <LukeNr>Luke {lukeNr}:</LukeNr> {data.title}
      </h1>
      <Markdown>{data.description}</Markdown>
      <Container>
        <Button
          onClick={() => {
            runCode("print('Luke " + lukeNr + "')", { use: 'skulpt' })
          }}
        >
          Kjør kode!
        </Button>
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
