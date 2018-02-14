class Dish {
  constructor(elem) {
    this.SIZE = 600

    this.elem = elem
    this.ctx = elem.getContext('2d')
    this.elem.width = this.SIZE
    this.elem.height = this.SIZE

    this.reset()
  }

  reset() {
    var dim = 100
    var padding = 50

    var sx = padding
    var ex = this.SIZE - padding
    var sy = 200
    var ey = this.SIZE - padding

    this.ctx.translate(0.5, 0.5)
    this.ctx.strokeStyle = '#a5a5a5'

    this.ctx.moveTo(sx, sy)
    this.ctx.lineTo(ex, sy)
    this.ctx.lineTo(ex, ey)
    this.ctx.lineTo(sx, ey)
    this.ctx.lineTo(sx, sy)

    for (var x = sx; x < ex; x += 10) {
      for (var y = sy; y < ex; y += 10) {
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x, ey)
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(ex, y)
      }
    }

    this.ctx.stroke();
  }
}

var r30 = new Dish(document.querySelector('#canvas'))
