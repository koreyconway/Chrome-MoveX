# MoveX
Horizontal scrolling using a standard mouse

# Get Started
Install in chrome as an extension

# How to use
    - Hold down left-click button
    - Scroll with wheel

## Notes
    - wanted to use right-click (not left)
        - but chrome puts the context menu on mousedown of right-click
        , the right click event does not even fire
        , a contextmenu event fires instead
        , and firing a custom context menu event does not actually open the context menu
        , so to use right-click, the context menu would need to be replaced
        - workarounds may be possible
            - eg. allow a setting for the user to choose to override the context-menu
            - create an OS level app
    - shift+wheel does horizontal scrolling (works with Chrome, perhaps others too)

## Todo
    - make work in google sheets
    - don't select text when right click is used
    - make work (with right click) inside embedded codemirror https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    - don't fire link click when scroll starts and ends on the link
    - make cursor be normal icon when tiggerButton is held down
    - make work with iframes (currently the right-click is not captured... maybe more issues too)
    - disable dragging when triggerButton is held down

## Possible Future Features
    - trigger+middle click to cycle through tabs with MRU

## Features
    - dynamic horizontal step that is based on the wheel Y delta with configurable factor
    - can configure to work with right-click at the expense of blocking the contextMenu
    - works in gmail
    - works in google docs (but not sheets)
    - improved performance with caching element being scrolled
 