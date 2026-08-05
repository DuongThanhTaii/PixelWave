"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { CanvasRenderer, Viewport, Pixel, CANVAS_CONFIG } from "@/lib/canvasRenderer";

interface CanvasGridProps {
  pixels: Map<string, Pixel>;
  onPlacePixel: (x: number, y: number) => void;
  onHoverPixel: (x: number, y: number) => void;
}

export function CanvasGrid({ pixels, onPlacePixel, onHoverPixel }: CanvasGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animationFrameId = useRef<number | undefined>(undefined);

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1.0,
    width: 0,
    height: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Initialize Renderer
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;
    
    // Set internal resolution
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;

    const initialViewport = {
      x: (CANVAS_CONFIG.width * CANVAS_CONFIG.defaultPixelSize) / 2 - clientWidth / 2,
      y: (CANVAS_CONFIG.height * CANVAS_CONFIG.defaultPixelSize) / 2 - clientHeight / 2,
      zoom: 1.0,
      width: clientWidth,
      height: clientHeight,
    };

    setViewport(initialViewport);

    rendererRef.current = new CanvasRenderer(canvasRef.current, initialViewport, pixels);

    const renderLoop = () => {
      rendererRef.current?.render();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      setViewport(prev => ({ ...prev, width: w, height: h }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update pixels in renderer
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updatePixels(pixels);
    }
  }, [pixels]);

  // Update viewport in renderer
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setViewport(viewport);
    }
  }, [viewport]);

  // Mouse Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!rendererRef.current) return;

    // Update hover
    const rect = canvasRef.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const coord = rendererRef.current.screenToCanvas(offsetX, offsetY);
    rendererRef.current.setHoverCoord(coord);
    onHoverPixel(coord.x, coord.y);

    if (isDragging) {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      setViewport(prev => {
        // Clamp panning
        const maxPanX = (CANVAS_CONFIG.width * CANVAS_CONFIG.defaultPixelSize * prev.zoom) - prev.width;
        const maxPanY = (CANVAS_CONFIG.height * CANVAS_CONFIG.defaultPixelSize * prev.zoom) - prev.height;
        
        return {
          ...prev,
          x: Math.max(0, Math.min(prev.x - dx, maxPanX)),
          y: Math.max(0, Math.min(prev.y - dy, maxPanY))
        };
      });

      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!rendererRef.current || !canvasRef.current) return;

    setViewport(prev => {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(CANVAS_CONFIG.minZoom, Math.min(CANVAS_CONFIG.maxZoom, prev.zoom * zoomFactor));
      
      if (newZoom === prev.zoom) return prev; // no change

      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX + prev.x) / prev.zoom;
      const worldY = (mouseY + prev.y) / prev.zoom;

      const maxPanX = (CANVAS_CONFIG.width * CANVAS_CONFIG.defaultPixelSize * newZoom) - prev.width;
      const maxPanY = (CANVAS_CONFIG.height * CANVAS_CONFIG.defaultPixelSize * newZoom) - prev.height;

      return {
        ...prev,
        zoom: newZoom,
        x: Math.max(0, Math.min(worldX * newZoom - mouseX, maxPanX)),
        y: Math.max(0, Math.min(worldY * newZoom - mouseY, maxPanY))
      };
    });
  }, []);

  // Attach wheel event listener non-passively
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const handleClick = (e: React.MouseEvent) => {
    // If we dragged, don't trigger click
    if (Math.abs(e.clientX - lastPointerRef.current.x) > 5 || 
        Math.abs(e.clientY - lastPointerRef.current.y) > 5) {
      return;
    }

    if (!rendererRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const coord = rendererRef.current.screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    onPlacePixel(coord.x, coord.y);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-crosshair">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="absolute top-0 left-0 w-full h-full touch-none"
        style={{ cursor: isDragging ? 'grabbing' : 'crosshair' }}
      />
    </div>
  );
}
