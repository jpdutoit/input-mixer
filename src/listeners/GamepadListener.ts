import { ConcreteAxis } from "../inputs/ConcreteAxis";
import { ConcreteButton } from "../inputs/ConcreteButton";
import { DefaultMap } from "../util";

export type GamepadAxisId = `Gamepad${number | ""}.Axis${number}`;
export type GamepadButtonId = `Gamepad${number | ""}.Button${number}`;

export interface GamepadInfo {
  index: number;
  deadzone: number;
  isConnected: boolean;
  buttons: DefaultMap<number, ConcreteButton>;
  axes: DefaultMap<number, ConcreteAxis>;
}

export class GamepadListener {
  getGamepad(gamepadIndex: number) {
    return this.gamepads.get(gamepadIndex);
  }

  /**
   * Find the named button or axis
   * */
  find(
    id: string,
    defaultGamepad: number = 0
  ): ConcreteAxis | ConcreteButton | undefined {
    let [_, gamepadIndex, buttonOrAxis, index] = id.match(
      /(?:^Gamepad(\d+)?\.(Button|Axis)(\d+)$)?/
    )!;

    if (!buttonOrAxis) return;
    if (!gamepadIndex) gamepadIndex = defaultGamepad.toString();

    const c = this.gamepads.get(+gamepadIndex);
    if (buttonOrAxis === "Button") {
      return c.buttons.get(+index);
    } else if (buttonOrAxis === "Axis") {
      return c.axes.get(+index);
    }
  }

  /**
   * Process all input since last tick
   */
  tick() {
    this.tickIndex++;
    const gamepads = navigator.getGamepads();

    for (let gamepadInfo of this.gamepads.values()) {
      const gamepad = gamepads[gamepadInfo.index] ?? undefined;
      if (!gamepad) continue;

      for (let [buttonIndex, button] of gamepadInfo.buttons) {
        button.toggle(gamepad.buttons[buttonIndex].pressed, this.tickIndex);
      }
      for (let [axisIndex, axis] of gamepadInfo.axes) {
        const rawValue = gamepad.axes[axisIndex];
        const filteredValue =
          Math.abs(rawValue) < gamepadInfo.deadzone ? 0 : rawValue;
        axis.value = filteredValue;
      }
    }
  }

  /**
   * Start listenting for gamepad input
   * @returns A callback to remove the added event listeners
   */
  listen() {
    const onConnected = (e: GamepadEvent) => {
      this.gamepads.get(e.gamepad.index).isConnected = true;
    };
    const onDisconnected = (e: GamepadEvent) => {
      const gamepadInfo = this.gamepads.get(e.gamepad.index);
      gamepadInfo.isConnected = false;

      // Clear inputs for this gamepad
      for (const button of gamepadInfo.buttons.values()) {
        if (button.isDown) {
          button.isDown = 0;
          button.releasedTick = this.tickIndex;
        }
      }
      for (const axis of gamepadInfo.axes.values()) {
        axis.value = 0;
      }
    };

    window.addEventListener("gamepadconnected", onConnected);
    window.addEventListener("gamepaddisconnected", onDisconnected);

    return () => {
      window.removeEventListener("gamepadconnected", onConnected);
      window.removeEventListener("gamepaddisconnected", onDisconnected);
    };
  }

  tickIndex = 0;

  readonly gamepads = new DefaultMap<number, GamepadInfo>((gamepadIndex) => ({
    deadzone: 0,
    isConnected: false,
    index: gamepadIndex,
    buttons: new DefaultMap(
      (index) =>
        new ConcreteButton(this, `Gamepad${gamepadIndex}.Button${index}`)
    ),
    axes: new DefaultMap(
      (index) => new ConcreteAxis(this, `Gamepad${gamepadIndex}.Axis${index}`)
    ),
  }));
}
