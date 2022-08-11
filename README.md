# Bitburner-Stuff
A variety of scripts I've made for the game Bitburner, free to copy/use/adapt! 
(You probably won't find much/any use for this repo if you're not playing Bitburner, just FYI.)

I recently got sucked into playing Bitburner, and wanted to share some scripts made for it so that others can use and/or learn from them. Here's what's up here so far: 

**IN DEVELOPMENT: Target phase management system - (phase1.js, phase2.js, phase3.js, 1xgrow.js, 1xhack.js, 1xweaken.js)**
A simply complex management system for destroying your foes! I mean, hacking them repeatedly for optimum gains! This system takes a single target through three phases: (1) weakening the server to its minimum security level, (2) growing the funds available on that server to the server's maximum capacity while returning the server to minimum security level, and (3) calculating consecutive hack/weaken and grow/weaken cycles to hack and regrow 15% of its capacity as efficiently as possible. 

**gr0k.js**
A simple, static script that prints information about a server to a terminal. Includes current/max money, current max security levels, root access information and if you can/cannot hack it at the present, and hack/grow/weaken process times.

**grail.js**
Similar to gr0k.js, this one opens a tail (script log) window with a formatted screen with basically the same information as gr0k.js does, but it's updated dynamically so the information is up-to-the-second accurate. Great for use if you're trying to gauge the effectiveness of your main H/G/W algorithms and scripts against a server. It also auto-spawns and respawns the tail window, so you don't end up with a bunch of them running in the background on accident.

**serverbot.script**
A silly "AI" bot script for purchasing personal servers in bulk. Does not include the actual purchase script, just the setup for it. If that makes sense. Also good for if you're looking for examples of the ns.prompt() function in-game. 

**srvlist.js**
This just outputs a list of purchased servers to the terminal, useful if you're like me and forget how many you've bought or what you named them. 

Enjoy!
-e
