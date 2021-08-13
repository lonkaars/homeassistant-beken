#!/bin/sh
rm -rf venv
python3 -m venv venv && venv/bin/pip3 install -r requirements.txt
sudo setcap 'cap_net_raw,cap_net_admin+eip' venv/lib/python3.9/site-packages/bluepy/bluepy-helper
