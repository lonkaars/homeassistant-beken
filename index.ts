import { API } from 'homebridge';

import BekenBridge from './plugin';

module.exports = (api: API) => {
	api.registerAccessory('BekenBridge', BekenBridge);
};
