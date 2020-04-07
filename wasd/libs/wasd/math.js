export const flr = Math.floor.bind(Math)
export const abs = Math.abs.bind(Math)
export const pi = Math.PI

class Xorshift{
  constructor(n, x, y, z) {
    this.seed(n, x, y, z)
  }
  seed (n = 88675123, x = 123456789, y = 362436069, z = 521288629) {
      this.x = x
      this.y = y
      this.z = z
      this.w = n
  }
  rnd () {
    const t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w^(this.w>>19))^(t^(t>>8));
  }
  rndInt(max) {
    const r = Math.abs(this.rnd());
    return (r % (max + 1));
  }
}

const xorshift = new Xorshift(Date.now())

export const seed = xorshift.seed.bind(xorshift)
export const rnd = xorshift.rndInt.bind(xorshift)