import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useStore } from '../store'
import { CSSShadows } from '../constants'
import { LinkButton } from './Button'
import { useBreakpoint } from './CodeEditor'
import { CodePreview } from './CodePreview'

export function Graphics({ imageNumber, fullScreen = false, ...props }) {
  const canvasRef = useRef()
  const canvasGridRef = useRef()
  const canvasCtxRef = useRef()
  const turtleCanvasContainerRef = useRef()
  const setCanvas = useStore((state) => state.setCanvas)
  const showGrid = useStore((state) => state.showGrid)
  const error = useStore((state) => state.error)
  const pythonErrorLineNumberOffset = useStore((state) => state.pythonErrorLineNumberOffset)
  const editorMode = useStore((state) => state.editorMode)
  const setImage = useStore((state) => state.setImage)
  const title = useStore((state) => state.title)

  const size = useBreakpoint()

  const canvasColor = useStore((state) => state.canvasColor)

  useEffect(() => {
    if (canvasRef.current !== null) {
      setCanvas(canvasRef.current)
      canvasCtxRef.current = canvasRef.current.getContext('2d')
    }
  }, [setCanvas])

  useEffect(() => {
    if (canvasRef.current !== null) {
      canvasCtxRef.current.fillStyle = canvasColor
      canvasCtxRef.current.fillRect(0, 0, 1600, 1600)
    }
  }, [canvasColor])

  useEffect(() => {
    if (canvasGridRef.current !== null) {
      const ctx = canvasGridRef.current.getContext('2d')

      ctx.clearRect(0, 0, 400, 400)

      if (showGrid) {
        const red = parseInt(canvasColor.slice(1, 3), 16)
        const green = parseInt(canvasColor.slice(3, 5), 16)
        const blue = parseInt(canvasColor.slice(5, 7), 16)
        const isDark = red * 0.2126 + green * 0.7152 + blue * 0.0722 < 40

        ctx.beginPath()

        for (let x = 100; x < 400; x += 100) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, 400)
          ctx.moveTo(0, x)
          ctx.lineTo(400, x)
        }

        ctx.lineWidth = 2
        ctx.strokeStyle = isDark ? '#fff4' : '#0004'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(200, 0)
        ctx.lineTo(200, 400)
        ctx.moveTo(0, 200)
        ctx.lineTo(400, 200)
        ctx.strokeStyle = isDark ? '#fff' : '#000'
        ctx.stroke()

        ctx.font = '12px Helvetica'
        ctx.fillStyle = isDark ? '#fff' : '#000'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText('-100px', 102, 204)
        ctx.fillText('100px', 302, 204)
        ctx.fillText('100px', 202, 104)
        ctx.fillText('-100px', 202, 304)
      }
    }
  }, [showGrid, canvasColor])

  const generateImage = useCallback(
    (download = false) => {
      if (turtleCanvasContainerRef.current && canvasCtxRef.current) {
        const turtleCanvas = turtleCanvasContainerRef.current.children[1]
        if (!turtleCanvas) return
        const width = turtleCanvas.width
        const height = turtleCanvas.height
        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasCtxRef.current.fillStyle = canvasColor
        canvasCtxRef.current.fillRect(0, 0, width, height)

        let first = true
        for (const canvas of turtleCanvasContainerRef.current.children) {
          if (first) {
            first = false
            continue
          }
          canvasCtxRef.current.drawImage(canvas, 0, 0, width, height)
        }

        const base64String = canvasRef.current.toDataURL('image/png;base64')

        if (download) {
          const linkElement = document.createElement('a')
          linkElement.download = (title || 'julekort').replace(/[^a-zøæå ]/gi, '') + '.png'
          linkElement.href = base64String
          linkElement.click()
        }

        window.image = base64String
        setImage(base64String)

        canvasCtxRef.current.fillStyle = canvasColor
        canvasCtxRef.current.fillRect(0, 0, width, height)
      }
    },
    [canvasColor, setImage, title]
  )

  const BottomSettings = () => (
    <BottomContainer>
      <LinkButton onClick={() => generateImage(true)}>
        Last ned bilde <i className="fas fa-download" />
      </LinkButton>
    </BottomContainer>
  )

  const preImageNumber = useRef(-1)
  useEffect(() => {
    if (preImageNumber.current !== imageNumber) {
      preImageNumber.current = imageNumber
      generateImage(false)
    }
  }, [imageNumber, generateImage])

  return (
    <GraphicsContainer $fixedPosition={size === 'L' && !fullScreen} $fullScreen={fullScreen}>
      <Canvas height="1600px" width="1600px" ref={canvasRef} {...props} />
      <CanvasContainer id="julekort-grafikk-turtle" ref={turtleCanvasContainerRef} />
      <CanvasContainer id="julekort-grafikk-p5" />
      <CanvasGrid height="400px" width="400px" ref={canvasGridRef} />
      <BottomSettings />
      {error && (
        <ShowError>
          {editorMode === 'python' ? (
            <>
              <h2>Du fikk en feilmelding 😬</h2>
              <h4>
                MEN det er ingen grunn til panikk!
                <br />
                Dette skjer hele tiden 🤗
              </h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {error.type}: {error.message}
              </pre>
              {error.lineNumber && (
                <>
                  <h4>Tips: Feilen ligger på linje {error.lineNumber - pythonErrorLineNumberOffset} 😉:</h4>
                  <CodePreview
                    code={
                      error.getNLinesAbove(2).join('\n') +
                      '\n' +
                      error.line +
                      ' # <- Se her 🧐\n' +
                      error.getNLinesBelow(2).join('\n')
                    }
                  />
                </>
              )}
            </>
          ) : (
            <>
              <h1 style={{ textAlign: 'center' }}>Obs!</h1>
              <h2>Det kom en feilmelding 😬 Gjerne huk tak i noen fra kodeklubben om du står fast!</h2>
              <h4>
                (Om du vil finne ut av feilen selv kan du trykke på "Gjør om til Python <i className="fas fa-code" />
                "-knappen, så får du en mer detaljert tilbakemelding)
              </h4>
            </>
          )}
        </ShowError>
      )}
    </GraphicsContainer>
  )
}

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
`

const Canvas = styled.canvas`
  border-radius: 8px;
`

const CanvasGrid = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
`

const TopContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
`

const GraphicsContainer = styled.div`
  --width: ${(props) => (props.$fullScreen ? 'min(60vh, 90vw)' : '400px')};

  position: ${(props) => (props.$fixedPosition ? 'absolute' : 'relative')};
  z-index: 999;
  top: ${(props) => (props.$fixedPosition ? '51px' : 'unset')};
  right: ${(props) => (props.$fixedPosition ? '16px' : 'unset')};
  width: var(--width);
  height: var(--width);
  background-color: transparent;
  border-radius: 8px;
  margin-top: 56px;
  margin-bottom: 44px;
  ${CSSShadows.large}

  canvas {
    width: var(--width) !important;
    height: var(--width) !important;
  }

  canvas + canvas {
    margin-top: calc(-1 * var(--width)) !important;
  }

  ${TopContainer} {
    justify-content: ${(props) => (props.$fullScreen ? 'flex-start' : 'space-between')};
  }
`

const BottomContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`

const ShowError = styled.div`
  border-radius: 7px;
  z-index: 1001;
  background: #000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  font-family: monospace;
  font-size: 16px;
  text-align: left;

  pre {
    color: red;
  }
`
