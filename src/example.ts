import { Window, Color } from "./index";

const mainWindow = new Window("bunray window", 500, 500);
mainWindow.draw((ctx) => {
  ctx.background(Color.black);
  ctx.text(150, 225, "Hello, World!", 36);
});
mainWindow.close();
