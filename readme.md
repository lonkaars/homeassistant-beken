# homebridge-beken

> NOTE: requires python3
>
> This plugin uses child_process to spawn a python script that does the actual
> communication with the bulb using the bluepy library. Bluepy uses a binary
> called bluepy-helper which should be run as root or given permission to
> directly talk to the bluetooth stack.

- a simple homebridge plugin that allows the control of a bulb that goes by
	many names:
	- Shada Led's light
	- iLedBulb
	- Beken LED
- [here's](https://wiki.fhem.de/wiki/BEKEN_iLedBlub) the bluetooth protocol
	definition.
- sort of stable

