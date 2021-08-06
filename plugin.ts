import { AccessoryConfig, AccessoryPlugin, API, Logger, Service } from 'homebridge';

import Lamp from './lamp';
const Color = require('color');

export default class BekenBridge implements AccessoryPlugin {
	private lamp: Lamp;
	private infoService: Service;

	private whiteBulbService: Service;
	private RGBBulbService: Service;

	private state: {
		on: boolean;
		brightness: number;
		lamp: 'white' | 'rgb';
		saturation: number;
		hue: number;
	};

	public name: string;

	constructor(
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API,
	) {
		this.name = config.name;
		this.lamp = new Lamp(config.address, log);

		this.state = {
			on: false,
			brightness: 100,
			lamp: 'white',
			saturation: 0,
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
		var done = () => {
			if (this.state.lamp == 'rgb') {
				this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.On).setValue(false);
			}
			this.state.lamp = 'white';
			this.updateLamp();
		};
		this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(() => this.state.on && this.state.lamp == 'white')
			.onSet((on: boolean) => {
				this.state.on = on;
				done();
			});
		this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.Brightness)
			.onGet(() => this.state.brightness && this.state.lamp == 'white')
			.onSet((brt: number) => {
				this.state.brightness = brt;
				done();
			});
	}

	registerRGBBulbServices() {
		var done = () => {
			if (this.state.lamp == 'white') {
				this.whiteBulbService.getCharacteristic(this.api.hap.Characteristic.On).setValue(false);
			}
			this.state.lamp = 'rgb';
			this.updateLamp();
		};
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(() => this.state.on && this.state.lamp == 'rgb')
			.onSet((on: boolean) => {
				this.state.on = on;
				done();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Brightness)
			.onGet(() => this.state.brightness && this.state.lamp == 'rgb')
			.onSet((brt: number) => {
				this.state.brightness = brt;
				done();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Hue)
			.onGet(() => this.state.hue)
			.onSet((hue: number) => {
				this.state.hue = hue;
				done();
			});
		this.RGBBulbService.getCharacteristic(this.api.hap.Characteristic.Saturation)
			.onGet(() => this.state.saturation)
			.onSet((sat: number) => {
				this.state.saturation = sat;
				done();
			});
	}

	updateLamp() {
		if (!this.state.on) {
			this.lamp.color = [0, 0, 0, 0];
			return;
		}
		switch (this.state.lamp) {
			case 'rgb': {
				var rgb = Color({ h: this.state.hue, s: this.state.saturation, v: this.state.brightness });
				this.lamp.color = [rgb.red(), rgb.green(), rgb.blue(), 0];
				break;
			}
			case 'white': {
				var value = Math.floor(this.state.brightness / 100 * 255);
				this.lamp.color = [0, 0, 0, value];
				break;
			}
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
