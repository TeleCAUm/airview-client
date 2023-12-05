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

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state } = useContext(DrawingMenuContext)
  const { color, thickness, isDrawing, isErasing } = state

  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)
  const [isPainting, setIsPainting] = useState(false)
  const [drawnLines, setDrawnLines] = useState<Array<Coordinate>>([])

  const updateCanvasSize = () => {
    const canvas = canvasRef.current
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
  }

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize)
    updateCanvasSize() // Initial update

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

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
    const rect = canvas.getBoundingClientRect() // Get the bounding rectangle of the canvas

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
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

      if (isPainting && (isDrawing || isErasing)) {
        const newMousePosition = getCoordinates(event)
        const canvas = canvasRef.current

        if (canvas && newMousePosition) {
          const { width, height } = canvas
          if (newMousePosition.x > width || newMousePosition.y > height) {
            exitPaint()
          } else if (mousePosition) {
            drawLine(mousePosition, newMousePosition)
            setMousePosition(newMousePosition)
          }
        }
      }
    },
    [isPainting, mousePosition]
  )

  const exitPaint = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setIsPainting(false)
      const data = JSON.stringify({
        width: canvas.width,
        height: canvas.height,
        line: drawnLines
      })
      console.log(data)
      setDrawnLines([])
    }
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

  return <CanvasComponent ref={canvasRef} className="canvas"></CanvasComponent>
}

export default Canvas

const CanvasComponent = styled.canvas`
  border-radius: 15px;
  background: transparent;
  position: absolute;
  height: '100%';
  width: '100%';
  z-index: 10;
`
