/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu, Tray, screen, nativeImage } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import Store from "electron-store";
import path from 'path';
import fs from 'fs';

const { autoUpdater } = pkg;
const store = new Store();
const __dirname = path.resolve();

const URL_HOME = process.platform === 'darwin' ? 
(isDev ? 'http://localhost:4200/' : `file://${path.join(process.resourcesPath, 'app', 'dist', 'stmanagement', 'browser', 'index.html')}`) : 
(isDev ? 'http://localhost:4200/' : `file://${path.join(__dirname, 'resources', 'app', 'dist', 'stmanagement', 'browser', 'index.html')}`);
const ASSETS = process.platform === 'darwin' ?
(isDev ? path.join(__dirname, 'src', 'assets') : path.join(process.resourcesPath, 'app', 'src', 'assets')) :
(isDev ? path.join(__dirname, 'src', 'assets') : path.join(__dirname, 'resources', 'app', 'src', 'assets'));
const CHANGELOG = process.platform === 'darwin' ?
(isDev ? path.join(__dirname, 'CHANGELOG.md') : path.join(process.resourcesPath, 'app', 'CHANGELOG.md')) :
(isDev ? path.join(__dirname, 'CHANGELOG.md') : path.join(__dirname, 'resources', 'app', 'CHANGELOG.md'));
const ICON = process.platform === 'darwin' ?
(isDev ? path.join(__dirname, 'src', 'assets', 'icon.icns') : path.join(process.resourcesPath, 'app', 'src', 'assets', 'icon.icn')) :
(isDev ? path.join(__dirname, 'src', 'assets', 'icon.png') : path.join(__dirname, 'resources', 'app', 'src', 'assets', 'icon.png'));
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

/**
 * * Propiedades de AutoUpdater
 */
autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

/**
 * * Declaraciones de Variables
 */
let appWin;
let tray = null;

/**
 * * Función de ventana principal
 */
function appInit() {
    //Instancia para una nueva ventana
    appWin = new BrowserWindow(
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
    appWin.loadURL(URL_HOME);
    if(process.platform === 'win32') appWin.setMenu(MENU);
    if(isDev) appWin.webContents.openDevTools({ mode: 'detach' });
    
    //Cuando la ventana está lista para ser mostrada...
    appWin.once( "ready-to-show", () => {
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
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    //Se crea la app..
    appInit();
    if(process.platform === 'darwin') Menu.setApplicationMenu(MENU);
    //Si estamos en windows...
    if(process.platform === 'win32') {
        //Se crea una instancia de 'Tray' (Icono en la barra de tareas)
        tray = new Tray(ICON);
        //Se crea un nombre para la bandeja
        tray.setToolTip('STManagement');
        //Se crea un menu para la bandeja
        tray.setContextMenu(Menu.buildFromTemplate([ {label: 'Salir', click: () => app.quit()} ]));
    }
});

/**
 * * Acciones para cerrar la App
 */
app.on( "window-all-closed", () => { app.quit() });

/**
 * * Comunicación entre procesos
 */
//Guarda los datos de inicio de sesion en el store
ipcMain.on('setLogin', (event, args) => { store.set('loginData', args) });
//Obtiene los datos del usuario
ipcMain.on('checkLogin', (event, args) => { event.sender.send('checkLogin', store.get('loginData', false)) });
//Elimina del store el login guardado
ipcMain.on('deleteLogin', (event, args) => { store.delete('loginData') });
//Comprueba la bandera de que se ha instalado una nueva actualizacion
ipcMain.on('checkChangeLog', (event, args) => { event.sender.send('checkChangeLog', store.get('changeLog', false)) });
//Elimina del store la bandera de la instalacion de la nueva actualizacion
ipcMain.on('deleteChangeLog', (event, args) => {
    try { store.delete('changeLog'); event.sender.send('deleteChangeLog', '001'); } 
    catch (error) { event.sender.send('deleteChangeLog', '002'); }
});
//Obtiene la info del fichero CHANGELOG.md
ipcMain.on('getChangeLog', (event, args) => {
    const path = isDev ? PATH_CHANGELOG_DEV : PATH_CHANGELOG_PROD;
    fs.readFile(path, 'utf8', (err, data) => { event.sender.send('getChangeLog', data) });
});

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'getVersion', ( event, args ) => { event.sender.send( 'getVersion', app.getVersion() ) });

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
    autoUpdater.on( 'update-downloaded', () => {
        store.set('changeLog', true);
        appWin.webContents.send( 'update_downloaded' );
    });
    autoUpdater.on( 'error', ( error ) => {
        const path = isDev ? PATH_ASSETS_DEV : PATH_ASSETS_PROD;
        fs.writeFile(`${path}/log.txt`, error, (errorReq) => {
            appWin.webContents.send( 'error_update' );
        });
    });
};