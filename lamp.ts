import { ChildProcess, spawn } from 'child_process';

export type LampColor = [number, number, number, number];

export default class Lamp {
	#color: LampColor;
	private subpr: ChildProcess;

	constructor(public addr: string) {
		this.subpr = spawn('./venv/bin/python3', ['./main.py', addr]);
	}

	set color(newColor: LampColor) {
		this.#color = newColor.map(c => Math.floor(c)) as LampColor;
		this.subpr.stdin.write(this.colorToString() + '\n');
	}

	get color() {
		return this.#color;
	}

	private colorToString() {
		return this.color.map(i => i.toString(16).padStart(2, '0')).join('');
	}
}

