placekitten
===========

Simple CLI node utility that downloads files from [placekitten.com](http://placekitten.com).

Installation
------------

Installing is quite simple

```
npm install -g placekitten
```

Usage
-----

Placekitten is pretty easy to use.

```
placekitten [-d path/to/download/folder] width[/height] [...]
```

Here are some concrete usage examples

```bash
placekitten 200/100 # Download a 200x100 image
placekitten 100/300 200 # Download a 100x300 image and a 200x200 image
placekitten -d kittens 800/600 # Download a 800x600 image into the kittens folder
```

In order for the -d (a.k.a. --directory) flag to work, the folder must already exist.
Otherwise placekitten will just return an error.