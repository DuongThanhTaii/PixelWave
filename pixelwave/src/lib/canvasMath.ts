export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewportX: number,
  viewportY: number,
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
) {
  return {
    x: Math.floor((screenX - canvasWidth / 2 - viewportX) / zoom),
    y: Math.floor((screenY - canvasHeight / 2 - viewportY) / zoom),
  };
}

export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewportX: number,
  viewportY: number,
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
) {
  return {
    x: Math.floor(canvasX * zoom + viewportX + canvasWidth / 2),
    y: Math.floor(canvasY * zoom + viewportY + canvasHeight / 2),
  };
}
