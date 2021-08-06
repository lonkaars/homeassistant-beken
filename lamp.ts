import { ChildProcess, spawn } from 'child_process';
import { Logger } from 'homebridge';
import { join } from 'path';

export type LampColor = [number, number, number, number];

export default class Lamp {
	#color: LampColor;
	private subpr: ChildProcess;
	private last: string;

	constructor(public addr: string, public log: Logger) {
		this.subpr = spawn(join(__dirname, '/venv/bin/python3'), [join(__dirname, './main.py'), addr]);

		// debug
		this.subpr.stderr.on('data', this.log.error);
		this.subpr.stdout.on('data', this.log.log);
	}

	set color(newColor: LampColor) {
		this.#color = newColor.map(c => Math.floor(c)) as LampColor;
		var message = this.colorToString();
		if (this.last == message) return; // prevent duplicate messages
		this.subpr.stdin.write(message + '\n');
		this.last = message;
	}

	get color() {
		return this.#color;
	}

	private colorToString() {
		return this.color.map(i => i.toString(16).padStart(2, '0')).join('');
	}
}

// ! DEBUG
// if (typeof require !== 'undefined' && require.main === module) {
// 	var lamp = new Lamp("FC:58:FA:A1:CF:F1");
//
// 	setInterval(() => {
// 		lamp.color = [0, 0, 0, Math.floor(Math.random() * 255)];
// 	}, 100);
// }
