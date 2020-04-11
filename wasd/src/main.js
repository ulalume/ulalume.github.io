import { conf, init, update, draw, time } from '../libs/wasd/game.js'

import { changeScene } from '../libs/wasd-libs/scene.js'
import Opening from './scenes/opening.js'

const main = async () => {
  conf({vpad: true, screen: 1, drawFps: true})

  await init()

  changeScene(new Opening())
}

main()
