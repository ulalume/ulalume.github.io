import { _init as init_d, print } from "./draw.js"
import { _init as init_i, _beforeUpdate as beforeUpdate_i, _afterUpdate as afterUpdate_i } from "./input.js"
import { _init as init_v, _afterUpdate as afterUpdate_v, _draw as draw_v } from "./vpad.js"

const defaultSettings = {
  screen: 1, // 0:64, 1:128, 2:256
  fps: null,
  fonts: ['full/gothic'],
  backgroundColor: 0, // 0 - 7
  vpad: false,
  defaultSprite: 'sprite.png',
  defaultGamepad: {index: 0, /*horizontal: 0, vertical: 1, */up: 12, down: 13 ,left: 14, right: 15, a: 0, b: 1},
  canvas: {
    vpadLeft: 'vpad-left',
    vpadRight: 'vpad-right',
    game: 'game',
  },
  drawFps: false,
}

const documentReady = (data) => {
  if ( document.readyState === 'loading' ) return new Promise( resolve => document.addEventListener( 'DOMContentLoaded', () => resolve(data) ))
  return Promise.resolve(data)
}

export let settings = {}
export const conf = (newSettings) => {
  for (var key in newSettings) settings[key] = newSettings[key]
}
conf(defaultSettings)

export const init = async () => {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(() => console.log("Service Worker Registered"))
  }
  await documentReady()
  await init_i(settings)
  await init_d(settings)
  
  if (settings.vpad) await init_v(settings)
}

const firstTime = Date.now()
export function time() {
  return (Date.now() - firstTime) / 1000
}

let timeoutId
export const update = (onupdate) => {
  clearTimeout(timeoutId)
  let time = Date.now()
  const func = () => { 
    const oldTime = time
    beforeUpdate_i()
    
    time = Date.now()
    if (onupdate == null) return
    onupdate((time - oldTime) / 1000)

    if (settings.vpad) afterUpdate_v()
    afterUpdate_i()
    timeoutId = setTimeout(func, 1000 / 60)
  }
  timeoutId = setTimeout(func, 1000 / 60)
}

let requestId
export const draw = (ondraw) => {
  settings.fps == null ? cancelAnimationFrame(requestId) : clearTimeout(requestId)
  let time = Date.now()
  const func = () => { 
    const oldTime = time
    time = Date.now()
    if (ondraw == null) return
    ondraw((time - oldTime) / 1000)
    if (settings.vpad) draw_v(settings)
    if (settings.drawFps) {print((1000 / (time - oldTime)).toFixed(1) + "fps", 8, 8, 7)}
    requestId = settings.fps == null ? requestAnimationFrame(func) : setTimeout(func, 1000 / settings.fps)
  }
  requestId = settings.fps == null ? requestAnimationFrame(func) : setTimeout(func, 1000 / settings.fps)
}