import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { getVariable, runCode, setEngine, setOptions } from 'client-side-python-runner'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import mdIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import { CodeEditor, BlocklyEditor } from '../components/CodeEditor'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { luker } from '../luker'
import { day } from './Kalender'
import { Graphics } from '../components/Graphics'
import { hashCode } from '../utils'

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
  const [error, setLukeError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackColor, setFeedbackColor] = useState('#0f0')
  const userId = useStore((store) => store.userId)
  const setShowLoginModal = useStore((store) => store.setShowLoginModal)

  const pythonCode = useStore((state) => state.pythonCode)
  const preDefinedPythonCode = useStore((state) => state.preDefinedPythonCode)
  const addedPreDefinedPythonCode = useStore((state) => state.addedPreDefinedPythonCode)
  const addPreDefinedPythonCode = useStore((state) => state.addPreDefinedPythonCode)
  const postDefinedPythonCode = useStore((state) => state.postDefinedPythonCode)
  const setPostDefinedPythonCode = useStore((state) => state.setPostDefinedPythonCode)
  const extraPythonCodeForTheBrowserRendering = useStore((state) => state.extraPythonCodeForTheBrowserRendering)
  const blocklyPythonCode = useStore((state) => state.blocklyPythonCode)
  const addLog = useStore((state) => state.addLog)
  const [pythonEngineLoading, setLoadingPython] = useState(false)
  const editorMode = useStore((state) => state.editorMode)
  const editor = useStore((state) => state.editor)
  const [toolbox, setToolbox] = useState(null)
  const setEditorMode = useStore((state) => state.setEditorMode)
  const setCanvasColor = useStore((state) => state.setCanvasColor)
  const setShowGrid = useStore((state) => state.setShowGrid)
  const setError = useStore((state) => state.setError)
  const clearError = useStore((state) => state.clearError)
  const pythonErrorLineNumberOffset = useStore((state) => state.pythonErrorLineNumberOffset)

  useEffect(() => {
    const nr = parseInt(lukeNr)

    if (/^\d+$/.test(lukeNr) && nr >= 1 && nr <= 24) {
      if (nr > Math.min(luker['2021'].length, day)) {
        setLukeError('Det kan være du var litt tidlig ute med denne ...')
        return
      }
      const luke = luker['2021'][nr - 1]
      setData({
        ...luke,
        description: luke.description.replace(/{([^}]+)}/g, `_![$1](${process.env.PUBLIC_URL}/images/$1.png)_`),
      })
      setEditorMode(luke.type)
      if (luke.preDefinedCode) addPreDefinedPythonCode(luke.preDefinedCode)
      if (luke.toolbox) setToolbox(luke.toolbox)
      else setToolbox([])
      setPostDefinedPythonCode(luke.evaluationCode)
      setShowGrid(!!luke.showGrid)
      if (luke.canvasColor) setCanvasColor(luke.canvasColor)
      setLukeError('')
    } else {
      setLukeError(
        `Vi kan ikke finne luke "${lukeNr}". Er det et tall mellom 1 og 24? I så fall må vi oppdatere nissetallsystemene våre!`
      )
    }
  }, [lukeNr, setEditorMode, setPostDefinedPythonCode, addPreDefinedPythonCode, setShowGrid, setCanvasColor])

  useEffect(() => {
    setOptions({
      output: (item) => {
        addLog(item)
        console.log(item)
      },
      error: null,
      onLoading: (engine) => setLoadingPython(engine),
      onLoaded: () => {
        setLoadingPython(false)
      },
      loadVariablesBeforeRun: false,
      storeVariablesAfterRun: true,
    })
    setEngine('skulpt', '1.0.0')
  }, [addLog])

  const addLukeToScore = useCallback(
    (username, answer) => {
      const run = async (username, answer) => {
        if (username) {
          const lukeId = 'luke' + lukeNr
          window.localStorage.setItem(lukeId, answer)
          const data = (await getDoc(doc(getFirestore(), 'users', username))).data()
          const score = Object.keys(data).filter((e) => e.startsWith('luke')).length
          if (!(lukeId in data) || score !== data.score) {
            await updateDoc(doc(getFirestore(), 'users', username), {
              score: score + 1,
              [lukeId]: answer,
            })
          }
        }
      }
      run(username, answer)
    },
    [lukeNr]
  )

  const afterCodeRun = useCallback(() => {
    const run = async () => {
      const answer = data.answer(await getVariable('answer'))
      setFeedback(answer.feedback)
      setFeedbackColor(answer.correct ? '#0f0' : answer.close ? '#f80' : '#fff')
      if (answer.correct) {
        addLukeToScore(userId, hashCode(answer.value))
      }
    }
    run()
  }, [data, userId, addLukeToScore])

  const runPythonCode = useCallback(() => {
    const run = async () => {
      await setEngine('skulpt', '1.0.0')
      clearError()
      setFeedbackColor('#fff')
      setFeedback(
        <>
          Kjører koden <i className="fas fa-sync fa-spin" />
        </>
      )
      if (editor) {
        window.monaco.editor.setModelMarkers('getModel' in editor ? editor.getModel() : editor, 'python-editor', [])
      }
      try {
        await runCode(
          preDefinedPythonCode +
            extraPythonCodeForTheBrowserRendering +
            addedPreDefinedPythonCode +
            '\n' +
            pythonCode +
            '\n' +
            postDefinedPythonCode,
          {
            turtleGraphics: {
              target: 'julekort-grafikk-turtle',
              width: 1600,
              height: 1600,
              assets: {
                'nisse-old-female': process.env.PUBLIC_URL + '/images/nisse-old-female.png',
                'nisse-old-male': process.env.PUBLIC_URL + '/images/nisse-old-male.png',
              },
            },
          }
        )
        await afterCodeRun()
      } catch (error) {
        setError(error)
        console.error(error)
        setFeedbackColor('#fff')
        setFeedback(<>Obs, koden feilet! Dette skal ikke skje...</>)
        if (error.lineNumber && error.lineNumber > pythonErrorLineNumberOffset && editor) {
          const lineNumberInEditor = error.lineNumber - pythonErrorLineNumberOffset
          window.monaco.editor.setModelMarkers('getModel' in editor ? editor.getModel() : editor, 'python-editor', [
            {
              startLineNumber: lineNumberInEditor,
              startColumn: 0,
              endLineNumber: lineNumberInEditor + 1,
              endColumn: 0,
              message: error.type + ': ' + error.message,
              severity: 3,
              source: '',
            },
          ])
        }
      }
    }
    run()
  }, [
    addedPreDefinedPythonCode,
    preDefinedPythonCode,
    extraPythonCodeForTheBrowserRendering,
    pythonCode,
    postDefinedPythonCode,
    clearError,
    editor,
    setError,
    pythonErrorLineNumberOffset,
    afterCodeRun,
  ])

  const runBlocklyCode = useCallback(() => {
    const run = async () => {
      await setEngine('skulpt', '1.0.0')
      clearError()
      setFeedbackColor('#fff')
      setFeedback(
        <>
          Kjører koden <i className="fas fa-sync fa-spin" />
        </>
      )
      try {
        await runCode(blocklyPythonCode + '\n' + postDefinedPythonCode, {
          turtleGraphics: {
            target: 'julekort-grafikk-turtle',
            width: 1600,
            height: 1600,
            assets: {
              'nisse-old-female': process.env.PUBLIC_URL + '/images/nisse-old-female.png',
              'nisse-old-male': process.env.PUBLIC_URL + '/images/nisse-old-male.png',
            },
          },
        })
        await afterCodeRun()
      } catch (error) {
        setError(error)
        console.error(error)
        setFeedbackColor('#fff')
        setFeedback(<>Obs, koden feilet! Dette skal ikke skje...</>)
      }
    }
    run()
  }, [blocklyPythonCode, postDefinedPythonCode, clearError, setError, afterCodeRun])

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  const RunCodeButton = ({ runCodeFunction }) => {
    if (!userId) {
      return (
        <RunButton
          onClick={() => {
            setShowLoginModal(true)
          }}
        >
          Kjør koden! <i className="fas fa-play" /> (Logg inn / Lag bruker først)
        </RunButton>
      )
    } else {
      return (
        <RunButton onClick={runCodeFunction}>
          Kjør koden <i className="fas fa-play" />
        </RunButton>
      )
    }
  }

  const editorElement =
    editorMode === 'python' ? (
      <CodeEditor language="python" above={<RunCodeButton runCodeFunction={runPythonCode} />} />
    ) : toolbox === null ? null : (
      <BlocklyEditor
        toolbox={toolbox}
        settings={data.blocklySettings || {}}
        above={<RunCodeButton runCodeFunction={runBlocklyCode} />}
      />
    )

  return (
    <>
      <h1>
        <LukeNr>Luke {lukeNr}:</LukeNr> {data.title}
      </h1>
      <Markdown>{data.description}</Markdown>
      {feedback && <h3 style={{ color: feedbackColor, margin: 0 }}>{feedback}</h3>}
      {pythonEngineLoading ? `Laster inn Python (${pythonEngineLoading}) ...` : ''}
      <Container>
        <Graphics />
        {editorElement}
      </Container>
    </>
  )
}

const Container = styled.div`
  background-color: #4c1616;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
`

const RunButton = styled(Button)`
  align-self: center;
  background-color: #080;
  color: #fff;

  :hover {
    background-color: #060;
  }
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
