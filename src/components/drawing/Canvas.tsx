import React, {
  useEffect,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import styled from "styled-components";
import { DrawingMenuContext } from "../../context/DrawingMenuContext";
import { WebRTCUser } from "../../types";
import { io, Socket } from "socket.io-client";

interface CanvasProps {
  width: number;
  height: number;
}

interface props {
  user: WebRTCUser;
}

interface Coordinate {
  x: number;
  y: number;
}

const Canvas = ({ user }: props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useContext(DrawingMenuContext);
  const { color, thickness, isDrawing, isErasing } = state;
  const socketRef = useRef<Socket | null>(null);

  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(
    undefined
  );
  const [isPainting, setIsPainting] = useState(false);
  const [drawnLines, setDrawnLines] = useState<Array<Coordinate>>([]);

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize(); // Initial update

    // Initialize socket only if it's not already established
    if (!socketRef.current) {
      socketRef.current = io(`${user.ipAddress}:5555`);
    }

    socketRef.current.on("connect", () => {
      console.log("connected!");
    });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (socketRef.current) {
        // Disconnect the socket if needed
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      if (isErasing) {
        context.globalCompositeOperation = "destination-out"; // Set mode to erase
        context.lineWidth = thickness * 2; // You might want a bigger eraser
      } else {
        context.globalCompositeOperation = "source-over"; // Set mode to draw
        context.strokeStyle = color;
        context.lineWidth = thickness;
      }

      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();
      context.stroke();
    }
  };

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); // Get the bounding rectangle of the canvas

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (isPainting && (isDrawing || isErasing)) {
        const newMousePosition = getCoordinates(event);
        const canvas = canvasRef.current;

        if (canvas && newMousePosition) {
          const { width, height } = canvas;
          if (newMousePosition.x > width || newMousePosition.y > height) {
            exitPaint();
          } else if (mousePosition) {
            drawLine(mousePosition, newMousePosition);
            setMousePosition(newMousePosition);

            setDrawnLines((prevLines) => [...prevLines, newMousePosition]);
          }
        }
      }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setIsPainting(false);
      const data = JSON.stringify({
        width: canvas.width,
        height: canvas.height,
        line: drawnLines,
        color: color,
        thickness: thickness,
        id: user.id,
      });
      console.log(data);
      console.log(socketRef.current);
      socketRef.current?.emit("send", data);
      setDrawnLines([]);
    }
  }, [drawnLines]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mousemove", paint);
    canvas.addEventListener("mouseup", exitPaint);

    return () => {
      canvas.removeEventListener("mousedown", startPaint);
      canvas.removeEventListener("mousemove", paint);
      canvas.removeEventListener("mouseup", exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  return <CanvasComponent ref={canvasRef} className="canvas"></CanvasComponent>;
};

export default Canvas;

const CanvasComponent = styled.canvas`
  border-radius: 15px;
  background: transparent;
  position: absolute;
  height: "100%";
  width: "100%";
  z-index: 10;
`;
