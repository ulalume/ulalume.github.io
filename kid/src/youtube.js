/*
import { conf, init, update, draw, time } from '../libs/wasd/game.js'

import { changeScene } from '../libs/wasd-libs/scene.js'
import Opening from './scenes/opening.js'

const main = async () => {
  conf({ vpad: true, screen: 1, drawFps: true })

  await init()

  changeScene(new Opening())
}

main()
*/


let player;

class YoutubeVideo {
  constructor() {
    this.player = player
  }
  getDom() {
    return document.getElementById("player")
  }
  play() {
    this.player.playVideo()
  }
  pause() {
    this.player.pauseVideo()
  }
  stop() {
    this.player.stopVideo()
  }
}

const youtube = new YoutubeVideo()

// 2. This code loads the IFrame Player API code asynchronously.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('player', {
    width: '560',
    height: '315',
    videoId: 'z9o5_30_0f4',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
window.onPlayerReady = (event) => {
  event.target.playVideo();
  if (youtube.onReady) youtube.onReady();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
//var done = false;
window.onPlayerStateChange = (event) => {
  /*
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }*/
}

export default youtube