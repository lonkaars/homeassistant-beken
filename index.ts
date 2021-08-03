import { API } from 'homebridge';

import BekenBridge from './plugin';

export default function Plugin(api: API) {
	api.registerPlatform('BekenBridge', BekenBridge);
}
