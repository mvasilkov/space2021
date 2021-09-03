'use strict'


let stars = []
const STAR_POWER = 5

class Star {
    constructor() {
        this.power = STAR_POWER * Math.random()
        this.pos = new Vec2(
            GAME_CANVAS_WIDTH * Math.random(),
            GAME_CANVAS_HEIGHT * Math.random())
    }
}


function initStars() {
    for (let i = 0; i < 100; i++) {
        stars.push(new Star)
    }
}
initStars()

function paintBackground(con) {
    con.fillStyle = '#000'

    con.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT)
    const rndColor = () => Math.random() * (255 - 150) + 150

    for (let star of stars) {
        con.fillStyle = `rgb(${rndColor()}, ${rndColor()}, ${rndColor()})`
        con.fillRect(
            star.pos.x,
            star.pos.y,
            star.power,
            star.power
        )
    }
}
