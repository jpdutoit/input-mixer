import { type Button } from "./Button";

/**
 * An inverted button counts as pressed when the underlying button is not pressed, and vice versa
 */
export class InvertedButton implements Button {
  constructor(public button: Button, public id: string) {}

  get isDown() {
    return 1 - this.button.isDown;
  }

  get pressedTick() {
    return this.button.releasedTick;
  }

  get releasedTick() {
    return this.button.pressedTick;
  }

  get wasPressed() {
    return this.button.wasReleased;
  }

  get wasReleased() {
    return this.button.wasPressed;
  }

  get value() {
    return this.isDown ? 1 : 0;
  }
}
