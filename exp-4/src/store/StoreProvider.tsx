import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrate } from "./postSlice";
import { loadPersisted, persist, store } from "./index";

export function StoreProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!store.getState().posts.hydrated) {
      store.dispatch(hydrate(loadPersisted()));
    }
    let last = store.getState().posts;
    persist(last);
    return store.subscribe(() => {
      const next = store.getState().posts;
      if (next.posts !== last.posts || next.settings !== last.settings) {
        last = next;
        persist(next);
      }
    });
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
