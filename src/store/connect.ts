import type { Unsubscribe } from 'redux';
import type { LitElement } from 'lit';
import { store, type RootState } from './store';

export function connect(Base: { new (): LitElement }) {
  return class extends Base {
    #unsubscribe?: Unsubscribe;

    override connectedCallback(): void {
      super.connectedCallback();
      this.#unsubscribe = store.subscribe(() => {
        this.stateChanged(store.getState());
      });
      this.stateChanged(store.getState());
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.#unsubscribe?.();
    }

    stateChanged(_state: RootState) {}
  };
}
