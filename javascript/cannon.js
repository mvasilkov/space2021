'use strict'

const CANNON_MISSING = 0
const CANNON_READY = 1
const CANNON_RELOADING = 2

// Rendering constants
const CANNON_BASE_SIZE = 10
const CANNON_BARREL_LENGTH = 25

class Cannon {
    constructor(pl, n) {
        this.pl = pl
        this.n = n
        // Used for rendering
        this.x = 0
        this.y = 0

        this._changeJob(CANNON_MISSING)
    }

    _changeJob(job) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
    }

    attack(rocket, target) {
        this.pl.updateCannonsRelativeToRotation(nop)

        rocket.initialize(this, target)

        this._changeJob(CANNON_RELOADING)
    }

    render(con) {
        con.save()

        con.translate(this.x, this.y)
        con.rotate(Math.atan2(this.y, this.x))

        con.moveTo(0, CANNON_BASE_SIZE)
        con.arc(0, 0, CANNON_BASE_SIZE, 0.5 * Math.PI, 1.5 * Math.PI)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * -CANNON_BASE_SIZE)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * CANNON_BASE_SIZE)
        con.closePath()

        con.restore()
    }

    render2(con, t) {
        const effectiveLength = t * (CANNON_BASE_SIZE + CANNON_BARREL_LENGTH)
        const x = effectiveLength - CANNON_BASE_SIZE

        con.save()

        con.translate(this.x, this.y)
        con.rotate(Math.atan2(this.y, this.x))

        if (effectiveLength <= CANNON_BASE_SIZE) {
            const a = Math.acos(x / CANNON_BASE_SIZE) // can replace with t
            const y = CANNON_BASE_SIZE * Math.sin(a)

            con.moveTo(x, y)
            con.arc(0, 0, CANNON_BASE_SIZE, a, MATH_2PI - a)
        }
        else {
            t = x / CANNON_BARREL_LENGTH
            const y = lerp(1, 0.6, t) * CANNON_BASE_SIZE

            con.moveTo(0, CANNON_BASE_SIZE)
            con.arc(0, 0, CANNON_BASE_SIZE, 0.5 * Math.PI, 1.5 * Math.PI)
            con.lineTo(x, -y)
            con.lineTo(x, y)
        }

        con.closePath()

        con.restore()
    }
}

function updateCannons(cannons) {
    let countReady = 0

    for (let n = 0; n < TOTAL_CANNONS; ++n) {
        const can = cannons[n]

        if (can.job === CANNON_READY) ++countReady
        else if (can.job === CANNON_RELOADING) {
            can.lastProgress = can.progress

            if (can.progress >= state.reloadTime) {
                can._changeJob(CANNON_READY)
                ++countReady
            }
            else {
                ++can.progress
            }
        }
    }

    // Auto-fire
    if (state.afEnabled && state.phase !== GAME_BAD_END) {
        if (state.afProgress >= state.afTicks) {
            // Don't reset progress if we could not fire
            if ((countReady = actions.attack() - 1) !== -1)
                state.afProgress = 1
        }
        else {
            ++state.afProgress
        }
    }

    actionSetEnabled('attack', countReady > 0 && state.phase !== GAME_BAD_END)
}

const cannonsReady = Array(TOTAL_CANNONS)
const cannonsReloading = Array(TOTAL_CANNONS)

function renderCannons(defenses, con, t) {
    let countReady = 0
    let countReloading = 0

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_UPGRADING || pl.job === PLATFORM_READY) {
            pl.updateCannonsRelativeToRotation(can => {
                if (can.job === CANNON_READY) cannonsReady[countReady++] = can
                else cannonsReloading[countReloading++] = can // can.job === CANNON_RELOADING
            })
        }
    }

    // Paint ready

    con.beginPath()

    for (let n = 0; n < countReady; ++n) {
        cannonsReady[n].render(con)
    }

    con.fillStyle = PAL_78FAE6
    con.fill()

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_78FAE6
    con.stroke()

    // Reloading background

    con.beginPath()

    for (let n = 0; n < countReloading; ++n) {
        const can = cannonsReloading[n]

        can.render(con)
    }

    con.fillStyle = PAL_BLACK
    con.fill()

    // Reloading progress

    con.beginPath()

    for (let n = 0; n < countReloading; ++n) {
        const can = cannonsReloading[n]

        can.render2(con, lerp(can.lastProgress, can.progress, t) / state.reloadTime)
    }

    con.lineWidth = 4
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.fillStyle = PAL_FFE091
    con.fill()

    // Reloading hulls

    con.beginPath()

    for (let n = 0; n < countReloading; ++n) {
        const can = cannonsReloading[n]

        can.render(con)
    }

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_78FAE6
    con.stroke()

    con.restore() // saved in renderDefenses
}
