const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const isDev = process.argv.includes('--dev');
const PORT = 54200;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.map': 'application/json',
  '.txt': 'text/plain',
};

function startServer(wwwPath) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(wwwPath, req.url === '/' ? 'index.html' : req.url);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(wwwPath, 'index.html');
      }
      const ext = path.extname(filePath);
      const contentType = MIME[ext] || 'application/octet-stream';
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading file');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
    server.listen(PORT, () => {
      console.log(`Electron server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function createWindow() {
  const wwwPath = path.join(__dirname, '..', 'www');

  if (!isDev) {
    await startServer(wwwPath);
  }

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    icon: path.join(__dirname, '..', 'www', 'assets', 'icon', 'favicon.png'),
  });

  if (isDev) {
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    win.loadURL(`http://localhost:${PORT}`);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
