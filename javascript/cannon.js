'use strict'

const CANNON_MISSING = 0
const CANNON_BUILDING = 1
const CANNON_UPGRADING = 2
const CANNON_READY = 3
const CANNON_RELOADING = 4
const CANNON_RECYCLING = 5

class Cannon {
    constructor() {
        this.job = CANNON_MISSING
        this.progress = 0
    }
}
