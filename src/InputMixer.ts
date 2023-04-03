import { Axis } from "./inputs/Axis"
import { Button } from "./inputs/Button"
import { ConcreteAxis } from "./inputs/ConcreteAxis"
import { ConcreteButton } from "./inputs/ConcreteButton"
import { InvertedAxis } from "./inputs/InvertedAxis"
import { InvertedButton } from "./inputs/InvertedButton"
import { VirtualAxis } from "./inputs/VirtualAxis"
import { VirtualButton } from "./inputs/VirtualButton"
import { GamepadAxisId, GamepadButtonId, GamepadListener } from "./listeners/GamepadListener"
import { KeyboardListener } from "./listeners/KeyboardListener"

export class InputMixer {
  /// The underlying gamepad listener
  gamepad = new GamepadListener()

  /// The underlying keyboard listener
  keyboard = new KeyboardListener()

  /**
   * Create a virtual button that can be bound to actual buttons/keys
   * @param id An identifier representing the button
   * @returns the VirtualButton object
   */
  createButton(id: string) {
    return new VirtualButton(this, id)
  }

  /**
   * Create a virtual axis that can be bound to actual axes/buttons/keys
   * @param id An identifier representing the axis
   * @returns the VirtualAxis object
   */
  createAxis(id: string) {
    return new VirtualAxis(this, id)
  }

  /**
   * Find the named button/axis in the underlying gamepad/keyboard listeners
   *
   * Supports the following prefixes:
   *  "-": Inverts an axis, or a button used as axis.
   *       e.g "-Gamepad0.Axis", "-KeyA"
   *  "!": Inverts a button. It now counts as pressed when the underlying button is not pressed.
   *       e.g "!KeyS"
   * */
  find(id: GamepadAxisId | `-${GamepadButtonId}`): Axis
  find(id: GamepadButtonId): Button
  find<T extends string extends T ? never : string>(id: T, gamepadIndex?: number): Button
  find(id: string, gamepadIndex?: number): Axis | Button
  find(id: string, gamepadIndex: number = 0): Axis | Button {
    const [_, invertAxis, invertButton, plainId] = id.match(/^(?:(-?)(!?)([^]*))$/)!

    let found: ConcreteAxis | ConcreteButton | InvertedAxis | InvertedButton =
      this.gamepad.find(plainId, gamepadIndex) ?? this.keyboard.find(plainId)

    if (invertButton && found instanceof ConcreteButton) found = new InvertedButton(found, id)
    if (invertAxis) found = new InvertedAxis(found, id)

    return found
  }

  /**
   * Add keyboard/gamepadIndex event listeners
   * @returns A callback to remove the added event listeners
   */
  listen() {
    const unlistenKeyboard = this.keyboard.listen()
    const unlistenGamepad = this.gamepad.listen()

    return () => {
      unlistenKeyboard()
      unlistenGamepad()
    }
  }

  /**
   * Process all the input received since last tick
   */
  tick() {
    this.tickIndex++
    this.keyboard.tick()
    this.gamepad.tick()
  }

  tickIndex: number = 0
}
