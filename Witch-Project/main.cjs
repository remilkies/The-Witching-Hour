const { app, BrowserWindow, shell } = require('electron');
const path = require('path');



//REGISTERING THE CUSTOM IN APP PROTOCOL

if (process.defaultApp){
    if (process.argv.length >= 2){
        app.setAsDefaultProtocolClient('witchinghour', process.execPath, [path.resolve(process.argv[1])]);
    } else {
        app.setAsDefaultProtocolClient('witchinghour');
    }
    } else {
        //LIFESAVING PRODUCTION SHIELD:
        //forces the dmg. application to register the deep link with macOS (i hate apple)
        app.setAsDefaultProtocolClient('witchinghour');
}

// ==========================================
// THE SINGLE INSTANCE LOCK (CRITICAL FOR WINDOWS)
// ==========================================
// p.s I'm not a windows user besides when i play league of legends on my PC so you're welcom windows users <3

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    //This is a duplicate Windos instance trying to open from a deep-link
    //this executes (in case case murder) it immidietly so it doesn't open a ghost window
    app.quit();
} else {
    //this is the primary window. Listen for Windows deep links coming from duplicate attempts
    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore(); //stupid Electrom API using strictly american spelling with a dumbass "z"
            mainWindow.focus();
        }

        // On windows the deep link URL string is stuffed inside the commandLine arguements array
        const url = commandLine.find(arg => arg.startsWith('witchinghour://'));
        if (url) {
            console.log('🔮 WINDOWS DEEP LINK CAUGHT:', url);
            sendDeepLinkToFrontend(url);
        }
        
    });

    // main initilisation
    app.whenReady().then(createWindow);
}

let mainWindow; //defined outside so the whole file can use it
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "The Witching Hour",
        backgroundColor: "#3A2D34",
        webPreferences: { //ADDED THIS SO THE TIMER KEEPS RUNNING IN THE BACKGROUND EVEN WHEN I MINIMISE IT OR GO INTO OTHER APPS
            nodeIntegration: true,
            contextIsolation: false, // Make sure this is false if using nodeIntegration!
            backgroundThrottling: false,
        }
    });

    // NEW SPELL: THE EXTERNAL PORTAL GAURD
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url); //force it to open in Chrom/Safari T-T
            return { action: 'deny' }; //stop electron from opening a new electron window
        }
        return { action: 'allow'};
    });

    if (app.isPackaged){
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('http://localhost:5173');
    }

    // WINDOWS FALLBACK: cheak if the app was completly closed on Windows and opend BY a deep link
    mainWindow.webContents.on('did-finish-load', () => {
        const url = process.argv.find(arg => arg.startsWith('witchinghour://'));
        if (url && process.platform !== 'darwin') {
            mainWindow.webContents.send('spotify-deep-link', url);
        }
    });
}

// app.whenReady().then(createWindow);

// ==========================================
// CATCH THE MAC OS DEEP LINK
// ==========================================

app.on('open-url', (event, url) => {
    event.preventDefault(); //stop MacOS from doing its default wierd stuff (even in code apple contunies to be the bane of my existance)
    console.log('🔮 DEEP LINK CAUGHT:', url);
    sendDeepLinkToFrontend(url);

    


})

function sendDeepLinkToFrontend(url) {
    //wait for the app to be ready, then send the URL into the React frontend
    if (mainWindow) {
        if (mainWindow.webContents.isLoading()){
            mainWindow.webContents.once('did-finish-load', () => {
                mainWindow.webContents.send('spotify-deep-link', url);
            });
        } else {
            mainWindow.webContents.send('spotify-deep-link', url);
        }
    }
}

// just standard lifecycle hooks
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