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

    for (var x = this.board.sx; x < this.board.ex; x += this.config.cellSize) {
      this.ctx.moveTo(x, this.board.sy)
      this.ctx.lineTo(x, this.board.ey)
    }

    for (var y = this.board.sy; y < this.board.ey; y += this.config.cellSize) {
      this.ctx.moveTo(this.board.sx, y)
      this.ctx.lineTo(this.board.ex, y)
    }

    this.ctx.stroke()
    this.ctx.closePath()
  }
}

var Rules = {
  0: [0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 1],
  2: [0, 0, 0, 0, 0, 0, 1, 0],
  3: [0, 0, 0, 0, 0, 0, 1, 1],
  4: [0, 0, 0, 0, 0, 1, 0, 0],
  7: [0, 0, 0, 0, 0, 1, 1, 1],
  12: [0, 0, 0, 0, 1, 1, 0, 0],
  14: [0, 0, 0, 0, 1, 1, 1, 0],
  15: [0, 0, 0, 0, 1, 1, 1, 1],
  18: [0, 0, 0, 1, 0, 0, 1, 0],
  22: [0, 0, 0, 1, 0, 1, 1, 0],
  30: [0, 0, 0, 1, 1, 1, 1, 0],
  32: [0, 0, 1, 0, 0, 0, 0, 0],
  41: [0, 0, 1, 0, 1, 0, 0, 1],
  45: [0, 0, 1, 0, 1, 1, 0, 1],
  48: [0, 0, 1, 1, 0, 0, 0, 0],
  50: [0, 0, 1, 1, 0, 0, 1, 0],
  51: [0, 0, 1, 1, 0, 0, 1, 1],
  54: [0, 0, 1, 1, 0, 1, 1, 0],
  56: [0, 0, 1, 1, 1, 0, 0, 0],
  57: [0, 0, 1, 1, 1, 0, 0, 1],
  60: [0, 0, 1, 1, 1, 1, 0, 0],
  62: [0, 0, 1, 1, 1, 1, 1, 0],
  73: [0, 1, 0, 0, 1, 0, 0, 1],
  85: [0, 1, 0, 1, 0, 1, 0, 1],
  86: [0, 1, 0, 1, 0, 1, 1, 0],
  90: [0, 1, 0, 1, 1, 0, 1, 0],
  94: [0, 1, 0, 1, 1, 1, 1, 0],
  102: [0, 1, 1, 0, 0, 1, 1, 0],
  103: [0, 1, 1, 0, 0, 1, 1, 1],
  105: [0, 1, 1, 0, 1, 0, 0, 1],
  107: [0, 1, 1, 0, 1, 0, 1, 1],
  108: [0, 1, 1, 0, 1, 1, 1, 0],
  109: [0, 1, 1, 0, 1, 1, 0, 1],
  110: [0, 1, 1, 0, 1, 1, 1, 0],
  121: [0, 1, 1, 1, 1, 0, 0, 1],
  123: [0, 1, 1, 1, 1, 0, 1, 1],
  124: [0, 1, 1, 1, 1, 1, 0, 0],
  126: [0, 1, 1, 1, 1, 1, 1, 0],
  127: [0, 1, 1, 1, 1, 1, 1, 1],
  128: [1, 0, 0, 0, 0, 0, 0, 0],
  129: [1, 0, 0, 0, 0, 0, 0, 1],
  132: [1, 0, 0, 0, 0, 1, 0, 0],
  136: [1, 0, 0, 0, 1, 0, 0, 0],
  137: [1, 0, 0, 0, 1, 0, 0, 1],
  144: [1, 0, 0, 1, 0, 0, 0, 0],
  146: [1, 0, 0, 1, 0, 0, 1, 0],
  148: [1, 0, 0, 1, 0, 1, 0, 0],
  150: [1, 0, 0, 1, 0, 1, 1, 0],
  152: [1, 0, 0, 1, 1, 0, 0, 0],
  160: [1, 0, 1, 0, 0, 0, 0, 0],
  170: [1, 0, 1, 0, 1, 0, 1, 0],
  172: [1, 0, 1, 0, 1, 1, 0, 0],
  176: [1, 0, 1, 1, 0, 0, 0, 0],
  182: [1, 0, 1, 1, 0, 1, 1, 0],
  184: [1, 0, 1, 1, 1, 0, 0, 0],
  188: [1, 0, 1, 1, 1, 1, 0, 0],
  190: [1, 0, 1, 1, 1, 1, 1, 0],
  192: [1, 1, 0, 0, 0, 0, 0, 0],
  193: [1, 1, 0, 0, 0, 0, 0, 1],
  204: [1, 1, 0, 0, 1, 1, 0, 0],
  218: [1, 1, 0, 1, 1, 0, 1, 0],
  225: [1, 1, 1, 0, 0, 0, 0, 1],
  232: [1, 1, 1, 0, 1, 0, 0, 0],
  236: [1, 1, 1, 0, 1, 1, 0, 0],
  238: [1, 1, 1, 0, 1, 1, 1, 0],
  240: [1, 1, 1, 1, 0, 0, 0, 0],
  250: [1, 1, 1, 1, 1, 0, 1, 0],
  254: [1, 1, 1, 1, 1, 1, 1, 0],
  255: [1, 1, 1, 1, 1, 1, 1, 1]
}

function fn(n) {
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

function show(rule) {
  var canvas = document.createElement("canvas")
  var config = {
    label: "Rule #" + rule,
    continues: 0,
    width: 400,
    height: 200
  }

  document.body.appendChild(canvas)
  return new Dish(canvas, fn(rule), config)
}

Object.keys(Rules).map(show)
