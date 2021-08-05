import { AccessoryConfig, AccessoryPlugin, API, Logger, Service } from 'homebridge';

import Lamp, { LampColor } from './lamp';
const Color = require('color');

export default class BekenBridge implements AccessoryPlugin {
	private lamp: Lamp;
	private infoService: Service;

	private whiteBulbService: Service;
	private RGBBulbService: Service;

	private whiteState: {
		brt: number;
		on: boolean;
	};

	private rgbState: {
		hue: number;
		sat: number;
		brt: number;
		on: boolean;
	};

	public name: string;

	constructor(
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API,
	) {
		this.name = config.name;
		this.lamp = new Lamp(config.address, log);

		this.whiteState = {
			on: false,
			brt: 0,
		};

		this.rgbState = {
			on: false,
			brt: 0,
			sat: 0,
			hue: 0,
		};

		this.infoService = new this.api.hap.Service.AccessoryInformation()
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Beken')
			.setCharacteristic(this.api.hap.Characteristic.Model, 'Beken LED');

		this.whiteBulbService = new this.api.hap.Service.Lightbulb('White', 'normal');
		this.RGBBulbService = new this.api.hap.Service.Lightbulb('RGB', 'rgb');

		this.registerWhiteBulbServices();
		this.registerRGBBulbServices();
	}

	registerWhiteBulbServices() {
		this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(() => this.whiteState.on)
			.onSet((on: boolean) => {
				this.whiteState.on = on;
				if (this.rgbState.on) {
					this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.On).setValue(false);
				}
				this.updateLamp();
			});
		this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.Brightness)
			.onGet(() => this.whiteState.brt)
			.onSet((brt: number) => {
				this.whiteState.brt = brt;
				this.updateLamp();
			});
	}

	registerRGBBulbServices() {
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(() => this.rgbState.on)
			.onSet((on: boolean) => {
				this.rgbState.on = on;
				if (this.whiteState.on) {
					this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.On).setValue(false);
				}
				this.updateLamp();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Brightness)
			.onGet(() => this.rgbState.brt)
			.onSet((brt: number) => {
				this.rgbState.brt = brt;
				this.updateLamp();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Hue)
			.onGet(() => this.rgbState.hue)
			.onSet((hue: number) => {
				this.rgbState.hue = hue;
				this.updateLamp();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Saturation)
			.onGet(() => this.rgbState.sat)
			.onSet((sat: number) => {
				this.rgbState.sat = sat;
				this.updateLamp();
			});
	}

	updateLamp() {
		if (this.rgbState.on) {
			var rgb = Color({ h: this.rgbState.hue, s: this.rgbState.sat, v: this.rgbState.brt });
			this.lamp.color = [rgb.red(), rgb.green(), rgb.blue(), 0];
		} else if (this.whiteState.on) {
			var value = Math.floor(this.whiteState.brt / 100 * 255);
			this.lamp.color = [0, 0, 0, value];
		} else {
			this.lamp.color = [0, 0, 0, 0];
		}
	}

	getServices() {
		return [
			this.infoService,
			this.whiteBulbService,
			this.RGBBulbService,
		];
	}
}
