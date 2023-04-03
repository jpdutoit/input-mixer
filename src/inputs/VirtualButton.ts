import { InputMixer } from "../InputMixer";
import { type Button } from "./Button";

/** A virtual axis can be bound to any number of buttons */
export class VirtualButton implements Button {
  buttons: Map<string, Button> = new Map();

  constructor(public input: InputMixer, public id: string) {}

  /**
   * Clear all bindings
   */
  clear() {
    this.buttons.clear();
    return this;
  }

  /**
   * Binds buttons to this virtual buttons
   *
   * @param targets Array of ids or Buttons
   * @param defaultGamepadIndex (Optional) Default gamepad index to use
   */
  bind(targets: (string | Button)[], gamepadIndex?: number) {
    for (let target of targets) {
      if (typeof target === "string") {
        const button = this.input.find(target, gamepadIndex);
        if ("isDown" in button) {
          this.buttons.set(target, button);
        } else {
          throw console.warn(
            `Expected button, but got '${target}', while binding '${this.id}'`
          );
        }
      } else {
        this.buttons.set(target.id, target);
      }
    }
    return this;
  }

  get isDown() {
    let sum = 0;
    for (const button of this.buttons.values()) {
      sum += button.isDown;
    }
    return sum > 0 ? 1 : 0;
  }

  get value() {
    return this.isDown ? 1 : 0;
  }

  get wasPressed() {
    return this.pressedTick === this.input.tickIndex;
  }

  get wasReleased() {
    return this.releasedTick === this.input.tickIndex;
  }

  get pressedTick() {
    let firstPressedTick: number = Infinity;
    for (let button of this.buttons.values()) {
      if (button.isDown) {
        firstPressedTick = Math.min(firstPressedTick, button.pressedTick);
      }
    }
    return firstPressedTick;
  }

  get releasedTick() {
    let lastReleasedTick: number = -1;
    for (let button of this.buttons.values()) {
      if (button.isDown) return button.releasedTick;
      lastReleasedTick = Math.max(lastReleasedTick, button.releasedTick);
    }
    return lastReleasedTick;
  }
}
