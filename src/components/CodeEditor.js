import { useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { createBreakpoint } from 'react-use'
import styled from 'styled-components'
import { BlocklyWorkspace } from 'react-blockly'
import Blockly from 'blockly'
import 'blockly/python'
import './blockly-custom-blocks'
import { useStore } from '../store'
import { CSSShadows } from '../constants'

export const useBreakpoint = createBreakpoint({ L: 1016, S: 1015 })

const getHeight = (size) => {
  switch (size) {
    case 'L':
      return 'min(512px, calc(100vh - 64px))'
    default:
      return 'max(400px, calc(50vh - 32px - 14px))'
  }
}

const getWidth = (size) => {
  switch (size) {
    case 'L':
      return 'max(400px, calc(100vw - 32px - 14px))'
    default:
      return 'max(400px, calc(100vw - 32px - 14px))'
  }
}

export function CodeEditor({ above, below, language = 'python', onChange, ...props }) {
  const pythonCode = useStore((state) => state.pythonCode)
  const setDownloadablePythonCode = useStore((state) => state.setDownloadablePythonCode)
  const setPythonCode = useStore((state) => state.setPythonCode)
  const javascriptCode = useStore((state) => state.javascriptCode)
  const setJavascriptCode = useStore((state) => state.setJavascriptCode)
  const isPythonCodeEditable = useStore((state) => state.isPythonCodeEditable)
  const setEditor = useStore((state) => state.setEditor)

  const size = useBreakpoint()

  return (
    <Container>
      {above}
      <Editor
        height={getHeight(size)}
        width={getWidth(size)}
        theme="vs-dark"
        language={language}
        value={language === 'python' ? pythonCode : javascriptCode}
        onChange={(code) => {
          if (language === 'python') {
            setPythonCode(code)
            setDownloadablePythonCode(code)
          } else {
            setJavascriptCode(code)
          }
          onChange()
        }}
        className="monaco-editor"
        onMount={(editor) => {
          setEditor(editor)
          const messageContribution = editor.getContribution('editor.contrib.messageController')
          editor.onDidAttemptReadOnlyEdit(() => {
            messageContribution.showMessage(`Du kan ikke endre koden akkurat nå`, editor.getPosition())
          })
        }}
        {...props}
        options={{
          scrollBeyondLastLine: false,
          wordWrap: true,
          automaticLayout: true,
          renderWhitespace: 'boundary',
          readOnly: !isPythonCodeEditable,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
          minimap: {
            enabled: false,
          },
          ...(props.options || {}),
        }}
      />
      {below}
    </Container>
  )
}

export function BlocklyEditor({ above, below, toolbox = [], settings = {}, onChange = () => {}, ...props }) {
  const preDefinedPythonCode = useStore((state) => state.preDefinedPythonCode)
  const addedPreDefinedPythonCode = useStore((state) => state.addedPreDefinedPythonCode)
  const extraPythonCodeForTheBrowserRendering = useStore((state) => state.extraPythonCodeForTheBrowserRendering)
  const setBlocklyPythonCode = useStore((state) => state.setBlocklyPythonCode)
  const setDownloadablePythonCode = useStore((state) => state.setDownloadablePythonCode)
  const initialXml = useStore((state) => state.blocklyXml)
  const onXmlChange = useStore((state) => state.setBlocklyXml)
  const setBlocklyWorkspace = useStore((state) => state.setBlocklyWorkspace)

  const size = useBreakpoint()

  const onWorkspaceChange = useCallback(
    (workspace) => {
      setBlocklyPythonCode(
        preDefinedPythonCode +
          extraPythonCodeForTheBrowserRendering +
          addedPreDefinedPythonCode +
          '\n' +
          Blockly.Python.workspaceToCode(workspace)
      )
      setDownloadablePythonCode(
        preDefinedPythonCode + addedPreDefinedPythonCode + '\n' + Blockly.Python.workspaceToCode(workspace)
      )
    },
    [
      preDefinedPythonCode,
      extraPythonCodeForTheBrowserRendering,
      addedPreDefinedPythonCode,
      setBlocklyPythonCode,
      setDownloadablePythonCode,
    ]
  )

  return (
    <Container
      style={{
        height: getHeight(size),
        width: getWidth(size),
      }}
    >
      {above}
      <StyledBlocklyWorkspace
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true,
          },
          collapse: false,
          scrollbars: true,
          ...settings,
        }}
        onInject={(workspace) => {
          setBlocklyWorkspace(workspace)
          workspace.createVariable('a', 'int')
          workspace.registerButtonCallback('createVariable', () => {
            Blockly.Variables.createVariableButtonHandler(workspace, null, 'int')
          })
        }}
        onXmlChange={(xml) => {
          onXmlChange(xml)
          onChange()
        }}
        toolboxConfiguration={{
          kind: 'flyoutToolbox',
          contents: toolbox,
        }}
        {...{ initialXml, onWorkspaceChange }}
        {...props}
      />
      {below}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  margin-top: 56px;

  .monaco-editor {
    overflow: hidden;
    border-radius: 8px;
    ${CSSShadows.large}
  }
`

const StyledBlocklyWorkspace = styled(BlocklyWorkspace)`
  width: 100%;
  min-width: 400px;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;

  .blocklyScrollbarHorizontal.blocklyMainWorkspaceScrollbar,
  .blocklyScrollbarVertical.blocklyMainWorkspaceScrollbar {
    display: none;
  }
`
