
import { cls, spr, rectl, rect, line, print, _size, pushctx, popctx, circlel } from './draw.js'
import { _state as buttonState, keyCodes as codes } from './input.js'
import { draw } from './game.js'

const canvases = []
const ctxes = []
const tempState = codes.map(_=> null)
const state = codes.map(_=>0)

let leftTouchId
const leftButtons = [1, 3, 0, 2]
const rightTouchIds = [null, null]
const rightButtons = [4, 5]

export const _init = async (settings) => {
  const canvasLeft = document.querySelector('#virtual-pad-left')
  canvasLeft.width = _size[settings.screen] / 2
  canvasLeft.height = _size[settings.screen] / 2
  canvases.push(canvasLeft)
  
  const canvasRight = document.querySelector('#virtual-pad-right')
  canvasRight.width = _size[settings.screen] / 2
  canvasRight.height = _size[settings.screen] / 2
  canvases.push(canvasRight)

  if ('ontouchstart' in window) {
    canvasLeft.addEventListener("touchstart", handleStartLeft, false);
    canvasLeft.addEventListener("touchmove",  handleMoveLeft, false);
    canvasLeft.addEventListener("touchend", handleEndLeft, false);
    canvasRight.addEventListener("touchstart", handleStartRight, false);
    canvasRight.addEventListener("touchend", handleEndRight, false);
  } else {
    canvasLeft.addEventListener("mousedown", onmousedownLeft, false);
    canvasLeft.addEventListener("mousemove", onmousemoveLeft, false);
    canvasLeft.addEventListener("mouseup", onmouseupLeft, false);
    canvasRight.addEventListener("mousedown", onmousedownRight, false);
    canvasRight.addEventListener("mouseup", onmouseupRight, false);
  } 
  canvases.forEach(canvas => {
    const context = canvas.getContext('2d')
    context.imageSmoothingEnabled = false
    ctxes.push(context)
  })

  buttonLayouts = [
    [canvases[0].width / 4 - 2, canvases[0].height / 4 * 2, canvases[0].width / 5 ],
    [canvases[0].width / 4 * 3 + 2, canvases[0].height / 4 * 2, canvases[0].width / 5 ],
    [canvases[0].width / 4 * 2, canvases[0].height / 4 - 2, canvases[0].width / 5 ],
    [canvases[0].width / 4 * 2, canvases[0].height / 4 * 3 + 2, canvases[0].width / 5 ],
  
    [canvases[1].width / 2, canvases[1].height / 2, canvases[1].width / 3],
    [canvases[1].width / 6 * 5, canvases[1].height / 6, canvases[1].width / 8],
  ]
}

export const _afterUpdate = () => {
  buttonState.forEach((bs, i) => state[i] = bs != 0)
}

let buttonLayouts;
export const _draw = () => {
  state.forEach((b, i) => {
    if (b != tempState[i]) {
      if (i < 4) {
        pushctx(ctxes[0])
        circlel(buttonLayouts[i][0], buttonLayouts[i][1], buttonLayouts[i][2], b ? 4 : 1)
        popctx()
      } else {
        pushctx(ctxes[1])
        circlel(buttonLayouts[i][0], buttonLayouts[i][1], buttonLayouts[i][2], b ? 4 : 1)
        popctx()
      }
    }
    tempState[i] = b
  })
}

const touchLeft = point => {
  let r = Math.atan2(point.y - canvases[0].height / 2, point.x - canvases[0].width / 2)
  r = r < 0 ? r + Math.PI * 2 : r
  r = Math.round(r / (2 * Math.PI) * 8) % 8

  const b0 = Math.floor(r / 2)
  const b1 = Math.ceil(r / 2) % 4

  leftButtons.forEach((s, i) => {
    if (buttonState[s] == 0) {
      if (i == b0 || i == b1) document.dispatchEvent(new KeyboardEvent("keydown", codes[s]))
    } else {
      if (!(i == b0 || i == b1)) document.dispatchEvent(new KeyboardEvent("keyup", codes[s]))
    }
  })
}
const handleStartLeft = e => {
  e.preventDefault()
  for (const touch of e.touches) {
    leftTouchId = touch.identifier
    touchLeft(getPoint(e.target, touch.clientX, touch.clientY))
    break;
  }
}

const handleMoveLeft = e => {
  e.preventDefault()
  for (const touch of e.touches) {
    if (leftTouchId != touch.identifier) continue
    touchLeft(getPoint(e.target, touch.clientX, touch.clientY))
    break;
  }
}
const handleEndLeft = e => {
  e.preventDefault()
  if (e.touches.length == 0) {
    leftButtons.forEach((s) => {
      if (buttonState[s] != 0) document.dispatchEvent(new KeyboardEvent("keyup", codes[s]))
    })
    return
  }
  handleStartLeft(e)
}

const handleStartRight = e => {
  e.preventDefault()

  for (const touch of e.touches) {
    const p = getPoint(e.target, touch.clientX, touch.clientY)
    if (p.x > canvases[1].width / 3 * 2 && p.y < canvases[1].height / 3) {
      if (buttonState[rightButtons[1]] == 0) {
        document.dispatchEvent(new KeyboardEvent("keydown", codes[rightButtons[1]]))
        rightTouchIds[1] = touch.identifier
      }
    } else {
      if (buttonState[rightButtons[0]] == 0) {
        document.dispatchEvent(new KeyboardEvent("keydown", codes[rightButtons[0]]))
        rightTouchIds[0] = touch.identifier
      }
    }
  }
}
const handleEndRight = e => {
  e.preventDefault()
  if (e.touches.length == 0) {
    rightButtons.forEach((s) => {
      if (buttonState[s] != 0) document.dispatchEvent(new KeyboardEvent("keyup", codes[s]))
    })
    return
  }
  const ids = e.touches.map(touch => touch.identifier)
  rightTouchIds.forEach(id, i => {
    if (ids.indexOf(id) == -1 && buttonState[rightButtons[i]] != 0) {
      rightTouchIds[i] = null
      document.dispatchEvent(new KeyboardEvent("keyup", codes[rightButtons[0]]))
    }
  })
}
const onmousedownLeft = e => {
  touchLeft(getPoint(e.target, e.clientX, e.clientY))
}
const onmousemoveLeft = e => {
  touchLeft(getPoint(e.target, e.clientX, e.clientY))
}
const onmouseupLeft = e => {
  leftButtons.forEach((s) => {
    if (buttonState[s] != 0) document.dispatchEvent(new KeyboardEvent("keyup", codes[s]))
  })
}

const onmousedownRight = e => {
  const p = getPoint(e.target, e.clientX, e.clientY)
  if (p.x > canvases[1].width / 3 * 2 && p.y < canvases[1].height / 3) {
    if (buttonState[rightButtons[1]] == 0) {
      document.dispatchEvent(new KeyboardEvent("keydown", codes[rightButtons[1]]))
    }
  } else {
    if (buttonState[rightButtons[0]] == 0) {
      document.dispatchEvent(new KeyboardEvent("keydown", codes[rightButtons[0]]))
    }
  }
}
const onmouseupRight = e => {
  rightButtons.forEach((s) => {
    if (buttonState[s] != 0) document.dispatchEvent(new KeyboardEvent("keyup", codes[s]))
  })
}


const getPoint = (canvas, clientX, clientY) => {
  const rect = canvas.getBoundingClientRect()
  return {x :(clientX - rect.left) / canvas.clientWidth * canvas.width, y: (clientY - rect.top) / canvas.clientHeight * canvas.height}
}

const hitRect = (point, rect) => rect.x <= point.x && point.x <= rect.x + rect.w
                              && rect.y <= point.y && point.y <= rect.y + rect.h
const hitCircle = (point, rect) =>(point.x-rect.centerX) *(point.x-rect.centerX) + (point.y-rect.centerY) *(point.y-rect.centerY) <= rect.radius * rect.radius