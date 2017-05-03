from __javascript__ import jQuery, window, setInterval
import time

class CanvasDraw(object):
    # The constructor gets the id of the canvas element that should be created
    def __init__(self, canvas_id):
        # Add a canvas element to the content div
        jQuery('#content').html('<canvas id="%s" />' % canvas_id)
        element = jQuery('#' + canvas_id)

        # Get position of the canvas element within the browser window
        offset = element.offset()
        self.x_offset = offset.left
        self.y_offset = offset.top

        # Get the real DOM element from the jQuery object
        self.canvas = element.get(0)

        # Set the width and height based on window size and canvas position
        self.canvas.width = window.innerWidth - self.x_offset
        self.canvas.height = window.innerHeight - self.y_offset

        # Load the drawing context and initialize a few drawing settings
        self.context = self.canvas.getContext('2d')
        self.context.lineWidth = 8
        self.context.lineCap = 'round'
        self.context.lineJoin = 'miter'

        # This variable is used for tracking mouse/finger movement
        self.path = []

        # Add asynchronous timer for drawing
        setInterval(self.pulse, 25)

        # Register mouse and touch events
        element.bind('mouseup', self.mouse_up).bind(
                     'mousedown', self.mouse_down).bind(
                     'mousemove', self.mouse_move).bind(
                     'touchstart touchmove', self.touch_start_or_move).bind(
                     'touchend', self.touch_end)

    def mouse_down(self, event):
        self.path.insert(0, [event.pageX, event.pageY])

    def mouse_up(self, event):
        self.path.insert(0, [event.pageX, event.pageY])
        # Terminate path
        self.path.insert(0, None)

    def mouse_move(self, event):
        # Check if we're currently tracking the mouse
        if self.path and self.path[0] is not None:
            self.path.insert(0, [event.pageX, event.pageY])

    def touch_start_or_move(self, event):
        # Prevent the page from being scrolled on touchmove. In case of
        # touchstart this prevents the canvas element from getting highlighted
        # when keeping the finger on the screen without moving it.
        event.preventDefault()

        # jQuery's Event class doesn't provide access to the touches, so
        # we use originalEvent to get the original JS event object.
        touches = event.originalEvent.touches
        self.path.insert(0, [touches.item(0).pageX, touches.item(0).pageY])

    def touch_end(self, event):
        # On iOS "touches" doesn't contain fingers that leave the screen,
        # so we use "changedTouches" instead.
        touches = event.originalEvent.changedTouches
        self.path.insert(0, [touches.item(0).pageX, touches.item(0).pageY])

        # Terminate path
        self.path.insert(0, None)

    def pulse(self, *args):
        if len(self.path) < 2:
            return
        start_time = time.time()
        self.context.beginPath()
        # Don't draw for more than 10ms in order to increase the number of
        # captured mouse/touch movement events.
        while len(self.path) > 1 and time.time() - start_time < 0.01:
            start = self.path.pop()
            end = self.path[-1]
            if end is None:
                # This path ends here. The next path will begin at a new
                # starting point.
                self.path.pop()
            else:
                self.draw_line(start, end)
        self.context.stroke()

    def draw_line(self, start, end):
        # Convert window coordinates to canvas coordinates and draw the line
        self.context.moveTo(start[0] - self.x_offset, start[1] - self.y_offset)
        self.context.lineTo(end[0] - self.x_offset, end[1] - self.y_offset)

canvas = CanvasDraw('sketch-canvas')

# Prevent scrolling and highlighting
def disable_scrolling(event):
    event.preventDefault()
jQuery('body').bind('touchstart touchmove', disable_scrolling)
