# Keller Library

A library that transforms every website to its accessible version just with inclusion of several HTML attributes. Supports navigation by voice, keyboard and gamepad. Content on the website can be delivered by the speech generator feature.

## Installation

	$ npm install

## Usage

Run `$ grunt --serve` and open `http://localhost:9000/demo/index.hmtl` in the browser

## Build

	$ grunt

| Option       | Description                                                          |
|--------------|----------------------------------------------------------------------|
| `watch`      | Starts a live server and watches all assets (default port 9000).     |
| `lint`       | Runs code checks on JS files.                                        |
| `build`      | Minifies all the assets.                                             |

## Navigation options

Currently developed navigation options:
* mouse click
* keyboard event
* gamepad event
* voice commands

## Browser support

Chrome 33+, Firefox 44+, IE 9+, Safari 5.1+