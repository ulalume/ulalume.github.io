import youtube from './youtube.js'
import clm from '../libs/clmtrackr.module.js'

youtube.onReady = () => {
    console.log("onready")
    window.onclickstart = youtube.play
    window.onclickpause = youtube.pause
}
