from bluepy.btle import Peripheral, ADDR_TYPE_PUBLIC
import time
import colorsys
import json

lampmac = "FC:58:FA:A1:CF:F1"

dev = Peripheral(lampmac, ADDR_TYPE_PUBLIC)

def makemsg(r, g, b, l=0):
  return bytearray((b"\x01" if g > 0 else b"\x00") + bytes([g]) +\
  b"\x00\x00" +\
  (b"\x01" if b > 0 else b"\x00") + bytes([b]) +\
  (b"\x01" if r > 0 else b"\x00") + bytes([r]) +\
  (b"\x01" if l > 0 else b"\x00") + bytes([l]))

hue = 0
while True:
  hue = (hue + 1) % 360
  r, g, b = map(lambda x: int(x * 255), colorsys.hsv_to_rgb(hue / 360, 1, 1))

  color = makemsg(r, g, b)
  dev.writeCharacteristic(0x002A, color)
