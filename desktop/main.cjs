/* DisFuse desktop shell: opens the live DisFuse web app in its own window.
   Based on DisFuse by Millionxsam and contributors
   (https://github.com/Millionxsam/DisFuse), CC BY-NC-SA 4.0. */

const { app, BrowserWindow, shell } = require("electron");

const APP_URL = "https://disfuse.xyz";

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "DisFuse",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });

  /* Links to other sites (docs, Discord invite, Stripe) open in the browser. */
  const isInApp = (url) => new URL(url).origin === APP_URL;
  const isDiscordLogin = (url) => new URL(url).origin === "https://discord.com";

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!isInApp(url) && !isDiscordLogin(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (isInApp(url) || isDiscordLogin(url)) return; // sign-in redirects stay in the window
    event.preventDefault();
    shell.openExternal(url);
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
