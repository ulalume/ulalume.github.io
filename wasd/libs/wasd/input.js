export const keyCodes = [
  {key: "a", code: "KeyA"},
  {key: "d", code: "KeyD"},
  {key: "w", code: "KeyW"},
  {key: "s", code: "KeyS"},
  {key: "n", code: "KeyN"},
  {key: "m", code: "KeyM"},
]
const codes = keyCodes.map(v => v.code)
export const _state = codes.map(_=>0)

const getIndex = (code) => {
  let i = codes.indexOf(code)
  if (i != -1) return i
  return null
}

let gamePadState = codes.map(_=>false)
let gamePadInfo // {index: 0, horizontal: 0, vertical: 1, up: 12, down: 13 ,left: 14, right: 15, a: 0, b: 1}
export const getGamepad = () => {
  if (navigator.getGamepads == null) return null
  return navigator.getGamepads()[gamePadInfo.index]
}
export const _beforeUpdate = () => {
  const gp = getGamepad()
  if (gp == null) return

  ['left', 'right', 'up', 'down', 'a', 'b'].forEach((b, i)=>{
    const button = gp.buttons[gamePadInfo[b]]
    if (button== null) return
    if (button.pressed && !gamePadState[i]) {
      gamePadState[i] = true
      document.dispatchEvent(new KeyboardEvent("keydown", keyCodes[i]))
    } else
    if (!button.pressed && gamePadState[i]) {
      gamePadState[i] = false
      document.dispatchEvent(new KeyboardEvent("keyup", keyCodes[i]))
    }
  })
}

export const _afterUpdate = () => {
  for (var i = 0; i < _state.length; i++) {
    if (_state[i] == 1) _state[i] = 2
  }
}
export const _init = (settings) => {
  gamePadInfo = settings.defaultGamepad
  document.addEventListener("keydown", event => {
    const i = getIndex(event.code)
    if (i !== null && _state[i] == 0) _state[i] = 1
  })
  document.addEventListener("keyup", event => {
    const i = getIndex(event.code)
    if (i !== null) _state[i] = 0
  })
}
export const btn = (i) => _state[i] != 0
export const btnp = (i) => _state[i] == 1