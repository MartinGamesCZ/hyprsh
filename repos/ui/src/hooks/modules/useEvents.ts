import { useEffect, useMemo, useRef } from "react";
import { useEventsStore } from "../stores/useEventsStore";

export function useEvents() {
  const { addListener, removeListener } = useEventsStore.getState();

  return useMemo(
    () => ({
      addEventListener: addListener,
      removeEventListener: removeListener,
    }),
    [addListener, removeListener],
  );
}

export function useEvent(name: string, listener: (data: any) => void) {
  const { addListener } = useEventsStore.getState();
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const cleanup = addListener(name, (data) => {
      listenerRef.current(data);
    });

    return cleanup;
  }, [name, addListener]);
}
