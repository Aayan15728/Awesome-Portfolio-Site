import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false during SSR and the first hydration render, true afterwards. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
