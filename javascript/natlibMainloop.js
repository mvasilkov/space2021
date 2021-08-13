/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2022.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
/** A fixed-step loop. */
const startMainloop = (function () {
    // Update receives `T` seconds.
    let update
    // Render receives `t` (0..1) for lerp.
    let render
    /** Run the physics at 50 FPS, independent of rendering. */
    const T = 0.02
    let then = -1
    let t = 0
    /** A fixed-step loop. */
    function loop(now) {
        requestAnimationFrame(loop)
        if (then === -1) {
            then = now
        }
        t += (now - then) * 0.001
        then = now
        // Late updates are capped.
        let nUpdates = 2
        while (t > 0) {
            t -= T
            if (nUpdates > 0) {
                update(T)
                --nUpdates
            }
        }
        render(t / T + 1)
    }
    /** Start the loop. */
    function startMainloop(updateFun, renderFun) {
        update = updateFun
        render = renderFun
        requestAnimationFrame(loop)
    }
    return startMainloop
})()
