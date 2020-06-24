import youtube from './youtube.js'
import clm from '../libs/clmtrackr.module.js'


let roundedMouse = 0;

youtube.onReady = () => {
    console.log("onready")

    const player = youtube.getDom();
    const video = document.getElementById("video")

    const coverUp = document.getElementById("cover_up")
    const coverDown = document.getElementById("cover_down")

    // getUserMedia によるカメラ映像の取得
    const media = navigator.mediaDevices.getUserMedia({       // メディアデバイスを取得
        video: {facingMode: "user"},                          // カメラの映像を使う（スマホならインカメラ）
        audio: false                                          // マイクの音声は使わない
    });

    media.then((stream) => {                                // メディアデバイスが取得できたら
        video.srcObject = stream;                             // video 要素にストリームを渡す
    });
       
    // clmtrackr の開始
    const tracker = new clm.tracker();  // tracker オブジェクトを作成
    tracker.init(pModel);             // tracker を所定のフェイスモデル（※）で初期化
    tracker.start(video);             // video 要素内でフェイストラッキング開始
 
    // 描画ループ
    const drawLoop = () => {
        requestAnimationFrame(drawLoop);
        
        const positions = tracker.getCurrentPosition();         // 顔部品の現在位置の取得
        try {
            const mouth = mouthSize(positions) / betweenEyes(positions)
            roundedMouse = roundedMouse * 0.96 + mouth * 0.04;
            //showMouthSize(mouth, roundedMouse)

            player.style.opacity = map(roundedMouse, 0.1, 0.12, 0.3, 1, true)
            coverUp.style.height = map(roundedMouse, 0.1, 0.3, 48, 0, true) + "vh"
            coverDown.style.height = map(roundedMouse, 0.1, 0.3, 48, 0, true) + "vh"
            coverDown.style.top =  (100 - map(roundedMouse, 0.1, 0.3, 48, 0, true)) + "vh"
            coverUp.style.width =  "100%"
            coverDown.style.width = "100%"
        } catch (e) {
            return
        }
    }
    drawLoop();
}

const clamp = (value, minValue, maxValue) => {
    return Math.min(maxValue, Math.max(minValue, value));
}
const map = (value, minValue, maxValue, min = 0, max = 1, crop = false) => {
    if (crop) value = clamp(value, minValue, maxValue)
    return (value - minValue) / (maxValue - minValue) * (max - min) + min
}

const showMouthSize = (mouth, roundedMouse) => {                                  // 全ての特徴点（71個）について
    const str = "口の大きさ: " + mouth.toFixed(2) +
        "<br />" +
        "口の大きさ（丸め値）: " + roundedMouse.toFixed(2)
    const dat = document.getElementById("dat")             // データ表示用div要素の取得
    dat.innerHTML = str;      
}

  
const betweenEyes = (positions) => {
  return distance(positions[27], positions[32])
}
const mouthSize = (positions) =>  {
  return distance(positions[60], positions[57])
}
const distance = (p0, p1)=> {
  return Math.sqrt(Math.pow(p0[0] - p1[0], 2)  + Math.pow(p0[1] - p1[1], 2))
}