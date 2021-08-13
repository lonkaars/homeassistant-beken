# homeassistant-beken

this used to be a homebridge plugin, but i switched from using homebridge to
homeassistant because homeassistant has way more functionality. you can still
get the homebridge plugin from
[npm](https://www.npmjs.com/package/homebridge-beken) or by running `sudo npm i
-g homebridge-beken`, and the code for that plugin is in the releases section
on this repo, though i don't intend on updating it anymore.

> installation *should* work with hacs, though i just `git clone` it into my
> `custom_components` directory because homeassistant is already janky.

- a simple homeassistant plugin that allows the control of a bulb that goes by
	many names:
	- Shada Led's light
	- iLedBulb
	- Beken LED
- [here's](https://wiki.fhem.de/wiki/BEKEN_iLedBlub) the bluetooth protocol
	definition.
- sort of stable

