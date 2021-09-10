'use strict'

const TOTAL_STARS = 150
const STAR_POWER = 5
const STAR_LOWEST_RGB = 200

const rndColor = () => Math.random() * (255 - STAR_LOWEST_RGB) + STAR_LOWEST_RGB

class Star {
    constructor() {
        this.color = `rgb(${rndColor()},${rndColor()},${rndColor()})`
        this.power = STAR_POWER * Math.random()
        this.pos = new Vec2(
            GAME_CANVAS_WIDTH * Math.random(),
            GAME_CANVAS_HEIGHT * Math.random())
    }
}

function paintBackground(con, stars) {
    con.fillStyle = PAL_BLACK
    con.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT)

    for (let star of stars) {
        con.fillStyle = star.color
        con.fillRect(star.pos.x, star.pos.y, star.power, star.power)
    }
}

function paintBackgroundMask(con, planetSize) {
    con.beginPath()
    con.arc(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_HEIGHT, planetSize + 20, 0, MATH_2PI)
    con.closePath()

    con.fillStyle = PAL_BLACK
    con.fill()
}
