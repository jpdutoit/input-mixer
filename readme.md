# InputMixer

![build status](https://img.shields.io/github/actions/workflow/status/jpdutoit/input-mixer/publish.yml)
![gzipped size](https://img.shields.io/bundlephobia/minzip/input-mixer)
![license](https://img.shields.io/npm/l/input-mixer)

InputMixer is a small input listener library for games and interactive web applications. It allows you to create virtual buttons and axes that can be bound to actual buttons, keys, or axes from various input devices like gamepads and keyboards.

## Features:

- Simple and flexible API for managing virtual buttons and axes
- Support for gamepad and keyboard inputs
- Ability to bind multiple input sources to a single virtual button/axis
- Deadzone management for analog axes
- Inversion of button or axis values
- Supports both fixed update rate, and frame rate dependent input processing
- No dependencies

## Installation

```bash
npm install input-mixer --save
```

## Usage

```ts
import { InputMixer } from "input-mixer";

const input = new InputMixer();

// Create a virtual jump button
const jumpButton = input
  .createButton("Jump")
  .bind(["KeySpace", "Gamepad0.Button0"]);

// Create a virtual horizontal axis
const horizontalAxis = input
  .createAxis("Horizontal")
  .withDeadZone(0.4)
  .bind(["-KeyA", "KeyD", "Gamepad0.Axis0"]);

// Add input event listeners
const stopListening = input.listen();

function onFrame() {
  // `tick()` should be called at the beginning of your game loop;
  // either in your render function if you are reading the input per frame,
  // or in the start of your fixedUpdate if you are reading input at a fixed rate.
  input.tick();

  if (jumpButton.wasPressed) {
    // Perform a jump action
  }

  // Use horizontal axis value to set player velocity
  player.vx += horizontalAxis.value * playerSpeed;
}

function onCleanup() {
  // Remove event listeners
  stopListening();
}
```

## Button and Axis IDs

Button and Axis ids are unique identifiers used to reference specific buttons or axes on various input devices, such as keyboards and gamepads. They are used when binding virtual buttons or axes to actual input sources.

You can also use the `-` and `!` modifiers, as described in [Modifiers](#modifiers), to invert the values of axes or buttons.

### Keyboard button IDs

Keyboard button ids refer to standard DOM KeyboardEvent [code or key](https://keycode.info/) property.

For example:

- `KeyA`: A key (any case)
- `ArrowLeft`: Left arrow key
- `Space`: Spacebar
- `w` Lowercase w key

### Gamepad button IDs

Gamepad button IDs follow the format `Gamepad{gamepad_index}.Button{button_index}`, where `{gamepad_index}` is the index of the gamepad and `{button_index}` is the index of the specific button on the gamepad.

You can choose to pass the gamepad index via the `defaultGamepadIndex` parameter instead.

For example:

- `Gamepad0.Button0`: Button 0 on gamepad 0
- `Gamepad0.Button1`: Button 1 on gamepad 0
- `Gamepad1.Button0`: Button 0 on gamepad 1
- `Gamepad.Button0`: Button 0 on the default gamepad

### Gamepad axis IDs

Gamepad axis IDs follow the format `Gamepad{gamepad_index}.Axis{axis_index}`, where `{gamepad_index}` is the index of the gamepad and `{axis_index}` is the index of the specific axis on the gamepad.

You can choose to pass the gamepad index via the `defaultGamepadIndex` parameter instead.

For example:

- `Gamepad0.Axis0`: Axis 0 on gamepad 0
- `Gamepad0.Axis1`: Axis 1 on gamepad 0
- `Gamepad1.Axis0`: Axis 0 on gamepad 1
- `Gamepad.Axis0`: Axis 0 on the default gamepad

## Modifiers

InputMixer supports two special modifiers, `-` and `!`, which can be used to invert the values of axes or buttons.

When using these modifiers, make sure to include them in the identifier string when binding virtual buttons or axes to actual input sources.

### Inverting an Axis

To invert the value of an axis, prefix the axis identifier with the `-` modifier. This can be useful, for example, when binding a virtual axis to the left and right arrow keys or other input sources with opposite directions.

```ts
// Invert the value of the "Gamepad0.Axis1" axis
const invertedYAxis = input.find("-Gamepad0.Axis1");

// Create horizontal axis using left and right arrow keys
const horizontalAxis = input
  .createAxis("Horizontal")
  .bind(["-ArrowLeft", "ArrowRight"]);
```

### Inverting a Button

To invert a button, meaning that the virtual button will count as pressed when the underlying button is not pressed and vice versa, prefix the button identifier with the `!` modifier. This can be useful when creating "toggle" buttons or other input sources that should have reversed behavior.

```ts
// Invert the value of the "KeyS" button
const invertedButton = input.find("!KeyS");

// Bind the inverted button to a virtual button
const toggleButton = input.createButton("Toggle").bind(["!KeyS"]);
```

## API Reference

### InputMixer

The main class that manages input devices and their state.

#### Methods:

- `createButton(id: string)`: Create a virtual button that can be bound to actual buttons/keys
- `createAxis(id: string)`: Create a virtual axis that can be bound to actual axes/buttons/keys
- `find(id: string, defaultGamepadIndex?: number)`: Find a named button/axis in the underlying gamepad/keyboard listeners
- `listen()`: Add keyboard/gamepad event listeners. Returns a function to stop listening.
- `tick()`: Process all input received since last tick. Call at start of frame or fixed update.

### VirtualButton

A virtual button that can be bound to any number of buttons/keys.

#### Properties

- `isDown`: Is this button currently pressed
- `wasPressed`: Was this button pressed during the last tick
- `wasReleased` Was this button released during the last tick

#### Methods

- `clear()`: Clear all bindings
- `bind(targets: (string | Button)[], defaultGamepadIndex?: number)`: Bind buttons/keys to this virtual button

### VirtualAxis

A virtual axis that can be bound to any number of axes/buttons/keys.

#### Properties

- `value`: The current axis value ranging from -1 to 1.

#### Methods

- `withDeadzone(value: number)`: Set the axis deadzone
- `clear()`: Clear all bindings
- `bind(targets: (string | Axis)[], defaultGamepadIndex?: number)`: Bind axes/buttons/keys to this virtual axis

## Contributing

We welcome contributions to improve InputMixer! If you find any bugs, have feature requests, or would like to contribute code, please open an issue or submit a pull request on GitHub.

## License

InputMixer is MIT licensed.
