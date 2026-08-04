import { PHOLIO_AUTH_CHANNEL } from "./constants";

export function subscribeAuthChanges(handler: (detail?: { type?: string }) => void) {
  if (typeof window === "undefined") return () => {};

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(PHOLIO_AUTH_CHANNEL);
    channel.onmessage = (event) => handler(event.data);
  } catch {
    channel = null;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === PHOLIO_AUTH_CHANNEL) handler({ type: "auth-changed" });
  };
  window.addEventListener("storage", onStorage);

  return () => {
    channel?.close();
    window.removeEventListener("storage", onStorage);
  };
}
