#!/bin/python3
from bluepy.btle import Peripheral, ADDR_TYPE_PUBLIC, BTLEDisconnectError
import threading
import time
import colorsys
import sys

mac = sys.argv[1]
dev = None

def verify_connection():
  global dev
  while dev == None or dev.getState() == 'disc':
    try:
      dev = Peripheral(mac, ADDR_TYPE_PUBLIC)
    except BTLEDisconnectError as e:
      continue

verify_connection()
print("connected")

def makemsg(r, g, b, l=0):
  return bytes([
    int(g > 0), g,
    0x00, 0x00,
    int(b > 0), b,
    int(r > 0), r,
    int(l > 0), l,
  ])

messages = []
def thread_func():
  while True:
    if len(messages) < 1: continue
    message = messages.pop(0)
    verify_connection()
    dev.writeCharacteristic(0x002A, message)

threading.Thread(target=thread_func).start()

for line in sys.stdin:
  r, g, b, l = [ int(x, 16) for x in [ line.strip()[i:i+2] for i in range(0, 8, 2) ] ]
  messages.append(makemsg(r, g, b, l))

