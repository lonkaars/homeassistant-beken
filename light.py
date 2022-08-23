import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from math import floor
from multiprocessing import Process
from homeassistant.const import CONF_MAC
from .driver import BekenConnection, makemsg, BEKEN_CHARACTERISTIC_LAMP
from homeassistant.components.light import (
  LightEntity,

  SUPPORT_BRIGHTNESS,
  SUPPORT_COLOR,
  SUPPORT_WHITE_VALUE,
  SUPPORT_TRANSITION,

  ATTR_BRIGHTNESS,
  ATTR_RGBW_COLOR,
  ATTR_TRANSITION,

  COLOR_MODE_RGBW,
  PLATFORM_SCHEMA
)
from time import sleep

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
    self._rgb = (255, 255, 255)
    self._w = 255
    self._connection = BekenConnection(self._address)
    self._connection.start_threads()
    self._process = Process()
    self._process.start()

  @property
  def color_mode(self):
    return COLOR_MODE_RGBW

  @property
  def supported_color_modes(self):
    return set([ COLOR_MODE_RGBW ])

  @property
  def supported_features(self):
    return SUPPORT_BRIGHTNESS | SUPPORT_COLOR | SUPPORT_WHITE_VALUE | SUPPORT_TRANSITION

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
    return self._rgb + (self._w,)

  def turn_on(self, **kwargs):
    on_old = self._on
    w_old = self._w
    brightness_old = self._brightness
    rgb_old = self._rgb

    self._on = True

    brightness = kwargs.get(ATTR_BRIGHTNESS)
    if brightness != None: self._brightness = brightness

    rgbw = kwargs.get(ATTR_RGBW_COLOR)
    if rgbw != None:
      self._rgb = rgbw[0:3]
      self._w = rgbw[3]

    transition = kwargs.get(ATTR_TRANSITION)
    if transition != None:
      self.interpolate(brightness_old if on_old else 0, self._brightness, rgb_old if on_old else (0, 0, 0,), self._rgb, w_old if on_old else 0, self._w, transition)

    self.update_beken_lamp()

  def turn_off(self, **kwargs):
    self._on = False
    self.update_beken_lamp()

  def interpolate(self, brightness_old, brightness, rgb_old, rgb, w_old, w, transition):
    self._process.terminate()
    self._process = Process(target=self.interpolate_process, args=(brightness_old, brightness, rgb_old, rgb, w_old, w, transition, ))
    self._process.start()

  def interpolate_process(self, brightness_old, brightness, rgb_old, rgb, w_old, w, transition):
    step_duration = 0.250
    steps = int(transition / step_duration)
    if rgb_old == None: rgb_old = (0, 0, 0,)
    if rgb == None: rgb = (0, 0, 0,)
    if brightness_old == None: brightness_old = 0
    if brightness == None: brightness = 0
    if w_old == None: w_old = 0
    if w == None: w = 0
    for x in range(steps):
        weight = x / steps
        r = rgb_old[0] * (1 - weight) + rgb[0] * weight
        g = rgb_old[1] * (1 - weight) + rgb[1] * weight
        b = rgb_old[2] * (1 - weight) + rgb[2] * weight
        self._rgb = (r, g, b,)
        self._w = w_old * (1 - weight) + w * weight
        self._brightness = brightness_old * (1 - weight) + brightness * weight
        self.update_beken_lamp()
        sleep(step_duration)

  def update_beken_lamp(self):
    r = int( int(self._on) * self._rgb[0] * ( self._brightness / 255 ) )
    g = int( int(self._on) * self._rgb[1] * ( self._brightness / 255 ) )
    b = int( int(self._on) * self._rgb[2] * ( self._brightness / 255 ) )
    l = int( int(self._on) * self._w      * ( self._brightness / 255 ) )
    self._connection.send(BEKEN_CHARACTERISTIC_LAMP, makemsg(r, g, b, l))

