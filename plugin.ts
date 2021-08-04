import {
	API,
	AccessoryPlugin,
	Logger,
	AccessoryConfig,
	Service

} from 'homebridge';

import Lamp, { LampColor } from './lamp';

export default class BekenBridge implements AccessoryPlugin {
	private lamp: Lamp;
	private bulbService: Service;
	private infoService: Service;

	public name: string;

	constructor(
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API,
	) {
		console.log("reached constructor"); //DEBUG
		// this.name = config.name;
		// this.lamp = new Lamp(config.address);

		// this.infoService = new this.api.hap.Service.AccessoryInformation()
		// 	.setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Beken")
		// 	.setCharacteristic(this.api.hap.Characteristic.Model, "Beken LED");

		// this.bulbService = new this.api.hap.Service.Lightbulb(this.name);
	}
  
	getServices() {
		console.log("getting services"); //DEBUG
		return [
			// this.infoService,
			// this.bulbService
		];
	}
}
