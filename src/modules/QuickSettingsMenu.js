/* exports CaffeinateIndicator */
/**
 *  Caffeinate Gnome Shell Extension
 *  Authors: John D. Stray <gnome-extensions@johnstray.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Import necessary libraries
const {Gio, GObject} = imports.gi;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const MessageTray = imports.ui.messageTray;
const QuickSettings = imports.ui.quickSettings;
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

// Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Import required modules
const GameModeClient = Me.imports.modules.GameModeClient;

// Logging debug and error message control
var CAFFEINATE_DEBUG_MSG = 'Debug';
var CAFFEINATE_ERROR_MSG = 'Error';

/**
 * The Caffeinate Toggle Menu class
 */
const CaffeinateToggleMenu = GObject.registerClass(
    class CaffeinateToggleMenu extends QuickSettings.QuickMenuToggle {
        /**
         * Initialize this class
         */
        _init() {
            super._init({
                label: 'Caffeinate',
                gicon: Gio.icon_new_for_string(`${Me.path}/icons/caffeinate-off-symbolic.svg`),
                toggleMode: true
            });

            // Get the extension settings
            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.caffeinate');

            // Manage all Gjs connections
            this._connections = new Map();
            this.connect('destroy', this._onDestroy.bind(this));

            // Source for notifications
            this._notifySource = null;

            // Connect to GameMode Client
            this._gameModeClient = new GameModeClient.Client(null);

            // ----- React to things ----

            // React to session changes
            this._connect(Main.sessionMode, 'updated', this._sync.bind(this));

            // React to GameMode state changes
            this._connect(this._gameModeClient, 'state-changed', this._onGameModeStateChanged.bind(this));

            // Build the Caffeinate menu
            this._buildMenu();
        }

        /**
         * Destroy this class
         */
        _onDestroy() {
            this._logMessage(CAFFEINATE_DEBUG_MSG, 'Destroying class...');
            this._disconnectAll();
            this._client.close();
            this._logMessage(CAFFEINATE_DEBUG_MSG, 'Class destroyed!');
        }

        /**
         * Attempt to connect a Gjs connection
         *
         * @param {object} target -
         * @param {string} signal -
         * @param {Function} hook -
         */
        _connect(target, signal, hook) {
            this._logMessage(CAFFEINATE_DEBUG_MSG, `this._connect called with\ntarget: ${target}\nsignal: ${signal}\nhook: ${hook}`);
            if (target) {
                if (!this._connections.has(target))
                    this._connections.set(target, new Set());

                const set = this._connections.get(target);
                let id;

                this._logMessage(CAFFEINATE_DEBUG_MSG, `Trying target.connect(${signal}, ${hook})`);
                try {
                    id = target.connect(signal, hook);
                } catch (error) {
                    this._logMessage(CAFFEINATE_ERROR_MSG, `Failed to connect target.connectSignal(${signal}, ${hook})`);
                    id = target.connectSignal(signal, hook);
                }

                this._logMessage(CAFFEINATE_DEBUG_MSG, `Calling set.add(${id})`);
                set.add(id);
            }
        }

        /**
         * Disconnect all Gjs connections
         */
        _disconnectAll() {
            for (const [target, ids] of this._conncetions) {
                if (target) {
                    for (const id of ids) {
                        try {
                            target.disconnect(id);
                        } catch (error) {
                            try {
                                target.disconnectSignal(id);
                            } catch (err) {
                                this._logMessage(CAFFEINATE_ERROR_MSG, `Unable to disconnect signal with disconnect(${id})`);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Build the Caffeinate menu
         */
        _buildMenu() {
            // Menu Header - Using _sync() to set the current menu header
            this._sync();

            // Toggle Caffeination Menu Item
            this._toggleCaffeinationItem = new PopupMenu.PopupMenuSection();
            this.menu.addMenuItem(this._toggleCaffeinationItem);
            this._toggleCaffeinationItem.addAction(
                'Enable Caffeination...',
                () => this._toggleCaffeination('enable')
            );

            // Toggle GameMode Menu item
            this._enableGameModeItem = new PopupMenu.PopupMenuSection();
            this.menu.addMenuItem(this._enableGameModeItem);
            this._enableGameModeItem.addAction(
                'Enable GameMode...',
                () => this._toggleGameMode('enable')
            );

            // Entry-point for extension prefs dialogue
            this._extensionPrefsItem = new PopupMenu.PopupSeparatorMenuItem();
            this.menu.addMenuItem(this._extensionPrefsItem);
            const settingsItem = this.menu.addAction(
                'Extension Preferences',
                () => ExtensionUtils.openPrefs()
            );

            // Ensure the settings are unavailable when the screen is locked
            settingsItem.visible = Main.sessionMode.allowSettings;
            this.menu._settingsActions[Me.uuid] = this._extensionPrefsItem;
        }

        /**
         * Show a notification message
         *
         * @param {string} title - The title of the notification
         * @param {string} body - The body content of the notification
         */
        _notify(title, body) {
            if (this._notification)
                this._notification.destroy();

            if (!this._notifySource) {
                this._notifySource = new MessageTray.Source('Caffeinate', 'applications-games-symbolic');
                this._notifySource.connect('destroy', () => {
                    this._notifySource = null;
                });
                Main.messageTray.add(this._notifySource);
            }

            this._notification = new MessageTray.Notification(this._notifySource, title, body);
            this._notification.setUrgency(MessageTray.Urgency.HIGH);
            this._notification.connect('destroy', () => {
                this._notification = null;
            });
            this.notifySource.showNotification(this._notification);
        }

        /**
         * Sync the elements of the Caffeinate menu with the actual states
         */
        _sync() {
            // Check status of Caffeination
            // @TODO: Write a method to check the state
            let caffeinationState = false;

            // Check status of GameMode
            let gameModeState = false;
            if (this._gameModeClient.clientCount > 0)
                gameModeState = true;

            // Set menu header icon and status text
            if (gameModeState) {
                this.menu.setHeader(
                    Gio.icon_new_for_string(`${Me.path}/icons/gamemode-on-symbolic.svg`),
                    'Caffeinate [GameMode]',
                    'GameMode is currently active'
                );
            } else if (caffeinationState) {
                this.menu.setHeader(
                    Gio.icon_new_for_string(`${Me.path}/icons/caffeinate-on-symbolic.svg`),
                    'Caffeinate [Enabled]',
                    'Caffeination is currently active'
                );
            } else {
                this.menu.setHeader(
                    Gio.icon_new_for_string(`${Me.path}/icons/$caffeinate-off-symbolic.svg`),
                    'Caffeinate [Disabled]',
                    'Enable/Disable auto-suspend and screensaver'
                );
            }

            // Set indicator icon and state
            // @TODO: Can we do this from here?
        }

        /**
         * Toggle the state of Caffeination
         *
         * @param {string} state -
         */
        // @TODO: Write this method
        _toggleCaffeination(state) {
            
        }

        /**
         * Toggle the state of GameMode
         *
         * @param {string} state - The mode to toggle the state to
         */
        // @TODO: Finish writing this method
        _toggleGameMode(state) {
            this._logMessage(CAFFEINATE_DEBUG_MSG, `GameMode toggle requested. Rstate = ${state}`);

            // Set GameMode to the requested state
            if (state === 'enable') {
                // Check if GameMode is already active
                if (this._gameModeClient.clientCount === 0) {
                    // Create a process with a PID file and get that PID
                    // this._gameModeClient.registerGame(pid, callback)
                } else {
                    this._logMessage(CAFFEINATE_DEBUG_MSG, 'GameMode enable toggle ignored, already active');
                }
            } else if (state === 'disable') {
                // IF Check if we are holding the GameMode state, look for PID file
                // this._gameModeClient.unregisterGame(pid, callback)
                // ELSE
                this._logMessage(CAFFEINATE_DEBUG_MSG, 'GameMode disable toggle ignored, we are not currently holding it');
            }
        }

        /**
         * CaffeinateClient.Client callbacks
         *
         * @param {object} cli -
         * @param {string} state -
         */
        _onCaffeinateStateChanged(cli, state) {
            if (this._settings.get_boolean('caffeinate-enable-notifications')) {
                if (state)
                    this._notify('Caffeination is active', 'Computer is inhibited from entering sleep state or screensaver');
                else
                    this._notify('Caffeination is off', 'Computer is able to enter sleep state or screensaver');
            }

            this._sync();
        }

        /**
         * GameModeClient.Client callbacks
         *
         * @param {object} cli -
         * @param {string} state -
         */
        _onGameModeStateChanged(cli, state) {
            if (this._settings.get_boolean('gamemode-enable-notifications')) {
                if (state)
                    this._notify('GameMode is active', 'Computer performance is now optimized for playing games');
                else
                    this._notify('GameMode is off', 'Computer performance is reset for normal usage');
            }

            this._sync();
        }

        /**
         * Check msgtype and determine whether to write a message to the log. Write if the
         * message type is not CAFFEINATE_DEBUG_MSG or if the debug setting is enabled
         *
         * @param {string} msgtype -
         * @param {string} msgcontent -
         */
        _logMessage(msgtype, msgcontent) {
            if ((msgtype !== CAFFEINATE_DEBUG_MSG) || this._settings.get_boolean('debug-logging')) {
                msgcontent = msgcontent.replace(/\n/g, `\nCaffeinate Extension - QuickSettingsMenu: ${msgtype}: `);
                log(`Caffeinate Extension - QuickSettingsMenu: ${msgtype}: ${msgcontent}`);
            }
        }
    }
);

/**
 * The Caffeinate Indicator class
 */
var CaffeinateIndicator = GObject.registerClass(
    class CaffeinateIndicator extends QuickSettings.SystemIndicator {
        _init() {
            super._init();

            // Get the extension settings
            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.caffeinate');

            // Create the indicator
            this._indicator = this._addIndicator();
            this._indicator.gicon = Gio.icon_new_for_string(`${Me.path}/icons/caffeinate-off-symbolic.svg`);

            // Show the indicator when enabled in settings
            this._settings.bind('show-indicator',
                this._indicator, 'visible',
                Gio.SettingsBindFlags.DEFAULT
            );

            // Create the toggle and associate it with the indicator,
            // being sure to destroy it along with the indicator
            this.quickSettingsItems.push(new CaffeinateToggleMenu());
            this.connect('destroy', () => {
                this.quickSettingsItems.forEach(item => item.destroy());
            });

            // Add the indicator to the panel and the toggle to the menu
            QuickSettingsMenu._indicators.add_child(this);
            QuickSettingsMenu._addItems(this.quickSettingsItems);
        }
    }
);


