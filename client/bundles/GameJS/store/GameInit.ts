import { Init } from '../Client/Init';
import { Events } from '../Client/World';

var InstancedGameInit = null;

export type EventType = Events;  // Alias para o tipo Events
export var EventType = Events;  // Alias para o valor Events

class Game {
	started;
	init: Init;

	constructor() {
		this.started = false;

		if (InstancedGameInit == null) {
			InstancedGameInit = new Init();
		}

		this.init = InstancedGameInit;
	}

	Start(auth: string, setIsInitializedAll) {
    if (this.started) return;
    this.init.Process(auth, setIsInitializedAll);
    this.started = true;
  }

  PublishEvent(eventType: Events, data) {
  	this.init.world.PushEvent(this.init.gameObj, eventType, data);
  }
}

const GameInstance = new Game();
export default GameInstance;
