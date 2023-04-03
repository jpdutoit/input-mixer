import { ConcreteButton } from "../inputs/ConcreteButton"
import { DefaultMap } from "../util"

type KeyDownEvent = [keyId: string, delta: 1]
type KeyUpEvent = [keyId: string, delta: -1]
type KeyEvent = KeyDownEvent | KeyUpEvent

export class KeyboardListener {
  constructor() {}

  tickIndex = 0
  readonly keyMap = new DefaultMap<string, ConcreteButton>((id): ConcreteButton => {
    return new ConcreteButton(this, id)
  })

  /**
   * Find the named key
   * */
  find(id: string): ConcreteButton {
    return this.keyMap.get(id)
  }

  protected onKeyDown(keyId: string) {
    if (!this.keyMap.has(keyId)) return

    const key = this.keyMap.get(keyId)

    if (0 == key.isDown) {
      key.isDown = 1
      key.pressedTick = this.tickIndex
    }
  }

  /**
   * Process all input since last tick
   */
  tick() {
    this.tickIndex++

    for (let i = 0; i < this.eventCount; ++i) {
      const event = this.events[i]
      if (event[1] > 0) {
        this.onKeyDown(event[0])
      } else {
        this.onKeyUp(event[0])
      }
    }
    this.eventCount = 0
  }

  /**
   * Start listenting for keyboard input
   * @returns A callback to remove the added event listeners
   */
  listen() {
    const onKeyDown = (event: KeyboardEvent) => {
      storeKeyEvent(this.events, this.eventCount++, event.key, 1)
      if (event.key !== event.code) storeKeyEvent(this.events, this.eventCount++, event.code, 1)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      storeKeyEvent(this.events, this.eventCount++, event.key, -1)
      if (event.key !== event.code) storeKeyEvent(this.events, this.eventCount++, event.code, -1)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyDown)
    }
  }

  protected onKeyUp(keyId: string) {
    if (!this.keyMap.has(keyId)) return
    const key = this.keyMap.get(keyId)

    if (key.isDown) {
      key.isDown = 0
      key.releasedTick = this.tickIndex
    }
  }

  // Keyboard events stored until next tick
  protected readonly events: KeyEvent[] = []
  protected eventCount: number = 0
}

function storeKeyEvent(array: KeyEvent[], index = 0, keyId: string, delta: KeyEvent[1]) {
  if (!array[index]) {
    array[index] = [keyId, delta]
  } else {
    array[index][0] = keyId
    array[index][1] = delta
  }
}
