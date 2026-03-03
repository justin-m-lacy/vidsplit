Javascript Video Splitter

# Setup

* Install `node`

* install `pnpm`, `npm` or similar package manager.

* install `ffmpeg` video library
[https://ffmpeg.org/](https://ffmpeg.org/download.html)

# Develop Front-end

`pnpm dev`

# Compile

Run in terminal:

`pnpm build`

# Run Built Application

In terminal:

`pnpm run run`

# Package Application

`pnpm app:dist`

# Package into Directory:

`pnpm app:dir`

You can view contents of .asar file by running:

`npx asar list [path]/app.asar`


# FAQ

* Why is the app so large?
	- The Electron binaries that allow program to be run as a standalone app are large.
	- FFMPeg can be installed separately but can be up to 100MB.

* Avi file won't play
	- Although ffmpeg supports .avi files, Chrome does not support avi files natively.

* I can't save files when running `pnpm dev` dev mode.
	- This often occurs due to code editor (e.g. VSCode) privileges. Change program privileges, or use `pnpm run`, or run the built app.