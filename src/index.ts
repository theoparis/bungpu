import { ptr, CString, dlopen, FFIType, suffix } from "bun:ffi";

const path = `libraylib.${suffix}`;

const { symbols: libui } = dlopen(path, {
  InitWindow: {
    args: [FFIType.i32, FFIType.i32, FFIType.cstring],
    returns: FFIType.void,
  },
  WindowShouldClose: {
    args: [],
    returns: FFIType.bool,
  },
  BeginDrawing: {
    args: [],
    returns: FFIType.void,
  },
  EndDrawing: {
    args: [],
    returns: FFIType.void,
  },
  CloseWindow: {
    args: [],
    returns: FFIType.void,
  },
  ClearBackground: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  DrawText: {
    args: [FFIType.cstring, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.ptr],
    returns: FFIType.void,
  },
});

export const getColor = (color: [number, number, number, number]): number =>
  (color[0] & 0xff) |
  ((color[1] & 0xff) << 8) |
  ((color[2] & 0xff) << 16) |
  ((color[3] & 0xff) << 24);

export enum Color {
  white = getColor([255, 255, 255, 255]),
  black = getColor([0, 0, 0, 255]),
}

export class Context {
  background(color: number) {
    libui.ClearBackground(color);
  }

  text(x: number, y: number, text: string, fontSize = 16, color = Color.white) {
    libui.DrawText(ptr(Buffer.from(text)), x, y, fontSize, color);
  }
}

export class Window {
  private context = new Context();

  constructor(title: string, width: number, height: number) {
    libui.InitWindow(width, height, ptr(Buffer.from(title)));
  }

  draw(callback: (ctx: Context) => void) {
    while (!libui.WindowShouldClose()) {
      libui.BeginDrawing();
      callback(this.context);
      libui.EndDrawing();
    }
  }

  close() {
    libui.CloseWindow();
  }
}
