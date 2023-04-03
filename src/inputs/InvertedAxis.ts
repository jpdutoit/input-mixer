import { type Axis } from "./Axis";

/**
 * An inverted axis returns the negative value of the underlying axis
 */
export class InvertedAxis implements Axis {
  constructor(public axis: Axis, public id: string) {}

  get value() {
    return -this.axis.value;
  }
}
