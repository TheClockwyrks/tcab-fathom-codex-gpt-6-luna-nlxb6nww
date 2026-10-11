import { describe, expect, it } from "vitest";
import { BACKGROUND } from "./game";

describe("Fathom", () => {
  it("uses a dark water color for the canvas and letterbox", () => {
    expect(BACKGROUND).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
