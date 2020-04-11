export default class Timer{
  constructor(time = 1, limit = null) {
    this.time = time
    this.limit = limit
    this.count = 0
    this.now = 0
  }
  reset() {
    this.count = 0
    this.now = 0
  }
  isLimit () {
    return this.limit != null && this.count >= this.limit
  }
  persent () {
    return Math.min(1, this.now / this.time)
  }
  executable(dt) {
    if (this.isLimit()) return false
    this.now = this.now + dt
    if (this.now > this.time) {
      this.now = this.now - this.time
      this.count = this.count + 1
      return true
    }
    return false
  }
}