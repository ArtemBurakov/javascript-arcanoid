# javascript-arcanoid

Simple arcanoid game based on html, css and pure javascript.

# Dependencies

This game does not require any dependencies.

# Installation

Extract all files from downloaded folder. Run `index.html` file.

# Usage:
## Controls:

- start: `space`
- left: `←` - left arrow
- right: `→` - right arrow

## Levels:

- If you want more levels, you can easily add as many as you want. Follow this steps:
    - Open game folder, then open `levels` folder
    - Create new `.json` file, be careful, file names should go in order

- File syntax:
    - [{"top":142,"left":12,"visibility":true,"color":"red"}] - this is one block, you can add more by listing commas. All keys are needed!
        - `"visibility":true,"` means the block is visible
        - `"color":"red"` Instead of `"red"` you can use: `"blue"`, `"yellow"`, `"green"` colors


# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.