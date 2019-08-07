'use strict';

(function () {
    let settings = {
        // Horizontal move step
        horizontalStepFactor: 15,

        // Defines the button that must be pressed to active the horizontal scroll
        // Options are: left, right, middle
        // Note: using right button will override context menu (this is a browser limitation)
        // Note: using middle click is too buggy (it will inevitably scroll vertically a bit too)
        useRightButton: false,
        cacheTimeMs: 500
    }

    // Constants defined by web standards
    const LEFT_BUTTON = 1
    const RIGHT_BUTTON = 2
    const MIDDLE_BUTTON = 4

    // Bitwise variable used to check if buttonToUse was pressed
    // Initialized in "init", stored here for module global access
    let triggerButton

    // Flag to see if we are currently listening for wheel events
    let listeningToWheel = false

    // Use for caching to improve performance
    let previousElementScrolled
    let previousScrollTime = 0

    // Entry point
    function start() {
        // Set buttons value
        triggerButton = (settings.useRightButton) ? RIGHT_BUTTON : LEFT_BUTTON

        // Disable context menu to allow using right click
        if (settings.useRightButton) {
            document.addEventListener('contextmenu', function (event) {
                event.preventDefault()
            }, { passive: false })
        }

        // Turn on wheel event listener when enabling mouse button is pushed
        document.addEventListener('mousedown', function (event) {
            if (isTriggerEvent(event)) {
                listenToWheel()
            }
        })
    }

    function isTriggerEvent(event) {
        return Boolean(event.buttons & triggerButton)
    }

    function listenToWheel() {
        if (!listeningToWheel) {
            document.addEventListener('wheel', onWheel, { passive: false })
            document.addEventListener('mouseup', onMouseUp)
            listeningToWheel = true
        }
    }

    function unlistenToWheel() {
        document.removeEventListener('wheel', onWheel)
        document.removeEventListener('mouseup', onMouseUp)
        listeningToWheel = false
    }

    function onMouseUp(event) {
        if (isTriggerEvent(event)) {
            unlistenToWheel()
        }
    }

    function onWheel(event) {
        // Check that mouse button is pressed
        if (event.buttons & triggerButton) {
            // Prevent wheel event from default behaviour
            event.preventDefault()
            // event.preventImmediateDefault()
            // event.stopImmediatePropagation()

            // Get the element to scroll
            let element = getElementToScroll(event)

            // Convert vertical delta into an horizontal step
            let step = -event.wheelDeltaY / 120 * settings.horizontalStepFactor

            // Scroll the element horizontally
            element.scrollBy(step, 0)
        }
    }

    function getElementToScroll(event) {
        let now = Date.now()
        let timeDiff = now - previousScrollTime

        if (timeDiff < settings.cacheTimeMs) {
            // console.log('using cache')
            return previousElementScrolled
        } else {
            // Cache expired, check again and update cache
            // console.log('cache expired')
            previousScrollTime = now
            previousElementScrolled = getFirstScrollableElementFromEvent(event)
            return previousElementScrolled
        }
    }

    function getFirstScrollableElementFromEvent(event) {
        function isScrollableElement(element) {
            if (!element.style || element === document.body) {
                // This filters out roots (body/html/document/window)
                // We will return the window anyways as default
                return false
            }

            let style = getComputedStyle(element)
            return (style.overflowX === "scroll" || style.overflowX === "auto")
        }

        function canScrollRight(element, direction) {
            return (
                direction > 0
                && (element.scrollLeft + element.offsetWidth) < element.scrollWidth
            )
        }

        function canScrollLeft(element, direction) {
            return (direction < 0 && element.scrollLeft > 0)
        }

        for (const e of event.path) {
            if (
                isScrollableElement(e)
                && (canScrollRight(e, event.deltaY)
                    || canScrollLeft(e, event.deltaY))
            ) {
                return e
            }
        }

        // Default to the window
        return window
    }

    start()

})()
