/**
 * A mutable box that scroll progress is written into.
 *
 * ScrollTrigger writes here on every scroll frame and `useFrame` reads it on
 * every render frame. Deliberately NOT React state: routing sixty writes a
 * second through `setState` would re-render the whole scene graph for a value
 * that only the render loop consumes. This is the one case where a mutable
 * module-level object is the correct tool rather than a shortcut.
 */
export interface ScrollChannel {
  /** 0 → 1 across the pinned section that owns this channel. */
  progress: number;
  /** Set false while the section is off-screen, so the loop can idle. */
  active: boolean;
}

const channels = new Map<string, ScrollChannel>();

export function channel(id: string): ScrollChannel {
  let c = channels.get(id);
  if (!c) {
    c = { progress: 0, active: false };
    channels.set(id, c);
  }
  return c;
}

export const heroChannel = () => channel("hero");
export const craftChannel = () => channel("craft");
export const mapChannel = () => channel("map");
