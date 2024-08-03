/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu, Tray, screen, nativeImage } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import Store from "electron-store";
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import { Agent } from "https";
import { exec } from 'child_process';

const { autoUpdater } = pkg;
const store = new Store();
const __dirname = path.resolve();

const URL_POST = 'https://rivendel.com.es/query.php';
const URL_HOME = isDev ? 'http://localhost:4200/' : `file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'browser', 'index.html')}`;
const URL_PRELOAD = isDev ? 'http://localhost:4200#/Preload' : `file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'browser', 'index.html')}#/Preload`;
const URL_LOGIN = isDev ? 'http://localhost:4200#/Login' : `file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'browser', 'index.html')}#/Login`;
const ASSETS = isDev ? path.join(__dirname, 'src', 'assets') : path.join(process.resourcesPath, 'app.asar', 'src', 'assets');
const CHANGELOG = isDev ? path.join(__dirname, 'CHANGELOG.md') : path.join(process.resourcesPath, 'app.asar', 'CHANGELOG.md');
const ICON = isDev ? path.join(__dirname, 'src', 'assets', process.platform === 'darwin' ? 'icon.icns' : 'icon.png') : path.join(process.resourcesPath, 'app.asar', 'src', 'assets', process.platform === 'darwin' ? 'icon.icns' : 'icon.png');
const ICON_NATIVE = nativeImage.createFromPath(ICON);
const MENU_TEMPLATE = isDev ? [
    {
        label: process.platform === 'darwin' ? app.name : 'Archivo',
        submenu: [
            { role: 'toggledevtools' },
            { label: 'Comprobar Actualizaciones', click: () => autoUpdater.checkForUpdatesAndNotify() }
        ]
    }
] : [
    {
        label: process.platform === 'darwin' ? app.name : 'Archivo',
        submenu: [
            { label: 'Comprobar Actualizaciones', click: () => autoUpdater.checkForUpdatesAndNotify() }
        ]
    }
];
const MENU = Menu.buildFromTemplate( MENU_TEMPLATE );
const MENU_TRY_TEMPLATE = [ {label: 'Salir', click: () => app.quit()} ];
const MENU_TRY = Menu.buildFromTemplate( MENU_TRY_TEMPLATE );

/**
 * * Propiedades de AutoUpdater
 */
autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;
autoUpdater.setMaxListeners(20);

/**
 * * Declaraciones de Variables
 */
let appWin;
let appPreload;
let appLogin;
let tray = null;

/**
 * * Función de ventana principal
 */
function appInit() {
    //Instancia para una nueva ventana
    appPreload = new BrowserWindow(
        { 
            width: 600, 
            height: 400,
            resizable: false,
            x: Math.round( (screen.getPrimaryDisplay().workAreaSize.width - 600) / 2 ),
            y: Math.round( (screen.getPrimaryDisplay().workAreaSize.height - 400) / 2 ), 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            icon: ICON_NATIVE,
            frame: false
        });
    appPreload.loadURL(URL_PRELOAD);
    appPreload.setMenu(null);
    //Cuando la ventana está lista para ser mostrada...
    appPreload.once( "ready-to-show", async () => {
        //Verifica si hay datos de usuario en el store
        if(store.get('loginData')) {
            try {
                const agent = new Agent({ rejectUnauthorized: false });
                const response = await fetch(URL_POST, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    agent,
                    body: JSON.stringify({
                        code: '004',
                        data: store.get('loginData')
                    })
                });
                const data = await response.json();
                //Si el usuario no existe o la contraseña no es correcta o el usuario está deshabilitado...
                if(data.response === '002' || data.response === '003' || data.response === '004') {
                    setTimeout(() => {
                        //Se cierra appPreload
                        appPreload.close();
                        //Se muestra el login
                        login();
                    }, 2000);
                }else {
                    //Se guardan los datos del usuario en el store
                    store.set('userData', data.data);
                    setTimeout(() => {
                        //Se cierra appPreload
                        appPreload.close();
                        //Se muestra el Home
                        home();
                    }, 2000);
                }
            } catch (error) {
                console.log('Error: ', error);
            }
        }else {
            setTimeout(() => {
                //Se cierra appPreload
                appPreload.close();
                //Se muestra el login
                login();
            }, 2000);
        }
    });
    //Cuando se llama a .close() la ventana Preload se cierra
    appPreload.on( "closed", () => appPreload = null );
};

function login() {
    //Instancia para una nueva ventana
    appLogin = new BrowserWindow(
        { 
            width: 950, 
            height: 720,
            resizable: false,
            x: Math.round( (screen.getPrimaryDisplay().workAreaSize.width - 950) / 2 ),
            y: Math.round( (screen.getPrimaryDisplay().workAreaSize.height - 720) / 2 ), 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            icon: ICON_NATIVE
        });
    appLogin.loadURL(URL_LOGIN);
    appLogin.setMenu(null);
    if(isDev) appLogin.webContents.openDevTools({ mode: 'detach' });
    //Cuando la ventana está lista para ser mostrada...
    appLogin.once( "ready-to-show", () => { });
    //Cuando se llama a .close() la ventana principal se cierra
    appLogin.on( "closed", () => appLogin = null );
}

function home() {
    //Instancia para una nueva ventana
    appWin = new BrowserWindow(
        { 
            width: 950, 
            height: 730,
            resizable: false,
            x: Math.round( (screen.getPrimaryDisplay().workAreaSize.width - 950) / 2 ),
            y: Math.round( (screen.getPrimaryDisplay().workAreaSize.height - 720) / 2 ), 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            icon: ICON_NATIVE
        });
    appWin.loadURL(URL_HOME);
    if(process.platform === 'win32') appWin.setMenu(MENU);
    if(isDev) appWin.webContents.openDevTools({ mode: 'detach' });
    
    //Cuando la ventana está lista para ser mostrada...
    appWin.once( "ready-to-show", () => {
        appWin.webContents.send('getUserData', { data: store.get('userData'), version: app.getVersion() });
        //UPDATES DE PRUEBA
        /*if(isDev) {
            autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
            autoUpdater.forceDevUpdateConfig = true; 
        }*/
        //Pone a la escucha la comprobación de actualizaciones
        autoUpdater.checkForUpdatesAndNotify();
        //Pone a la escucha los eventos de actualizaciones
        checks();
    });
    //Cuando se llama a .close() la ventana principal se cierra
    appWin.on( "closed", () => appWin = null );
}

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    //Se crea la app..
    appInit();
    //Si estamos en macOs establece la barra de menu General
    if(process.platform === 'darwin') Menu.setApplicationMenu(MENU);
    //Si estamos en Windows...
    else {
        //Se crea una instancia de 'Tray' (Icono en la barra de tareas)
        tray = new Tray(ICON_NATIVE);
        //Se crea un nombre para la bandeja
        tray.setToolTip('STManagement');
        //Se crea un menu para la bandeja
        tray.setContextMenu(MENU_TRY);
    }
});

// Manejar promesas rechazadas globalmente
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * * Acciones para cerrar la App
 */
app.on( "window-all-closed", () => { app.quit() });

/**
 * * Comunicación entre procesos
 */
//Obtiene los datos del usuario
ipcMain.on('checkLogin', (event, args) => { event.sender.send('checkLogin', store.get('loginData', false)) });
//Elimina del store el login guardado
ipcMain.on('deleteLogin', (event, args) => { store.delete('loginData') });
//Comprueba la bandera de que se ha instalado una nueva actualizacion
ipcMain.on('checkChangeLog', (event, args) => { event.sender.send('checkChangeLog', store.get('changeLog', false)) });
//Elimina del store la bandera de la instalacion de la nueva actualizacion
ipcMain.on('deleteChangeLog', (event, args) => { store.delete('changeLog'); });
//Obtiene la info del fichero CHANGELOG.md
ipcMain.on('getChangeLog', (event, args) => { fs.readFile(CHANGELOG, 'utf8', (err, data) => { event.sender.send('getChangeLog', data) }) });
//Escucha para abrir la ventana del home
ipcMain.on('loginSuccess', (event, args) => {
    //Guarda los datos del usuario logueado en el storage
    store.set('userData', args.userData);
    //Guarda los datos de inicio de sesion en el store
    store.set('loginData', args.loginData);
    //Cierra la ventana de login
    appLogin.close();
    //abre la ventana principal
    home();
});

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//COMPRUEBA ACTUALIZACIONES
ipcMain.on('checkUpdates', (event, args) => { checkUpdates(args) });

/**
 * * Eventos de Actualizaciones Automáticas
*/
const checks = () => {
    autoUpdater.on( 'checking-for-update', () => {
        appWin.webContents.send( 'checking_for_update' );
    });
    autoUpdater.on( 'update-available', ( info ) => {
        appWin.webContents.send( 'update_available', info );
    });
    autoUpdater.on( 'update-not-available', () => {
        appWin.webContents.send( 'update_not_available' );
    });
    autoUpdater.on( 'download-progress', ( progressObj ) => {
        appWin.webContents.send( 'download_progress', Math.trunc( progressObj.percent ) );
    });
    autoUpdater.on( 'update-downloaded', (info) => {
        const downloadedFilePath = info.downloadedFile;
        // Eliminar el atributo `quarantine`
        exec(`xattr -d com.apple.quarantine "${downloadedFilePath}"`, (error, stdout, stderr) => {
            store.set('changeLog', true);
            appWin.webContents.send( 'update_downloaded' );
        });
    });
    autoUpdater.on( 'error', ( error ) => {
        store.set('logUpdate', error);
        appWin.webContents.send( 'error_update', store.get('logUpdate') );
    });
};