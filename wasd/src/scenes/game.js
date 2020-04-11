import { time } from '../../libs/wasd/game.js'
import { cls, spr, rectl, rect, line, print, circlel, circle, size } from '../../libs/wasd/draw.js'
import { btn, btnp } from '../../libs/wasd/input.js'
import { flr, pi, abs} from '../../libs/wasd/math.js'

import { Scene, changeScene } from '../../libs/wasd-libs/scene.js'
import Timer from '../../libs/wasd-libs/timer.js'

export default class Game extends Scene {
  constructor () {
    super()
  }
  
  enter (from) {

  }

  exit () {

  }

  update (dt) {
  }

  draw (dt) {
    cls()
  }
}