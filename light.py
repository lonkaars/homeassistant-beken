from homeassistant.components.light import LightEntity, ATTR_BRIGHTNESS, ATTR_COLOR_MODE
from driver import BekenConnection, makemsg

class BekenLight(LightEntity):
  def __init__(self):
    self._state = {
      "on": False,
      "brightness": 100,
      "lamp": "white",
      "saturation": 0,
      "hue": 0,
    }

  @property
  def name(self):
    return "Beken LED"

  @property
  def is_on(self):
    return self._state['on']

  def turn_on(self, **kwargs):
    self._state['on'] = True

  def turn_off(self, **kwargs):
    self._state['on'] = False
