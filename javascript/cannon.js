'use strict'

const CANNON_MISSING = 0
const CANNON_BUILDING = 1
const CANNON_READY = 2
const CANNON_RELOADING = 3

class Cannon {
    constructor() {
        this.job = CANNON_MISSING
        this.progress = 0
    }
}
