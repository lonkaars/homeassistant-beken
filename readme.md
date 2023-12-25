# homeassistant-beken

- a simple homeassistant plugin that allows the control of a bulb that goes by
	many names:
	- Shada Led's light
	- iLedBulb
	- Beken LED
- [here's](https://wiki.fhem.de/wiki/BEKEN_iLedBlub) the bluetooth protocol
	definition.
- sort of stable

## configuration

1. Pair the lamp using `bluetoothctl` (or similar) on the device running
   homeassistant
2. Add to configuration.yaml (address is the bluetooth mac address which is
   shown in `bluetoothctl`):
   ```yaml
   light:
     - platform: beken
       name: "human readable name"
       address: "XX:XX:XX:XX:XX:XX"
   ```

> The following command was in a separate file, I don't remember if it was a
> temporary fix or is still required: `sudo setcap
> 'cap_net_raw,cap_net_admin+eip'
> venv/lib/python..../site-packages/bluepy/bluepy-helper`
