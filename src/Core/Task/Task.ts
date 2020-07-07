import { NotifyCallback } from "./NotifyCallback";

export abstract class Task<T> {
  public abstract async run(notify: NotifyCallback): Promise<T>;
}
