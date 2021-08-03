import {
	API,
	Characteristic,
	DynamicPlatformPlugin,
	Logger,
	PlatformAccessory,
	PlatformConfig,
	Service,
} from 'homebridge';

export default class BekenBridge implements DynamicPlatformPlugin {
	public readonly Service: typeof Service = this.api.hap.Service;
	public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

	public readonly accessories: PlatformAccessory[] = [];

	constructor(
		public readonly log: Logger,
		public readonly config: PlatformConfig,
		public readonly api: API,
	) {
		this.log.debug('Loaded BekenBridge');

		this.api.on('didFinishLaunching', () => {
			log.debug('Executed didFinishLaunching callback');
			this.discoverDevices();
		});
	}

	configureAccessory(accessory: PlatformAccessory) {
		this.log.info('Loading accessory from cache:', accessory.displayName);

		this.accessories.push(accessory);
	}

	discoverDevices() {
		this.log.info('gert');
		// const exampleDevices = [
		// 	{
		// 		exampleUniqueId: 'ABCD',
		// 		exampleDisplayName: 'Bedroom',
		// 	},
		// 	{
		// 		exampleUniqueId: 'EFGH',
		// 		exampleDisplayName: 'Kitchen',
		// 	},
		// ];

		// for (const device of exampleDevices) {

		// 	const uuid = this.api.hap.uuid.generate(device.exampleUniqueId);

		// 	const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

		// 	if (existingAccessory) {
		// 		this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

		// 		new ExamplePlatformAccessory(this, existingAccessory);

		// 	} else {
		// 		this.log.info('Adding new accessory:', device.exampleDisplayName);

		// 		const accessory = new this.api.platformAccessory(device.exampleDisplayName, uuid);

		// 		accessory.context.device = device;

		// 		new ExamplePlatformAccessory(this, accessory);

		// 		this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
		// 	}
		// }
	}
}
