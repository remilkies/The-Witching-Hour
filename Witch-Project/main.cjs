const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "The Witching Hour",
        backgroundColor: "#3A2D34",
        webPreferences: { //ADDED THIS SO THE TIMER KEEPS RUNNING IN THE BACKGROUND EVEN WHEN I MINIMISE IT OR GO INTO OTHER APPS
            nodeIntegration: true,
            backgroundThrottling: false,
        }
    });

    if (app.isPackaged){
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('http://localhost:5173');
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});