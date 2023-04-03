import { type Axis } from "./Axis";

interface OwnerListener {
  tickIndex: number;
}

export class ConcreteAxis implements Axis {
  constructor(public listener: OwnerListener, public id: string) {}

  value = 0;
}
