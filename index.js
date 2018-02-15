class Dish {
  constructor(elem) {
    var padding = 50
    var size = 600

    // Rule 30
    this.fn = (x, y, z) =>
      x ^ y | z

    this.cells = []
    this.board = {}
    this.coors = {}

    this.ctx = elem.getContext("2d")
    this.elem = elem
    this.elem.width = size
    this.elem.height = size

    this.coors.sx = padding
    this.coors.ex = size - padding
    this.coors.sy = 100
    this.coors.ey = size - padding

    this.board.cellSize = 10
    this.board.rowWidth = (this.coors.ex - this.coors.sx) / this.board.cellSize
    this.board.rowHeight = (this.coors.ey - this.coors.sy) / this.board.cellSize

    this.populate()

    setInterval(() => {
      this.draw()
      this.tick()
    }, 500)
  }

  tick() {
    var curr = this.cells[this.cells.length - 1]
    var next = []

    for (var i = 1; i < this.board.rowWidth - 1; i++) {
      var x = this.pick(curr, i - 1)
      var y = this.pick(curr, i)
      var z = this.pick(curr, i + 1)
      next[i] = { state: this.fn(x.state, y.state, z.state) }
    }

    this.cells.push(next)
  }

  populate() {
    var zero = this.board.rowWidth / 2 - 1
    this.cells = [[]]
    this.cells[0][zero] = { state: 1 }
  }

  pick(list, index) {
    return list[index] || { state: 0 }
  }

  get(generation, index) {
    var gen = this.cells[generation] || []
    return this.pick(gen, index)
  }

  draw() {
    this.reset()

    for (var gen = 0, gens = this.cells.length; gen < gens; gen++) {
      for (var i = 0; i < this.board.rowWidth; i++) {
        if (this.get(gen, i).state === 1) {
          var sx = this.coors.sx + this.board.cellSize * i
          var sy = this.coors.sy + this.board.cellSize * gen
          this.ctx.fillRect(sx, sy, this.board.cellSize, this.board.cellSize);
        }
      }
    }
  }

  reset() {
    this.ctx.translate(0.5, 0.5)
    this.ctx.strokeStyle = "#a5a5a5"

    this.ctx.beginPath();

    this.ctx.moveTo(this.coors.sx, this.coors.sy)
    this.ctx.lineTo(this.coors.ex, this.coors.sy)
    this.ctx.lineTo(this.coors.ex, this.coors.ey)
    this.ctx.lineTo(this.coors.sx, this.coors.ey)
    this.ctx.lineTo(this.coors.sx, this.coors.sy)

    for (var x = this.coors.sx; x < this.coors.ex; x += this.board.cellSize) {
      for (var y = this.coors.sy; y < this.coors.ex; y += this.board.cellSize) {
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x, this.coors.ey)
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(this.coors.ex, y)
      }
    }

    this.ctx.stroke()
  }
}

var r30 = new Dish(document.querySelector("#canvas"))
