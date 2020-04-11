import { time } from '../../libs/wasd/game.js'
import { cls, print, printl, measure, circlel, circle, size, spr } from '../../libs/wasd/draw.js'
import { btn, btnp } from '../../libs/wasd/input.js'
import { flr, pi, abs} from '../../libs/wasd/math.js'

import { Scene, changeScene } from '../../libs/wasd-libs/scene.js'

import Game from './game.js'

export default class Opening extends Scene {
  constructor () {
    super()
  }
  
  enter (from) {

  }

  exit () {

  }

  update (dt) {
    if(btnp(4)) { changeScene(new Game()) }
  }

  draw (dt) {
    cls()
    const p = (time() % 1.5) / 1.5

    circlel(size / 2, size / 2, p * (size / 2), flr((time()*10) % 7 + 1.5))
    circlel(size / 2, size / 2, ((p + 0.25) % 1 )* (size / 2), flr((time()*10 + 1) % 7 + 1.5))
    circlel(size / 2, size / 2, ((p + 0.50) % 1)* (size / 2), flr((time()*10 + 2) % 7 + 1.5))
    circlel(size / 2, size / 2, ((p + 0.75) % 1)* (size / 2), flr((time()*10 + 3) % 7 + 1.5))

    if (time() % 1 < 0.5) {
      const txt = 'Press Start A'
      const txtSize = measure(txt)
      print(txt, (size-txtSize[0]) / 2, (size-txtSize[1]) / 2 + 10)
    }

    const txt2 = halfToFull('Shooting Star')
    const txtSize2 = measure(txt2)
    printl(txt2, (size-txtSize2[0]) / 2+1, (size-txtSize2[1]) / 2, flr((time()*10) % 4 + 4.5), flr((time()*10) % 4 + 0.5))
  }
}

const fullToHalf = (str) => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
const halfToFull = (str) => {
  return str.replace(/[A-Za-z0-9]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}