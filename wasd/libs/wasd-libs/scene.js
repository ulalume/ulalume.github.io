import { update, draw, time } from '../wasd/game.js'

export class Scene {
  constructor () { this.firstTime = time() }
  time () {return time() - this.firstTime}
  enter (from) {}
  exit () {}
  update (dt) {}
  draw (dt) {}
}

export let nowScene
export const changeScene = (scene) => {
  if (scene == nowScene) return
  nowScene = scene
  scene.exit()

  update(nowScene.update.bind(nowScene))
  draw(nowScene.draw.bind(nowScene))
  nowScene.enter(scene)
}