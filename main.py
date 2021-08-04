#!/bin/python3
from bluepy.btle import Peripheral, ADDR_TYPE_PUBLIC, BTLEDisconnectError
import threading
import time
import colorsys
import sys

mac = sys.argv[1]
dev = None
messages = []

def verify_connection():
  global dev
  while dev == None or dev.getState() == 'disc':
    try:
      dev = Peripheral(mac, ADDR_TYPE_PUBLIC)
    except BTLEDisconnectError as e:
      continue

def makemsg(r, g, b, l=0):
  return bytes([
    int(g > 0), g,
    0x00, 0x00,
    int(b > 0), b,
    int(r > 0), r,
    int(l > 0), l,
  ])

def keep_alive():
  while True:
    global messages
    messages.append((0x0001, bytes(10)))
    time.sleep(10)

def user_input():
  for line in sys.stdin:
    r, g, b, l = [ int(x, 16) for x in [ line.strip()[i:i+2] for i in range(0, 8, 2) ] ]
    messages.append((0x002a, makemsg(r, g, b, l)))

threading.Thread(target=keep_alive).start()
threading.Thread(target=user_input).start()

verify_connection()
while True:
  if len(messages) < 1: continue
  message = messages.pop(0)
  verify_connection()
  dev.writeCharacteristic(message[0], bytearray(message[1]))

