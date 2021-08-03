#!/bin/python3
from bluepy.btle import Peripheral, ADDR_TYPE_PUBLIC
import time
import colorsys
import sys

lampmac = sys.argv[1]

dev = Peripheral(lampmac, ADDR_TYPE_PUBLIC)

def makemsg(r, g, b, l=0):
  return bytes([
    int(g > 0), g,
    0x00, 0x00,
    int(b > 0), b,
    int(r > 0), r,
    int(l > 0), l,
  ])

for line in sys.stdin:
  r, g, b, l = [ int(x, 16) for x in [ line.strip()[i:i+2] for i in range(0, 8, 2) ] ]
  dev.writeCharacteristic(0x002A, makemsg(r, g, b, l))

