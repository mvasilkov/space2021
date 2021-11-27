Hey hey people,

Mark Vasilkov here. I'm a security enthusiast from Israel.

It's mvasilkov on GitHub, and Twitter, and GMail,

and I'm working for this magnificent little company, Noname Security.

Defensive cyber security for protecting APIs.

---

The game I want to talk about today, First Contact, was written for the JS 13K compo.

It's a simple clicker game, and the usual staples of the genre are present, it's

instant gratification, the game practically plays itself, and it's not skill based.

What I attempted to do with it was, add a little story, some of the things just happen

and you have no control over them, there are two different endings based on the subtle

player choice, this sort of thing.

---

Now, for the source code, the thing I'm sufficiently happy with is how it's coded

to the browser's JavaScript engine. The idea is to avoid problems during

the high-level design, so that we don't need super clever optimizations later.

I'll give two small examples:

1. In JavaScript, garbage collector can unpredictably pause the execution of

your program and do its thing, to free memory. And on a 60 FPS monitor,

you have 16.6 milliseconds to render each frame, meaning that garbage collector

can drop frames and make the game stutter. And one workaround for that is to just allocate

everything you need ahead of time.

For example, in the First Contact game, there are all these objects,

there are orbital platforms, and cannons, and projectiles, and of course the invaders,

and every object is a very small state machine with a small number of states. A cannon can be

either ready to fire, or it can be reloading.

What helps with garbage collector is that all objects have an additional state,

which is called MISSING, and so when we fire a rocked we do not allocate a new object,

like `new Rocket()`, we instead pre-allocate all of the rockets at the start of the game,

set them to MISSING, and when we need to fire, we find the first one that's missing, and use that.

When the rocket hits, it reverts back to the MISSING state.

Zero allocations, garbage collector is happy with us.

2. The second thing is also very small, and it's related to the fact that all drawing in this game

is done on HTML canvas. And canvas has great performance, but when you need to render possibly

thousands of objects in every frame, at 60 frames per second, the rendering costs add up.

The trick is very simple, let's say we have these space invaders. Drawing one invader is simple,

we make a bunch of `lineTo()` calls, and then we call `stroke()` for an outline, or `fill()`,

you're all familiar with that.

Now, what about drawing a thousand of these. It turns out that one way to optimize

mass rendering is to first, make all of the `lineTo()` calls for all the invaders,

so that all of them are one huge noncontinuous path, and then we call `fill()` or `stroke()`

just once. The browser's canvas implementation, which is actually high performance C++ code,

works best if we give it a lot of stuff to rasterize at once.

The anti-pattern here would be calling `stroke()` for each line segment separately,

as this is known to kill performance.

---

So that's all from me. Come participate in JS 13K competition next year!

