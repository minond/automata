class Dish {
  constructor(elem, fn, config) {
    var def = {
      label: "unknown",
      continues: false,
      height: 200,
      width: 400,
      fontStyle: "monospace",
      fontSize: 14,
      gridColor: "#d5d5d5",
      textColor: "black",
      cellColor: "#5385ff",
      cellSize: 5,
      padding: 10
    }

    this.cells = []
    this.board = {}
    this.config = Object.assign(def, config || {})

    this.fn = fn
    this.ctx = elem.getContext("2d")
    this.elem = elem
    this.elem.width = this.config.width
    this.elem.height = this.config.height

    this.calculate()
    this.populate()

    let step = () => {
      this.draw()

      if (this.tick() !== false) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }

  tick() {
    if (this.cells.length >= this.board.rowHeight) {
      if (this.config.continues) {
        this.cells.shift()
      } else {
        return false
      }
    }

    var curr = this.cells[this.cells.length - 1]
    var next = []

    for (var i = 0; i < this.board.rowWidth * 1.1; i++) {
      var x = this.pick(curr, i - 1)
      var y = this.pick(curr, i)
      var z = this.pick(curr, i + 1)
      next[i] = { state: this.fn(x.state, y.state, z.state) }
    }

    this.cells.push(next)
  }

  calculate() {
    this.board.sx = this.config.padding
    this.board.ex = this.elem.width - this.config.padding
    this.board.sy = 2 * this.config.padding + this.config.fontSize
    this.board.ey = this.elem.height - this.config.padding

    this.board.rowWidth = Math.floor(
      (this.board.ex - this.board.sx) / this.config.cellSize
    )

    this.board.rowHeight = Math.floor(
      (this.board.ey - this.board.sy) / this.config.cellSize
    )
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
          var sx = this.board.sx + this.config.cellSize * i
          var sy = this.board.sy + this.config.cellSize * gen
          sy += this.config.cellSize * (this.board.rowHeight - gens)
          this.ctx.fillStyle = this.config.cellColor
          this.ctx.fillRect(sx, sy, this.config.cellSize, this.config.cellSize)
        }
      }
    }
  }

  reset() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.elem.width, this.elem.height)

    this.ctx.translate(0.5, 0.5)
    this.ctx.fillStyle = this.config.textColor
    this.ctx.font = this.config.fontSize + "px " + this.config.fontStyle
    this.ctx.fillText(this.config.label, this.board.sx, 20)

    this.ctx.strokeStyle = this.config.gridColor

    this.ctx.beginPath()
    this.ctx.moveTo(this.board.sx, this.board.sy)

    this.ctx.lineTo(this.board.ex, this.board.sy)
    this.ctx.lineTo(this.board.ex, this.board.ey)
    this.ctx.lineTo(this.board.sx, this.board.ey)
    this.ctx.lineTo(this.board.sx, this.board.sy)

    for (var x = this.board.sx; x < this.board.ex; x += this.config.cellSize) {
      for (var y = this.board.sy; y < this.board.ey; y += this.config.cellSize) {
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x, this.board.ey)
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(this.board.ex, y)
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
  30: [0, 0, 0, 1, 1, 1, 1, 0],
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

function show(rule) {
  var canvas = document.createElement("canvas")
  var config = {
    label: "Rule #" + rule,
    continues: 0,
    width: 400,
    height: 200
  }

  document.body.appendChild(canvas)
  return new Dish(canvas, Rules.fn(rule), config)
}

;[0, 1, 2, 3, 30, 57, 124, 129].map(show)
