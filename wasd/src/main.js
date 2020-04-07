import { conf, init, update, draw } from '../libs/wasd/game.js'
import { cls, spr, rectl, rect, line, print, circlel, circle } from '../libs/wasd/draw.js'
import { btn, btnp } from '../libs/wasd/input.js'
import { flr, pi, abs, rnd} from '../libs/wasd/math.js'

const main = async () => {
  conf({virtualPad: true})
  await init()

  update(dt => {

  })

  draw(dt => {
    cls()

    console.log(btn(0), btn(1), btn(2), btn(3), btn(4), btn(5))

    if(btn(0)) print("テキストの表示", 0, 0, 5)
    for( let num = 0; num < 16*16; num++) {
      const x = num % flr(128 / 8)
      const y = flr(num / flr(128 / 8))
      spr(num, x * 8 + 20, y * 8 + 20, 1, 1, 1)
    }

    line(rnd(10), rnd(100), rnd(100), rnd(100), 5)
    rect(rnd(10), rnd(100), rnd(100), rnd(100), 6)
    rectl(rnd(10), rnd(100), rnd(100), rnd(100), 7)
    circle( 100, 100 , 20, 4)
    circlel( 200, 100 , 20, 3)
  })
}
main()