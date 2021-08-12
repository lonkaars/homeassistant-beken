import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.const import CONF_MAC
from .driver import BekenConnection, makemsg
from homeassistant.components.light import (
  LightEntity,

  SUPPORT_BRIGHTNESS,
  SUPPORT_COLOR,
  SUPPORT_WHITE_VALUE,

  ATTR_BRIGHTNESS,
  ATTR_RGBW_COLOR,

  COLOR_MODE_RGBW,
  PLATFORM_SCHEMA
)

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
  vol.Required("name"): cv.string,
  vol.Required("address"): cv.string
})

SUPPORT_FEATURES_RGB = SUPPORT_BRIGHTNESS | SUPPORT_COLOR
SUPPORT_FEATURES_WHITE = SUPPORT_BRIGHTNESS

def setup_platform(hass, config, add_entities, discovery_info=None):
  add_entities([ BekenLight(name=config["name"], address=config["address"]) ])

class BekenLight(LightEntity):
  def __init__(self, **kwargs):
    self._name = kwargs["name"]
    self._address = kwargs["address"]
    self._on = False
    self._brightness = 255
    self._rgbw = (255, 255, 255, 255) # r, g, b, w

  @property
  def color_mode(self):
    return COLOR_MODE_RGBW

  @property
  def supported_color_modes(self):
    return set([ COLOR_MODE_RGBW ])

  @property
  def supported_features(self):
    return SUPPORT_BRIGHTNESS | SUPPORT_COLOR | SUPPORT_WHITE_VALUE

  @property
  def unique_id(self):
    return self._address

  @property
  def name(self):
    return self._name

  @property
  def is_on(self):
    return self._on

  @property
  def brightness(self):
    return self._brightness

  @property
  def rgbw_color(self):
    return self._rgbw

  def turn_on(self, **kwargs):
    self._on = True
    self._brightness = kwargs.get(ATTR_BRIGHTNESS)
    self._rgbw = kwargs.get(ATTR_RGBW_COLOR)

  def turn_off(self, **kwargs):
    self._on = False
