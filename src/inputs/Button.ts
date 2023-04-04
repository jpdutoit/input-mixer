import { Axis } from "./Axis";

export interface Button extends Axis {
  readonly id: string;
  readonly isDown: number;
  readonly wasPressed: boolean;
  readonly wasReleased: boolean;
  readonly pressedTick: number;
  readonly releasedTick: number;
}
