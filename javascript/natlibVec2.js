/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2022.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
/** 2D vector class */
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    /** Set the components of this vector. */
    set(x, y) {
        this.x = x
        this.y = y
    }
    /** Copy the components of the other vector to this vector. */
    copy(other) {
        this.x = other.x
        this.y = other.y
    }
    /** Get the length of this vector. */
    length() {
        return (this.x ** 2 + this.y ** 2) ** 0.5
    }
    /** Add the other vector to this vector. */
    add(other) {
        this.x += other.x
        this.y += other.y
    }
    /** Subtract the other vector from this vector. */
    subtract(other) {
        this.x -= other.x
        this.y -= other.y
    }
    /** Set this vector to `a` − `b`. */
    setSubtract(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y
    }
    /** Multiply this vector by a scalar. */
    scale(n) {
        this.x *= n
        this.y *= n
    }
    /** Set this vector to a scalar multiple of the other vector. */
    setMultiplyScalar(other, n) {
        this.x = other.x * n
        this.y = other.y * n
    }
    /** Get the dot product of this vector and the other vector. */
    dot(other) {
        return this.x * other.x + this.y * other.y
    }
    /** Compute the squared distance from this vector to the other one. */
    distanceSquared(otherx, othery) {
        const x = this.x - otherx
        const y = this.y - othery
        return x * x + y * y
    }
}
