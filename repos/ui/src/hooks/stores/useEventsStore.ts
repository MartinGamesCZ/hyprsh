import { create } from "zustand";
import { API } from "@/classes/API";

export type IEventListener = (data: any) => void;

export interface IEventsStore {
  listeners: Map<string, IEventListener[]>;
  eventSource: EventSource | null;
  eventHandlers: Map<string, (e: MessageEvent) => void>;

  addListener(name: string, listener: IEventListener): () => void;
  removeListener(name: string, listener: IEventListener): void;

  _emit(name: string, data: any): void;
}

export const useEventsStore = create<IEventsStore>((set, get) => ({
  listeners: new Map<string, IEventListener[]>(),
  eventSource: null,
  eventHandlers: new Map<string, (e: MessageEvent) => void>(),

  addListener: (name: string, listener: IEventListener) => {
    const state = get();
    let es = state.eventSource;

    if (!es) {
      es = API.sse("/v1/events");
      set({ eventSource: es });
    }

    const currentListeners = state.listeners;
    if (!currentListeners.has(name)) currentListeners.set(name, []);

    const callbacks = currentListeners.get(name)!;

    if (callbacks.length === 0) {
      const handler = (e: MessageEvent) => {
        let parsedData = e.data;
        try {
          parsedData = JSON.parse(e.data);
        } catch {}

        get()._emit(name, parsedData);
      };

      es.addEventListener(name, handler);
      state.eventHandlers.set(name, handler);
    }

    callbacks.push(listener);

    return () => get().removeListener(name, listener);
  },

  removeListener: (name: string, listener: IEventListener) => {
    const state = get();
    const currentListeners = state.listeners;

    if (!currentListeners.has(name)) return;

    const callbacks = currentListeners.get(name)!;
    const filtered = callbacks.filter((l) => l !== listener);

    if (filtered.length === 0) {
      currentListeners.delete(name);

      const es = state.eventSource;
      const handler = state.eventHandlers.get(name);

      if (es && handler) {
        es.removeEventListener(name, handler);
        state.eventHandlers.delete(name);
      }
    } else currentListeners.set(name, filtered);

    if (currentListeners.size === 0 && state.eventSource) {
      state.eventSource.close();
      set({ eventSource: null });
    }
  },

  _emit: (name: string, data: any) => {
    const callbacks = get().listeners.get(name);
    if (!callbacks) return;

    for (const cb of callbacks) {
      cb(data);
    }
  },
}));
