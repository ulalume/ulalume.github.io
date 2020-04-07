import BDFFont from '../bdffont/bdffont.js'
import { flr, pi, abs } from './math.js'
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  });
}

let defaultSprite
let sprite
export const setspr = (sprt = null) => {
  if (sprt == null) {
    sprite = defaultSprite
    return
  }
  sprite = sprt
}

const fonts = []
const fontIndex = 0
export const setfont = (index) => {
  fontIndex = index
}

const palette = [
  0xFF000000,
  0xFF0000FF,
  0xFFFF0000,
  0xFF00FF00,
  0xFFFF00FF,
  0xFF00FFFF,
  0xFFFFFF00,
  0xFFFFFFFF,
]
const palette2 = palette.map(c => (c.toString(16)).replace('ff', '#'))

let canvas
let ctxList = []
const ctx = () => {
  return ctxList[ctxList.length - 1]
}
export const pushctx = (context) => {
  ctxList.push(context)
}
export const popctx = () => {
  if (ctxList == 1) return
  ctxList.pop()
}

export const _size = [64, 128, 128, 256]

export const loadData = async (settings) => {
  defaultSprite = await loadImage('./images/' + settings.defaultSprite).catch(e => console.log('onload error', e));
  sprite = defaultSprite
  for (const f of settings.fonts) {
    const res = await fetch(`./fonts/${f}.bdf`);
    const data = await res.text();
    fonts.push(new BDFFont(data))
  }
}

export const _init = async (settings) => {
  canvas = document.querySelector('#game')
  canvas.width = _size[settings.screen]
  canvas.height = _size[settings.screen]
  canvas.setAttribute('style', `background-color:${palette2[settings.backgroundColor]}`)
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = false
  pushctx(context)

  await loadData(settings)
}

export const cls = (x = 0, y = 0, w = null, h = null) => {
  ctx().clearRect(x, y, w || canvas.width, h || canvas.height)
}

export const spr = (num, x, y, sw = 1, sh = 1, rotation = 0) => {
  num = flr(num)
  x = flr(x)
  y = flr(y)
  const sx = (num * 8) % sprite.width
  const sy = flr((num * 8) / sprite.width) * 8
  if (rotation != 0) {
    rotation = flr(rotation)
    ctx().save()
    ctx().translate(x + sx / 2, y + sy / 2)
    ctx().rotate(rotation * pi/ 2)
    ctx().drawImage(sprite, sx, sy, sw * 8, sh * 8, -sx / 2, -sy /2, sw * 8, sh * 8)
    ctx().restore()
  } else {
    ctx().drawImage(sprite, sx, sy, sw * 8, sh * 8, x, y, sw * 8, sh * 8)
  }
}

export const sspr = (sx, sy, x, y, sw = 8, sh = 8, rotation = 0) => {
  x = flr(x)
  y = flr(y)
  sx = flr(sx)
  sy = flr(sy)
  if (rotation != 0) {
    rotation = flr(rotation)
    ctx().save()
    ctx().translate(x + sx / 2, y + sy / 2)
    ctx().rotate(rotation * pi/ 2)
    ctx().drawImage(sprite, sx, sy, sw, sh, - sx / 2, - sy / 2, sw, sh)
    ctx().restore()
  } else {
    ctx().drawImage(sprite, sx, sy, sw, sh, x, y, sw, sh)
  }
}

export const rectl = (x, y, w, h, color) => {
  if (w == 1 && h == 1) {
    pset(x, y, color)
    return
  }
  x = flr(x)
  y = flr(y)
  w = flr(w)
  h = flr(h)
  x+=0.5
  y+=0.5
  w-=1
  h-=1
  ctx().beginPath();
  ctx().strokeStyle = palette2[color]
  ctx().lineWidth = 1;
  ctx().strokeRect(x, y, w, h)
  ctx().stroke();
}
export const rect = (x, y, w, h, color) => {
  x = flr(x)
  y = flr(y)
  w = flr(w)
  h = flr(h)
  ctx().fillStyle = palette2[color]
  ctx().fillRect(x, y, w, h)
}
export const pset = (x, y, color) => {
  rect(x, y, 1, 1, color)
}

export const circlel = (x0, y0, r, color) => {
  x0 = flr(x0)
  y0 = flr(y0)
  r = flr(r)
  let x = r;
  let y = 0;
  let F = -2 * r + 3;

  while ( x >= y ) {
    pset( x0 + x, y0 + y, color )
    pset( x0 - x, y0 + y, color )
    pset( x0 + x, y0 - y, color )
    pset( x0 - x, y0 - y, color )
    pset( x0 + y, y0 + x, color )
    pset( x0 - y, y0 + x, color )
    pset( x0 + y, y0 - x, color )
    pset( x0 - y, y0 - x, color )
    if ( F >= 0 ) {
      x--;
      F -= 4 * x;
    }
    y++;
    F += 4 * y + 2;
  }
}
export const circle = (x0, y0, r, color) => {
  x0 = flr(x0)
  y0 = flr(y0)
  r = flr(r)
  ctx().fillStyle = palette2[color]
  ctx().arc(x0 + 0.5, y0 + 0.5, r, 0, pi * 2)
  ctx().fill()
  circlel(x0, y0, r, color)
}

export const print = (str, x = 0, y = 0, color = 7) => {
  ctx().fillStyle = palette2[color]
  fonts[fontIndex].drawText(ctx(), str, flr(x), flr(y) + 6)
}
export const line = (x1, y1, x2, y2, color) => {
  x1 = flr(x1)
  y1 = flr(y1)
  x2 = flr(x2)
  y2 = flr(y2)

  if (x1 == x2) {
    rect(x1, y1, 1, y2 - y1)
    return
  }
  if (y1 == y2) {
    rect(x1, y1, x2 - x1, 1)
    return
  }
  
  const dx = abs(x2 - x1);
  const dy = abs(y2 - y1);
  const sx = (x1 < x2) ? 1 : -1;
  const sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;

  while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
          err -= dy;
          x1 += sx;
      }
      if (e2 < dx) {
          err += dx;
          y1 += sy;
      }
      pset(x1, y1, color);
  }
}