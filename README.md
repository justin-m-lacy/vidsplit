Javascript Video Splitter

# Setup

* Install `node`

* install `pnpm`, `npm` or similar package manager.

* install `ffmpeg` video library
[https://ffmpeg.org/](https://ffmpeg.org/download.html)

# Develop

`pnpm dev`

# Compile

Run command:

`pnpm build`

# Run

In terminal:

`pnpm run`


# FAQ

* Why is the app so large?
	- The Electron binaries that allow program to be run as a standalone app are large.

* I can't save files when running `pnpm dev` dev mode.
	- This often occurs due to code editor (e.g. VSCode) privileges. Change program privileges, or use `pnpm run`, or run the built app.