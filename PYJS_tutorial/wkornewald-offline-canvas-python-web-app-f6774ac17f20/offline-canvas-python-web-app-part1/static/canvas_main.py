# Import jQuery. Note: JavaScript variables have to be
# imported from the fake __javascript__ module.
from __javascript__ import jQuery

# Create a simple widget class
class ClickWidget(object):
    def __init__(self, base_elem):
        # Add some initial HTML code
        base = jQuery(base_elem)
        base.html('<div class="clickme">Click me!</div>'
                  '<div class="change">Then this will change.</div>')
        self.output_div = jQuery('.change', base)

        # Bind the click event to the on_click method
        jQuery('.clickme', base).bind('click', self.on_click)

    # This is our click event handler
    def on_click(self, event):
        self.output_div.append(' It clicked!')

# Install our widget
widget = ClickWidget('body')
