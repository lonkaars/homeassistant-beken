#!/bin/python3
from bluepy.btle import Peripheral, ADDR_TYPE_PUBLIC, BTLEDisconnectError
import threading
import time
import sys

def makemsg(r, g, b, l=0):
  return bytes([
    int(g > 0), g,
    0x00, 0x00,
    int(b > 0), b,
    int(r > 0), r,
    int(l > 0), l,
  ])

class BekenConnection:
  def __init__(self, mac):
    self.mac = mac
    self.dev = None
    self.messages = []

  def keep_alive(self):
    while True:
      self.send(0x0001, bytes(10))
      time.sleep(10)

  def send(self, characteristic, message):
    self.messages.append((characteristic, message))

  def verify_connection(self):
    while self.dev == None or self.dev.getState() == 'disc':
      try:
        self.dev = Peripheral(self.mac, ADDR_TYPE_PUBLIC)
      except BTLEDisconnectError as e:
        continue

  def message_handler(self):
    self.verify_connection()
    while True:
      if len(self.messages) < 1: continue
      message = self.messages.pop(0)
      self.verify_connection()
      self.dev.writeCharacteristic(message[0], bytearray(message[1]))

  def start_threads(self):
    threading.Thread(target=self.message_handler).start()
    threading.Thread(target=self.keep_alive).start()

if __name__ == "__main__":
  mac = sys.argv[1]
  con = BekenConnection(mac)
  con.start_threads()
  def user_input():
    for line in sys.stdin:
      r, g, b, l = [ int(x, 16) for x in [ line.strip()[i:i+2] for i in range(0, 8, 2) ] ]
      con.send(0x002a, makemsg(r, g, b, l))
  threading.Thread(target=user_input).start()

