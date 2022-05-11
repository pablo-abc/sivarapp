import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Unsubscribe } from 'redux';
import { type RootState, store } from './store';

type Host = ReactiveControllerHost & {
  [key: string]: any;
  stateChanged?(): void;
};

type Selectors = Record<string, (state: RootState) => any>;

export class StoreController implements ReactiveController {
  #host!: Host;

  #selectors?: Selectors;

  #unsubscribe?: Unsubscribe;

  state = store.getState();

  dispatch = store.dispatch;

  onChange?: (state: RootState) => void;

  constructor(host: Host, selectors?: Selectors) {
    this.#host = host;
    this.#selectors = selectors;
    host.addController(this);
  }

  hostConnected() {
    const keys = this.#selectors ? Object.keys(this.#selectors) : [];
    this.#host.stateChanged?.();
    keys.forEach((key) => {
      this.#host[key] = this.#selectors?.[key](store.getState());
    });
    this.#unsubscribe = store.subscribe(() => {
      this.state = store.getState();
      this.#host.stateChanged?.();
      keys.forEach((key) => {
        this.#host[key] = this.#selectors?.[key](store.getState());
      });
    });
  }

  hostDisconnected() {
    this.#unsubscribe?.();
  }
}
