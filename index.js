class Dish {
  constructor(elem, fn) {
    var padding = 50
    var size = 600

    this.cells = []
    this.board = {}
    this.coors = {}

    this.fn = fn
    this.ctx = elem.getContext("2d")
    this.elem = elem
    this.elem.width = size
    this.elem.height = size

    this.coors.sx = padding
    this.coors.ex = size - padding
    this.coors.sy = 100
    this.coors.ey = size - padding

    this.board.gridColor = "#d5d5d5"
    this.board.cellColor = "#5385ff"
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
    if (this.cells.length >= this.board.rowHeight) {
      return
    }

    var curr = this.cells[this.cells.length - 1]
    var next = []

    for (var i = 0; i < this.board.rowWidth; i++) {
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
    var len = this.board.rowWidth
    return list[index < 0 ? len - index : index % len] || { state: 0 }
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
          sy += this.board.cellSize * (this.board.rowHeight - gens)
          this.ctx.fillStyle = this.board.cellColor
          this.ctx.fillRect(sx, sy, this.board.cellSize, this.board.cellSize)
        }
      }
    }
  }

  reset() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.elem.width, this.elem.height)

    this.ctx.translate(0.5, 0.5)
    this.ctx.strokeStyle = this.board.gridColor

    this.ctx.beginPath()

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

var Rules = {
  0: [0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 1],
  2: [0, 0, 0, 0, 0, 0, 1, 0],
  3: [0, 0, 0, 0, 0, 0, 1, 1],
  30: [1, 0, 0, 0, 0, 0, 0, 1],
  57: [0, 0, 1, 1, 1, 0, 0, 1],
  124: [0, 1, 1, 1, 1, 1, 0, 0],
  129: [1, 0, 0, 0, 0, 0, 0, 1],

  fn(n) {
    return (x, y, z) => {
      if (x & y & z) return Rules[n][0]
      if (x & y) return Rules[n][1]
      if (x & z) return Rules[n][2]
      if (x) return Rules[n][3]
      if (y & z) return Rules[n][4]
      if (y) return Rules[n][5]
      if (z) return Rules[n][6]
      else return Rules[n][7]
    }
  }
}

new Dish(document.querySelector("#canvas"), Rules.fn(57))