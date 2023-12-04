import React, { useEffect, useContext, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { DrawingMenuContext } from '../../context/DrawingMenuContext'

interface CanvasProps {
  width: number
  height: number
}

interface Coordinate {
  x: number
  y: number
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state } = useContext(DrawingMenuContext)
  const { color, thickness, isDrawing, isErasing } = state

  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)
  const [isPainting, setIsPainting] = useState(false)
  const [drawnLines, setDrawnLines] = useState<Array<Coordinate>>([])

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    if (context) {
      if (isErasing) {
        context.globalCompositeOperation = 'destination-out' // Set mode to erase
        context.lineWidth = thickness * 2 // You might want a bigger eraser
      } else {
        context.globalCompositeOperation = 'source-over' // Set mode to draw
        context.strokeStyle = color
        context.lineWidth = thickness
      }

      context.lineJoin = 'round'
      context.beginPath()
      context.moveTo(originalMousePosition.x, originalMousePosition.y)
      context.lineTo(newMousePosition.x, newMousePosition.y)
      context.closePath()
      context.stroke()
    }
  }

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return
    }

    const canvas: HTMLCanvasElement = canvasRef.current
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    }
  }

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event)
    if (coordinates) {
      setIsPainting(true)
      setMousePosition(coordinates)
    }
  }, [])

  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()

      if (isPainting) {
        const newMousePosition = getCoordinates(event)
        if (newMousePosition && (newMousePosition.x > width || newMousePosition.y > height)) {
          exitPaint()
        }

        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition)
          setMousePosition(newMousePosition)
        }
      }
    },
    [isPainting, mousePosition]
  )

  const exitPaint = useCallback(() => {
    setIsPainting(false)
    const data = JSON.stringify({
      width: width,
      height: height,
      line: drawnLines
    })
    console.log(data)
    setDrawnLines([])
  }, [drawnLines])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current

    canvas.addEventListener('mousedown', startPaint)
    canvas.addEventListener('mousemove', paint)
    canvas.addEventListener('mouseup', exitPaint)

    return () => {
      canvas.removeEventListener('mousedown', startPaint)
      canvas.removeEventListener('mousemove', paint)
      canvas.removeEventListener('mouseup', exitPaint)
    }
  }, [startPaint, paint, exitPaint])

  return (
    <CanvasComponent>
      <canvas ref={canvasRef} height={height} width={width} className="canvas" />
    </CanvasComponent>
  )
}

Canvas.defaultProps = {
  width: 1000,
  height: window.innerHeight
}

export default Canvas

const CanvasComponent = styled.div`
  border-radius: 15px;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`
