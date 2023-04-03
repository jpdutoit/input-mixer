import { type Axis } from "./Axis";
import { Button } from "./Button";

interface OwnerListener {
  tickIndex: number;
}

export class ConcreteButton implements Button, Axis {
  constructor(public listener: OwnerListener, public id: string) {}

  isDown: number = 0;
  pressedTick: number = -1;
  releasedTick: number = -1;

  get wasPressed() {
    return this.pressedTick === this.listener.tickIndex;
  }

  get wasReleased() {
    return this.releasedTick === this.listener.tickIndex;
  }

  get value() {
    return this.isDown ? 1 : 0;
  }

  toggle(pressed: boolean, tickIndex: number) {
    if (pressed) {
      if (!this.isDown) {
        this.isDown = 1;
        this.pressedTick = tickIndex;
      }
    } else {
      if (this.isDown) {
        this.isDown = 0;
        this.releasedTick = tickIndex;
      }
    }
  }
}
