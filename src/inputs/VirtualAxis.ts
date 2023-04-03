import { InputMixer } from "../InputMixer";
import { type Axis } from "./Axis";

/** A virtual axis can be bound to any number of axes/buttons */
export class VirtualAxis implements Axis {
  constructor(public input: InputMixer, public id: string) {}

  public axes: Map<string, Axis> = new Map();

  deadzone: number = 0.1;

  /**
   * Sets the axis deadzone
   */
  withDeadzone(value: number) {
    this.deadzone = value;
    return this;
  }

  /**
   * Clear all bindings
   */
  clear() {
    this.axes.clear();
    return this;
  }

  /**
   * Binds buttons/axis to this virtual axis
   *
   * @param targets Array of ids or Axes
   * @param defaultGamepadIndex (Optional) Default gamepad index to use
   */
  bind(targets: (string | Axis)[], defaultGamepadIndex?: number) {
    for (let target of targets) {
      if (typeof target === "string") {
        this.axes.set(target, this.input.find(target, defaultGamepadIndex));
      } else {
        this.axes.set(target.id, target);
      }
    }
    return this;
  }

  get value() {
    let sum = 0;
    for (let [id, axis] of this.axes.entries()) {
      const value = Math.abs(axis.value) < this.deadzone ? 0 : axis.value;
      sum += value;
    }

    return Math.max(-1, Math.min(1, sum));
  }
}
