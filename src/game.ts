// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { Game, RenderApi, UpdateApi } from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as C from "./constants";

export const BACKGROUND = "#020911";
export type Screen =
  | "title"
  | "howto"
  | "countdown"
  | "playing"
  | "paused"
  | "cleared"
  | "gameover";
export type Direction = "up" | "down" | "left" | "right";
export type PredatorState = "den" | "wander" | "chase" | "search";
export interface Body {
  x: number;
  y: number;
  dir: Direction;
  mind: boolean;
  travel: boolean;
}
export interface Predator extends Body {
  kind: C.PredatorKind;
  state: PredatorState;
  released: boolean;
  alertTime: number;
  fix: [number, number] | null;
  linger: number;
  release: number;
  ping: number;
  pingGap: number;
  hearingLock: boolean;
  flareTimer: number;
  flareCharge: number;
  flareTime: number;
  flareFade: number;
  chaseSpeed: number;
  searchTime: number;
  searchOrigin: [number, number] | null;
}
export type Drifter = Body;
export interface Pulse {
  source: "forager" | "gloamfin";
  tint: "cyan" | "violet" | "orange";
  ox: number;
  oy: number;
  front: number;
  range: number;
  caught: number[];
}
export interface Cloud {
  x: number;
  y: number;
  radius: number;
  remaining: number;
}
export interface FathomState {
  screen: Screen;
  menuIndex: number | null;
  titleIndex: number;
  depth: number;
  score: number;
  lives: number;
  muted: boolean;
  tiles: string[];
  plankton: string[];
  visibility: string[];
  planktonRemaining: number;
  player: Body & {
    desired: Direction;
    moving: boolean;
    brightness: number;
    brightHold: number;
    sonarCooldown: number;
    inkCooldown: number;
  };
  drifterIn: number;
  drifters: Drifter[];
  predators: Predator[];
  pulses: Pulse[];
  inkClouds: Cloud[];
  simTime: number;
  accumulator: number;
  screenTimer: number;
  overlayPulse: number[];
  sprites: Record<string, ImageBitmap[]>;
}
type Snap = Record<string, unknown>;
export interface FathomDebugApi {
  version: number;
  reset(s: DeepReadonly<FathomState>): FathomState;
  snapshot(s: DeepReadonly<FathomState>): Snap;
  reconcile(s: DeepReadonly<FathomState>): FathomState;
  setScreen(s: DeepReadonly<FathomState>, v: Screen): FathomState;
  setMenuIndex(s: DeepReadonly<FathomState>, i: number): FathomState;
  setTitleIndex(s: DeepReadonly<FathomState>, i: number): FathomState;
  menuItemRect(
    s: DeepReadonly<FathomState>,
    i: number,
  ): { x: number; y: number; w: number; h: number } | null;
  setScore(s: DeepReadonly<FathomState>, n: number): FathomState;
  setLives(s: DeepReadonly<FathomState>, n: number): FathomState;
  setDepth(s: DeepReadonly<FathomState>, n: number): FathomState;
  setMaze(s: DeepReadonly<FathomState>, rows: string[]): FathomState;
  setPlankton(
    s: DeepReadonly<FathomState>,
    x: number,
    y: number,
    p: boolean,
  ): FathomState;
  clearPlankton(s: DeepReadonly<FathomState>): FathomState;
  clearFog(s: DeepReadonly<FathomState>): FathomState;
  setForagerTile(
    s: DeepReadonly<FathomState>,
    x: number,
    y: number,
  ): FathomState;
  setForagerDir(s: DeepReadonly<FathomState>, d: Direction): FathomState;
  setBrightness(s: DeepReadonly<FathomState>, g: number): FathomState;
  setBrightHold(s: DeepReadonly<FathomState>, n: number): FathomState;
  clearPredators(s: DeepReadonly<FathomState>): FathomState;
  addPredator(
    s: DeepReadonly<FathomState>,
    k: C.PredatorKind,
    x: number,
    y: number,
  ): FathomState;
  setPredatorTile(
    s: DeepReadonly<FathomState>,
    i: number,
    x: number,
    y: number,
  ): FathomState;
  setPredatorDir(
    s: DeepReadonly<FathomState>,
    i: number,
    d: Direction,
  ): FathomState;
  setPredatorState(
    s: DeepReadonly<FathomState>,
    i: number,
    v: "den" | "wander" | "chase",
  ): FathomState;
  setPredatorReleased(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setPredatorMind(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setPredatorTravel(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  spawnDrifter(s: DeepReadonly<FathomState>, x: number, y: number): FathomState;
  clearDrifters(s: DeepReadonly<FathomState>): FathomState;
  setDrifterMind(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setDrifterTravel(
    s: DeepReadonly<FathomState>,
    i: number,
    v: boolean,
  ): FathomState;
  setDrifterIn(s: DeepReadonly<FathomState>, n: number): FathomState;
  setSonarCooldown(s: DeepReadonly<FathomState>, n: number): FathomState;
  setInkCooldown(s: DeepReadonly<FathomState>, n: number): FathomState;
}
const idx = (x: number, y: number) => y * C.GRID_COLS + x,
  tile = (x: number, y: number) =>
    [
      C.GRID_ORIGIN_X + x * C.TILE + C.TILE / 2,
      C.GRID_ORIGIN_Y + y * C.TILE + C.TILE / 2,
    ] as const;
const pos = (s: DeepReadonly<FathomState>, x: number, y: number) => {
  const tx = Math.max(
      0,
      Math.min(C.GRID_COLS - 1, Math.floor((x - C.GRID_ORIGIN_X) / C.TILE)),
    ),
    ty = Math.max(
      0,
      Math.min(C.GRID_ROWS - 1, Math.floor((y - C.GRID_ORIGIN_Y) / C.TILE)),
    );
  return [tx, ty] as const;
};
const center = (s: DeepReadonly<FathomState>, x: number, y: number) => {
  const [a, b] = tile(x, y);
  return { x: a, y: b };
};
const open = (
  s: DeepReadonly<FathomState>,
  x: number,
  y: number,
  pred = false,
) => {
  if (y < 0 || y >= C.GRID_ROWS) return false;
  if (x < 0) x = C.GRID_COLS - 1;
  if (x >= C.GRID_COLS) x = 0;
  const t = s.tiles[idx(x, y)];
  return t === "." || (pred && (t === "d" || t === "g"));
};
const dirs: Direction[] = ["up", "right", "down", "left"],
  delta: Record<Direction, [number, number]> = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  },
  opposite: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
function createMaze(): {
  tiles: string[];
  plankton: string[];
  start: [number, number];
} {
  const a = Array.from({ length: C.GRID_ROWS }, () =>
    Array(C.GRID_COLS).fill("#"),
  );
  // Interleaved rails and paired vertical links make a connected, narrow looped trench.
  for (let y = 1; y < C.GRID_ROWS - 1; y += 2)
    for (let x = 1; x < C.GRID_COLS - 1; x++) a[y][x] = ".";
  for (let y = 2; y < C.GRID_ROWS - 2; y += 2) {
    const x = 2 + ((y / 2) % 2) * 2;
    for (const c of [x, C.GRID_COLS - 1 - x]) a[y][c] = ".";
  }
  // Link each rail into the next and preserve the horizontal wrap row.
  for (let y = 2; y < C.GRID_ROWS - 2; y += 2) {
    const x = 2 + ((y / 2) % 2) * 2;
    for (const c of [x, C.GRID_COLS - 1 - x]) {
      a[y - 1][c] = ".";
      a[y + 1][c] = ".";
    }
  }
  for (let x = 0; x < C.GRID_COLS; x++) a[9][x] = ".";
  // Den and its single north gate.
  for (let y = 7; y <= 9; y++) for (let x = 16; x <= 19; x++) a[y][x] = "d";
  a[6][17] = "g";
  a[5][17] = ".";
  // Ensure the start and den share a route, with a clean corridor around the gate.
  for (let y = 5; y <= 10; y++) a[y][17] = ".";
  a[6][17] = "g";
  for (let y = 7; y <= 9; y++) for (let x = 16; x <= 19; x++) a[y][x] = "d";
  const rows = a.map((r) => r.join(""));
  return {
    tiles: rows,
    plankton: rows.map((r) =>
      r.replace(/[.#dg]/g, (c) => (c === "." ? "*" : "-")),
    ),
    start: [2, 15],
  };
}
function roster(depth: number): Predator[] {
  const kinds: C.PredatorKind[] = [...C.DEN_ORDER];
  for (let i = 1; i < depth && depth < C.ROSTER_CAP_DEPTH; i++)
    kinds.push(C.ROSTER_ADD_ORDER[(i - 1) % C.ROSTER_ADD_ORDER.length]);
  if (depth >= C.ROSTER_CAP_DEPTH) kinds.push(...C.ROSTER_ADD_ORDER);
  return kinds.map((kind, i) => {
    const [x, y] = tile(16 + (i % 4), 7 + Math.floor(i / 4));
    return {
      kind,
      x,
      y,
      dir: "down",
      mind: true,
      travel: true,
      state: "den",
      released: false,
      alertTime: 0,
      fix: null,
      linger: 0,
      release: i * C.DEN_RELEASE_GAP,
      ping: 1,
      pingGap: 0,
      hearingLock: false,
      flareTimer: C.FLARE_INTERVAL,
      flareCharge: 0,
      flareTime: 0,
      flareFade: 0,
      chaseSpeed: C.GLOAMFIN_CHASE_SPEED,
      searchTime: 0,
      searchOrigin: null,
    };
  });
}
function baseState(
  sprites: Record<string, ImageBitmap[]>,
  depth = 1,
): FathomState {
  const m = createMaze(),
    [x, y] = tile(...m.start);
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    depth,
    score: 0,
    lives: C.START_LIVES,
    muted: false,
    tiles: m.tiles,
    plankton: m.plankton,
    visibility: Array(C.GRID_ROWS).fill("u".repeat(C.GRID_COLS)),
    planktonRemaining: m.plankton.join("").split("*").length - 1,
    player: {
      x,
      y,
      dir: "right",
      desired: "right",
      mind: true,
      travel: true,
      moving: false,
      brightness: 0,
      brightHold: 0,
      sonarCooldown: 0,
      inkCooldown: 0,
    },
    drifterIn: C.DRIFTER_INTERVAL,
    drifters: [],
    predators: roster(depth),
    pulses: [],
    inkClouds: [],
    simTime: 0,
    accumulator: 0,
    screenTimer: 0,
    overlayPulse: [],
    sprites,
  };
}
const score = 0;
void score;
function validate(condition: boolean, label: string): void {
  if (!condition) throw new RangeError(`Fathom debug: invalid ${label}`);
}
function menuItems(s: DeepReadonly<FathomState>): readonly string[] | null {
  return s.screen === "title"
    ? C.TITLE_ITEMS
    : s.screen === "paused"
      ? C.PAUSE_ITEMS
      : s.screen === "gameover"
        ? C.GAMEOVER_ITEMS
        : null;
}
function reconcile(s: DeepReadonly<FathomState>): FathomState {
  return {
    ...s,
    planktonRemaining: s.plankton.join("").split("*").length - 1,
  } as unknown as FathomState;
}
function makeDebug(): FathomDebugApi {
  const validTile = (
    s: DeepReadonly<FathomState>,
    x: number,
    y: number,
    allowDen = false,
  ) => {
    validate(
      Number.isInteger(x) &&
        x >= 0 &&
        x < C.GRID_COLS &&
        Number.isInteger(y) &&
        y >= 0 &&
        y < C.GRID_ROWS,
      "tile",
    );
    validate(open(s, x, y, allowDen), "open tile");
  };
  const setLayer = (layer: string[], x: number, y: number, ch: string) =>
    layer.map((r, j) => (j === y ? r.slice(0, x) + ch + r.slice(x + 1) : r));
  const snap = (s: DeepReadonly<FathomState>) => gridSnapshot(s);
  return {
    version: C.FATHOM_DEBUG_VERSION,
    reset(s) {
      const n = baseState(s.sprites);
      return { ...n, muted: s.muted };
    },
    snapshot: snap,
    reconcile,
    setScreen(s, v) {
      validate(
        [
          "title",
          "howto",
          "countdown",
          "playing",
          "paused",
          "cleared",
          "gameover",
        ].includes(v),
        "screen",
      );
      return {
        ...s,
        screen: v,
        menuIndex:
          v === "title"
            ? s.titleIndex
            : v === "paused" || v === "gameover"
              ? 0
              : null,
        screenTimer: 0,
      };
    },
    setMenuIndex(s, i) {
      const m = menuItems(s);
      validate(
        !!m && Number.isInteger(i) && i >= 0 && i < m.length,
        "menu index",
      );
      return { ...s, menuIndex: i };
    },
    setTitleIndex(s, i) {
      validate(
        Number.isInteger(i) && i >= 0 && i < C.TITLE_ITEMS.length,
        "title index",
      );
      return { ...s, titleIndex: i };
    },
    menuItemRect(s, i) {
      const m = menuItems(s);
      return m && i >= 0 && i < m.length
        ? { x: 470, y: 410 + i * 58, w: 340, h: 48 }
        : null;
    },
    setScore(s, n) {
      validate(Number.isInteger(n) && n >= 0, "score");
      return { ...s, score: n };
    },
    setLives(s, n) {
      validate(Number.isInteger(n) && n >= 0, "lives");
      return { ...s, lives: n };
    },
    setDepth(s, n) {
      validate(Number.isInteger(n) && n >= 1, "depth");
      return { ...s, depth: n, predators: roster(n) };
    },
    setMaze(s, rows) {
      validate(
        rows.length === C.GRID_ROWS &&
          rows.every((r) => r.length === C.GRID_COLS && /^[#.dg]+$/.test(r)),
        "maze",
      );
      validate((rows.join("").match(/g/g) || []).length === 1, "maze gate");
      return { ...s, tiles: [...rows] };
    },
    setPlankton(s, x, y, p) {
      validTile(s, x, y);
      return reconcile({
        ...s,
        plankton: setLayer(s.plankton, x, y, p ? "*" : "-"),
      });
    },
    clearPlankton(s) {
      return {
        ...s,
        plankton: s.plankton.map((r) => r.replace(/\*/g, "-")),
        planktonRemaining: 0,
      };
    },
    clearFog(s) {
      return {
        ...s,
        visibility: Array(C.GRID_ROWS).fill("u".repeat(C.GRID_COLS)),
      };
    },
    setForagerTile(s, x, y) {
      validTile(s, x, y);
      const [px, py] = tile(x, y);
      return { ...s, player: { ...s.player, x: px, y: py, moving: false } };
    },
    setForagerDir(s, d) {
      validate(dirs.includes(d), "direction");
      return {
        ...s,
        player: { ...s.player, dir: d, desired: d, moving: false },
      };
    },
    setBrightness(s, g) {
      validate(Number.isFinite(g) && g >= 0 && g <= 1, "brightness");
      return { ...s, player: { ...s.player, brightness: g } };
    },
    setBrightHold(s, n) {
      validate(
        Number.isFinite(n) && n >= 0 && n <= C.BRIGHT_HOLD,
        "bright hold",
      );
      return { ...s, player: { ...s.player, brightHold: n } };
    },
    clearPredators(s) {
      return { ...s, predators: [] };
    },
    addPredator(s, k, x, y) {
      validTile(s, x, y, true);
      const c = center(s, x, y);
      return {
        ...s,
        predators: [
          ...s.predators,
          {
            ...c,
            kind: k,
            dir: "up",
            mind: true,
            travel: true,
            state: "wander",
            released: true,
            alertTime: 0,
            fix: null,
            linger: 0,
            release: 0,
            ping: 1,
            pingGap: 0,
            hearingLock: false,
            flareTimer: C.FLARE_INTERVAL,
            flareCharge: 0,
            flareTime: 0,
            flareFade: 0,
            chaseSpeed: C.GLOAMFIN_CHASE_SPEED,
            searchTime: 0,
            searchOrigin: null,
          },
        ],
      };
    },
    setPredatorTile(s, i, x, y) {
      validate(i >= 0 && i < s.predators.length, "predator index");
      validTile(s, x, y, true);
      return {
        ...s,
        predators: s.predators.map((p, j) =>
          j === i ? { ...p, ...center(s, x, y) } : p,
        ),
      };
    },
    setPredatorDir(s, i, d) {
      validate(
        i >= 0 && i < s.predators.length && dirs.includes(d),
        "predator direction",
      );
      return {
        ...s,
        predators: s.predators.map((p, j) => (j === i ? { ...p, dir: d } : p)),
      };
    },
    setPredatorState(s, i, v) {
      validate(
        i >= 0 &&
          i < s.predators.length &&
          ["den", "wander", "chase"].includes(v),
        "predator state",
      );
      return {
        ...s,
        predators: s.predators.map((p, j) =>
          j === i
            ? {
                ...p,
                state: v,
                fix:
                  v === "chase"
                    ? ([...pos(s, s.player.x, s.player.y)] as [number, number])
                    : null,
              }
            : p,
        ),
      };
    },
    setPredatorReleased(s, i, v) {
      validate(i >= 0 && i < s.predators.length, "predator index");
      return {
        ...s,
        predators: s.predators.map((p, j) =>
          j === i ? { ...p, released: v } : p,
        ),
      };
    },
    setPredatorMind(s, i, v) {
      validate(i >= 0 && i < s.predators.length, "predator index");
      return {
        ...s,
        predators: s.predators.map((p, j) => (j === i ? { ...p, mind: v } : p)),
      };
    },
    setPredatorTravel(s, i, v) {
      validate(i >= 0 && i < s.predators.length, "predator index");
      return {
        ...s,
        predators: s.predators.map((p, j) =>
          j === i ? { ...p, travel: v } : p,
        ),
      };
    },
    spawnDrifter(s, x, y) {
      validTile(s, x, y);
      return {
        ...s,
        drifters: [
          ...s.drifters,
          { ...center(s, x, y), dir: "right", mind: true, travel: true },
        ],
      };
    },
    clearDrifters(s) {
      return { ...s, drifters: [] };
    },
    setDrifterMind(s, i, v) {
      validate(i >= 0 && i < s.drifters.length, "drifter index");
      return {
        ...s,
        drifters: s.drifters.map((d, j) => (j === i ? { ...d, mind: v } : d)),
      };
    },
    setDrifterTravel(s, i, v) {
      validate(i >= 0 && i < s.drifters.length, "drifter index");
      return {
        ...s,
        drifters: s.drifters.map((d, j) => (j === i ? { ...d, travel: v } : d)),
      };
    },
    setDrifterIn(s, n) {
      validate(
        Number.isFinite(n) && n >= 0 && n <= C.DRIFTER_INTERVAL,
        "drifter timer",
      );
      return { ...s, drifterIn: n };
    },
    setSonarCooldown(s, n) {
      validate(Number.isFinite(n) && n >= 0, "sonar cooldown");
      return { ...s, player: { ...s.player, sonarCooldown: n } };
    },
    setInkCooldown(s, n) {
      validate(Number.isFinite(n) && n >= 0, "ink cooldown");
      return { ...s, player: { ...s.player, inkCooldown: n } };
    },
  };
}
function gridSnapshot(s: DeepReadonly<FathomState>) {
  const [tx, ty] = pos(s, s.player.x, s.player.y),
    G = s.player.brightness;
  return {
    version: 1,
    screen: s.screen,
    menuIndex: s.menuIndex,
    titleIndex: s.titleIndex,
    depth: s.depth,
    score: s.score,
    lives: s.lives,
    muted: s.muted,
    planktonRemaining: s.planktonRemaining,
    drifterIn: s.drifterIn,
    brightness: G,
    brightHold: s.player.brightHold,
    visionRadius: C.VISION_MIN + C.VISION_GAIN * G,
    windowRadius: C.KINDLE_VISION_MIN + C.KINDLE_VISION_GAIN * G,
    sonar: {
      ready: s.player.sonarCooldown <= 0,
      cooldown: s.player.sonarCooldown,
      range: Math.max(C.SONAR_RANGE_MIN, C.SONAR_RANGE_BASE - (s.depth - 1)),
    },
    ink: { ready: s.player.inkCooldown <= 0, cooldown: s.player.inkCooldown },
    grid: {
      cols: C.GRID_COLS,
      rows: C.GRID_ROWS,
      tile: C.TILE,
      originX: C.GRID_ORIGIN_X,
      originY: C.GRID_ORIGIN_Y,
    },
    tiles: [...s.tiles],
    plankton: [...s.plankton],
    visibility: [...s.visibility],
    forager: {
      x: s.player.x,
      y: s.player.y,
      tx,
      ty,
      dir: s.player.dir,
      moving: s.player.moving,
    },
    drifters: s.drifters.map((d) => ({
      ...d,
      ...{ tx: pos(s, d.x, d.y)[0], ty: pos(s, d.x, d.y)[1], lit: false },
    })),
    predators: s.predators.map((p) => ({
      ...p,
      tx: pos(s, p.x, p.y)[0],
      ty: pos(s, p.x, p.y)[1],
      speed:
        p.state === "chase"
          ? p.kind === "gloamfin"
            ? p.chaseSpeed
            : C.PREDATOR_SPEED
          : p.kind === "lanternjaw"
            ? C.DRIFTER_SPEED
            : C.PREDATOR_SPEED,
      alert: p.alertTime > 0,
      lit: false,
      detectRange:
        p.kind === "gloamfin"
          ? null
          : C.LANTERN_RANGE_BASE + C.LANTERN_RANGE_GAIN * G,
      hearingRange: p.kind === "gloamfin" ? C.GLOAMFIN_HEAR : null,
      hearingLock: p.kind === "gloamfin" ? p.hearingLock : null,
      flareCharging: p.kind === "flarefish" ? p.flareCharge > 0 : null,
      flaring: p.kind === "flarefish" ? p.flareTime > 0 : null,
      flareRadius:
        p.kind === "flarefish" ? (p.flareTime > 0 ? C.FLARE_RADIUS : 0) : null,
    })),
    pulses: s.pulses.map(({ source, tint, ox, oy, front, range }) => ({
      source,
      tint,
      ox,
      oy,
      front,
      range,
    })),
    inkClouds: s.inkClouds.map((c) => ({ ...c })),
    simTime: s.simTime,
  };
}

function setLayerLocal(
  layer: string[],
  x: number,
  y: number,
  ch: string,
): string[] {
  return layer.map((r, j) =>
    j === y ? r.slice(0, x) + ch + r.slice(x + 1) : r,
  );
}
function beginDive(s: FathomState): FathomState {
  const n = baseState(s.sprites);
  return {
    ...n,
    screen: "countdown",
    menuIndex: null,
    muted: s.muted,
    titleIndex: s.titleIndex,
    simTime: s.simTime,
  };
}
function illuminate(s: FathomState): FathomState {
  const [px, py] = pos(s, s.player.x, s.player.y);
  const r = C.VISION_MIN + C.VISION_GAIN * s.player.brightness;
  const vis = s.visibility.map((row, y) =>
    row
      .split("")
      .map((v, x) =>
        v === "u" && Math.hypot(x - px, y - py) <= r / C.TILE ? "l" : v,
      )
      .join(""),
  );
  return { ...s, visibility: vis };
}
function step(s: FathomState, api: UpdateApi): FathomState {
  const dt = C.TICK_DT;
  s.simTime += dt;
  const press = (n: string) => api.input.pressed(n);
  if (
    s.screen === "title" ||
    s.screen === "gameover" ||
    s.screen === "paused"
  ) {
    const m = menuItems(s)!;
    if (press("up"))
      s.menuIndex = ((s.menuIndex ?? 0) + m.length - 1) % m.length;
    if (press("down")) s.menuIndex = ((s.menuIndex ?? 0) + 1) % m.length;
  }
  if (s.screen === "title" && press("confirm")) {
    s.titleIndex = s.menuIndex ?? 0;
    s =
      s.titleIndex === 1
        ? { ...s, screen: "howto", menuIndex: null }
        : beginDive(s);
  } else if (s.screen === "howto" && (press("confirm") || press("back")))
    s = { ...s, screen: "title", menuIndex: s.titleIndex };
  else if (s.screen === "playing" && press("pause"))
    s = { ...s, screen: "paused", menuIndex: 0 };
  else if (s.screen === "paused") {
    if (press("pause") || press("back"))
      s = { ...s, screen: "playing", menuIndex: null };
    else if (press("confirm")) {
      if (s.menuIndex === 0) s = { ...s, screen: "playing", menuIndex: null };
      else if (s.menuIndex === 1) s = beginDive(s);
      else
        s = {
          ...baseState(s.sprites),
          muted: s.muted,
          titleIndex: s.titleIndex,
          menuIndex: s.titleIndex,
        };
    }
  } else if (s.screen === "gameover" && (press("confirm") || press("back"))) {
    if (press("back") || s.menuIndex === 1)
      s = {
        ...baseState(s.sprites),
        muted: s.muted,
        titleIndex: s.titleIndex,
        menuIndex: s.titleIndex,
      };
    else s = beginDive(s);
  }
  if (s.screen === "countdown" || s.screen === "cleared") {
    s.screenTimer += dt;
    if (s.screenTimer > (s.screen === "countdown" ? 1.7 : 1.6))
      s =
        s.screen === "cleared"
          ? {
              ...beginDive(s),
              depth: s.depth + 1,
              score: s.score,
              lives: s.lives,
            }
          : { ...s, screen: "playing", screenTimer: 0 };
  }
  if (s.screen === "playing") {
    for (const d of dirs) if (api.input.value(d) > 0) s.player.desired = d;
    const [tx, ty] = pos(s, s.player.x, s.player.y),
      desired = s.player.desired,
      dd = delta[desired];
    if (desired === opposite[s.player.dir]) s.player.dir = desired;
    else if (
      Math.abs((s.player.x - C.GRID_ORIGIN_X - C.TILE / 2) % C.TILE) < 0.01 &&
      Math.abs((s.player.y - C.GRID_ORIGIN_Y - C.TILE / 2) % C.TILE) < 0.01 &&
      open(s, tx + dd[0], ty + dd[1])
    )
      s.player.dir = desired;
    const [vx, vy] = delta[s.player.dir],
      moving = api.input.value(s.player.dir) > 0 && open(s, tx + vx, ty + vy);
    s.player.moving = moving;
    if (moving) {
      s.player.x += vx * C.FORAGER_SPEED * dt;
      s.player.y += vy * C.FORAGER_SPEED * dt;
    }
    if (s.player.x < C.GRID_ORIGIN_X + 16)
      s.player.x = C.GRID_ORIGIN_X + (C.GRID_COLS - 1) * C.TILE + 16;
    if (s.player.x > C.GRID_ORIGIN_X + (C.GRID_COLS - 1) * C.TILE + 16)
      s.player.x = C.GRID_ORIGIN_X + 16;
    const [x, y] = pos(s, s.player.x, s.player.y);
    if (s.plankton[y][x] === "*") {
      s.plankton = setLayerLocal(s.plankton, x, y, "-");
      s.planktonRemaining--;
      s.score += C.SCORE_PLANKTON;
      s.player.brightness = Math.min(1, s.player.brightness + C.BRIGHT_PER_EAT);
      s.player.brightHold = C.BRIGHT_HOLD;
      api.audio.play(C.CUES.eat);
      if (!s.planktonRemaining) {
        s.score += C.SCORE_CLEAR;
        s.screen = "cleared";
        s.screenTimer = 0;
        api.audio.play(C.CUES.descend);
      }
    }
    if (press("a") && s.player.sonarCooldown <= 0) {
      s.pulses.push({
        source: "forager",
        tint: "cyan",
        ox: x,
        oy: y,
        front: 0,
        range: Math.max(C.SONAR_RANGE_MIN, C.SONAR_RANGE_BASE - s.depth + 1),
        caught: [],
      });
      s.player.sonarCooldown = C.SONAR_COOLDOWN;
      api.audio.play(C.CUES.sonar);
    }
    if (press("b") && s.player.inkCooldown <= 0) {
      s.inkClouds.push({
        x: s.player.x,
        y: s.player.y,
        radius: C.INK_RADIUS,
        remaining: C.INK_LIFE,
      });
      s.player.inkCooldown = C.INK_COOLDOWN;
      api.audio.play(C.CUES.ink);
    }
    s.player.sonarCooldown = Math.max(0, s.player.sonarCooldown - dt);
    s.player.inkCooldown = Math.max(0, s.player.inkCooldown - dt);
    if (s.player.brightHold > 0)
      s.player.brightHold = Math.max(0, s.player.brightHold - dt);
    else s.player.brightness *= Math.pow(0.5, dt / C.BRIGHT_HALFLIFE);
    s.inkClouds = s.inkClouds
      .map((c) => ({ ...c, remaining: c.remaining - dt }))
      .filter((c) => c.remaining > 0);
    s.pulses = s.pulses
      .map((p) => ({ ...p, front: p.front + C.SONAR_WAVE_SPEED * dt }))
      .filter((p) => p.front < p.range);
  }
  s = illuminate(s);
  return s;
}
function draw(s: DeepReadonly<FathomState>, api: RenderApi): void {
  const c = api.ctx;
  c.fillStyle = BACKGROUND;
  c.fillRect(0, 0, C.STAGE_W, C.STAGE_H);
  const R = C.KINDLE_VISION_MIN + C.KINDLE_VISION_GAIN * s.player.brightness;
  c.save();
  c.beginPath();
  c.arc(s.player.x, s.player.y, R, 0, Math.PI * 2);
  c.clip();
  for (let y = 0; y < C.GRID_ROWS; y++)
    for (let x = 0; x < C.GRID_COLS; x++) {
      const v = s.visibility[y][x],
        t = s.tiles[y][x],
        img =
          s.sprites["trench-walls"]?.[
            v === "u" ? 17 : t === "." ? 16 : t === "g" ? 18 : 15
          ];
      if (v === "u") {
        c.fillStyle = "#020911";
        c.fillRect(
          C.GRID_ORIGIN_X + x * C.TILE,
          C.GRID_ORIGIN_Y + y * C.TILE,
          C.TILE,
          C.TILE,
        );
      } else if (img)
        c.drawImage(
          img,
          C.GRID_ORIGIN_X + x * C.TILE,
          C.GRID_ORIGIN_Y + y * C.TILE,
        );
      else {
        c.fillStyle = t === "." ? "#12303a" : "#14242d";
        c.fillRect(
          C.GRID_ORIGIN_X + x * C.TILE,
          C.GRID_ORIGIN_Y + y * C.TILE,
          C.TILE,
          C.TILE,
        );
      }
      if (v !== "u" && s.plankton[y][x] === "*") {
        c.fillStyle = "#ffd46a";
        c.beginPath();
        c.arc(
          C.GRID_ORIGIN_X + x * C.TILE + 16,
          C.GRID_ORIGIN_Y + y * C.TILE + 16,
          3,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
    }
  for (const p of s.predators)
    if (
      Math.hypot(p.x - s.player.x, p.y - s.player.y) <
        C.VISION_MIN + C.VISION_GAIN * s.player.brightness ||
      p.alertTime > 0
    ) {
      const sheet = s.sprites[p.kind],
        frame =
          p.kind === "lanternjaw" && p.state === "wander"
            ? s.sprites.lanternjaw[8]
            : sheet?.[
                (
                  { down: 0, up: 2, left: 4, right: 6 } as Record<
                    string,
                    number
                  >
                )[p.dir]
              ];
      if (frame) c.drawImage(frame, p.x - 16, p.y - 16);
    }
  for (const d of s.drifters) {
    const im = s.sprites.drifter?.[0];
    if (im) c.drawImage(im, d.x - 16, d.y - 16);
  }
  const frame =
    s.sprites.glimmerfin?.[
      ({ down: 0, up: 2, left: 4, right: 6 } as Record<string, number>)[
        s.player.dir
      ]
    ];
  if (frame) c.drawImage(frame, s.player.x - 16, s.player.y - 16);
  c.restore();
  c.fillStyle = "#b8f5ff";
  c.font = "bold 48px monospace";
  c.fillText(String(s.score).padStart(6, "0"), 44, 58);
  c.font = "14px monospace";
  c.fillStyle = "#62a2b8";
  c.fillText(C.DIVE_LABEL, 270, 50);
  c.fillText(`DEPTH ${s.depth}`, 44, 694);
  c.fillText(`LIVES ${"● ".repeat(s.lives)}`, 245, 694);
  c.fillText(
    `SONAR ${s.player.sonarCooldown <= 0 ? "READY" : s.player.sonarCooldown.toFixed(1)}   INK ${s.player.inkCooldown <= 0 ? "READY" : s.player.inkCooldown.toFixed(1)}`,
    760,
    694,
  );
  if (
    s.screen === "title" ||
    s.screen === "howto" ||
    s.screen === "paused" ||
    s.screen === "gameover"
  ) {
    c.fillStyle = "rgba(2,9,17,.78)";
    c.fillRect(0, 0, C.STAGE_W, C.STAGE_H);
    c.textAlign = "center";
    c.fillStyle = "#c8f8ff";
    c.font = "bold 72px monospace";
    c.fillText(
      s.screen === "title"
        ? C.TITLE_TEXT
        : s.screen === "howto"
          ? "HOW TO PLAY"
          : s.screen === "paused"
            ? "PAUSED"
            : "DIVE OVER",
      640,
      235,
    );
    c.font = "22px monospace";
    c.fillStyle = "#75d8e8";
    if (s.screen === "title") {
      c.fillText(C.TAGLINE_TEXT, 640, 286);
      C.TITLE_ITEMS.forEach((v, i) =>
        c.fillText(`${s.menuIndex === i ? "› " : "  "}${v}`, 640, 420 + i * 58),
      );
    } else if (s.screen === "howto") {
      [
        "ARROWS / WASD  swim through the dark",
        "SPACE  sonar reveals corridors and marks sound",
        "SHIFT  release ink to blind light hunters",
        "Lanternjaw hunts your glow • Gloamfin hears",
        "Flarefish blooms bright enough to reveal the maze",
        "Press ENTER or ESC to return",
      ].forEach((v, i) => c.fillText(v, 640, 340 + i * 42));
    } else {
      const items = s.screen === "paused" ? C.PAUSE_ITEMS : C.GAMEOVER_ITEMS;
      items.forEach((v, i) =>
        c.fillText(`${s.menuIndex === i ? "› " : "  "}${v}`, 640, 410 + i * 58),
      );
    }
    c.textAlign = "left";
  }
  if (s.screen === "countdown") {
    c.fillStyle = "#b8f5ff";
    c.font = "bold 48px monospace";
    c.fillText("DIVE", 570, 365);
  }
  if (s.screen === "cleared") {
    c.fillStyle = "#b8f5ff";
    c.font = "bold 42px monospace";
    c.fillText(`DEPTH ${s.depth} CLEARED`, 420, 365);
  }
}
export const game: Game<FathomState, FathomDebugApi> = {
  async initialize(api) {
    for (const n of C.ACTIONS)
      api.input.register(n, { keys: [...C.BINDINGS[n]] });
    const cues = Object.values(C.CUES);
    for (let i = 0; i < cues.length; i++)
      api.audio.define(cues[i], {
        freq: 240 + i * 90,
        freqTo: 180 + i * 60,
        durationMs: 110,
        gain: 0.13,
      });
    const sheets: [
      [string, number],
      [string, number],
      [string, number],
      [string, number],
      [string, number],
      [string, number],
      [string, number],
    ] = [
      ["glimmerfin", 8],
      ["lanternjaw", 16],
      ["gloamfin", 8],
      ["flarefish", 8],
      ["drifter", 8],
      ["flare-bloom", 8],
      ["trench-walls", 19],
    ];
    const loaded = await Promise.all(
      sheets.map(
        async ([name, n]) =>
          [
            name,
            await Promise.all(
              Array.from({ length: n }, (_, i) =>
                api.assets.loadImage(`${name}/${i}.png`),
              ),
            ),
          ] as const,
      ),
    );
    const state = baseState(Object.fromEntries(loaded));
    for (const [k, fn] of Object.entries({
      screen: (v: DeepReadonly<FathomState>) => v.screen,
      depth: (v: DeepReadonly<FathomState>) => v.depth,
      score: (v: DeepReadonly<FathomState>) => v.score,
      lives: (v: DeepReadonly<FathomState>) => v.lives,
      G: (v: DeepReadonly<FathomState>) => v.player.brightness,
      V: (v: DeepReadonly<FathomState>) =>
        C.VISION_MIN + C.VISION_GAIN * v.player.brightness,
      R: (v: DeepReadonly<FathomState>) =>
        C.KINDLE_VISION_MIN + C.KINDLE_VISION_GAIN * v.player.brightness,
      plankton: (v: DeepReadonly<FathomState>) => v.planktonRemaining,
    }))
      api.diagnostics.register(k, fn);
    return [state, makeDebug()];
  },
  update(s, api, dt) {
    let next = {
      ...s,
      player: { ...s.player },
      accumulator: s.accumulator + Math.min(0.25, dt),
    } as FathomState;
    while (next.accumulator >= C.TICK_DT) {
      next.accumulator -= C.TICK_DT;
      next = step(next, api);
    }
    return next;
  },
  render: draw,
};
