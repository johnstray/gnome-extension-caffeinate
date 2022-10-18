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
const Main = imports.ui.main;

// Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Import Modules
const CaffeinateMenu = Me.imports.modules.QuickSettingsMenu;


// Initialize translations
const Gettext = imports.gettext.domain(Me.metadata.uuid);
const _ = Gettext.gettext;

// Logging debug and error message control
var CAFFEINATE_DEBUG_MSG = 'Debug';
var CAFFEINATE_ERROR_MSG = 'Error';

/**
 * The extension class
 */
class Extension {
    /**
     * Class Constructor
     */
    constructor() {
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.caffeinate');
        this._indicator = null;

        // Map all Gjs connections
        this._connections = new Map();

        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Extension constructed');
    }

    /**
     * Enable extension when the user logs in
     */
    enable() {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Enabling extension...');

        // Watch for changes to the session mode
        this._connect(Main.sessionMode, 'updated', this._onSessionModeChanged.bind(this));

        // Add the Indicator to the QuickSettings menu
        if (this._settings.get_boolean('show-in-quickmenu'))
            this._addIndicator();

        // React to settings changes
        this._connect(this._settings, 'changed::show-in-quickmenu', this._toggleIndicator.bind(this));

        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Extension enabled!');
    }

    /**
     * Disable the extension when the user logs out
     */
    disable() {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Disabling extension...');

        // Disconnect signals
        this._disconnectAll();

        // Remove the Indicator from the QuickSettings menu
        this._removeIndicator();

        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Extension disabled!');
    }

    /**
     * Attempt to connect a Gjs connection
     *
     * @param {object} target - The Gjs object to connect to
     * @param {string} signal - The signal to listen to
     * @param {Function} hook - The function to invoke when the signal is emitted
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
     * Check msgtype and determine whether to write a message to the log. Write if the
     * message type is not CAFFEINATE_DEBUG_MSG or if the debug setting is enabled
     *
     * @param {string} msgtype - The type of message to log: debug, error, etc.
     * @param {string} msgcontent - The body content of the log message
     */
    _logMessage(msgtype, msgcontent) {
        if ((msgtype !== CAFFEINATE_DEBUG_MSG) || this._settings.get_boolean('debug-logging')) {
            msgcontent = msgcontent.replace(/\n/g, `\nCaffeinate Extension: ${msgtype}: `);
            log(`Caffeinate Extension: ${msgtype}: ${msgcontent}`);
        }
    }

    /**
     * Add the Indicator to the QuickSettings menu
     */
    _addIndicator() {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Adding indicator to QuickSettings menu');
        if (this._indicator === null)
            this._indicator = new CaffeinateMenu.CaffeinateIndicator();
    }

    /**
     * Remove the Indicator from the QuickSettings menu
     */
    _removeIndicator() {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Removing indicator from QuickSettings menu');
        if (this._indicator) {
            this.indicator.destroy();
            this.indicator = null;
        }
    }

    /**
     * Toggle showing or hiding the Indicator based on settings
     *
     * @TODO: Add this functionality, reacts to settings changes
     */
    _toggleIndicator() {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Toggling visibility of indicator in QuickSettings menu');
    }

    /**
     * When the session mode changes, we will either add or remove the
     * Indicator so that it is not visible on the lock screen
     *
     * @param {object} session - A Gnome Shell session object
     */
    _onSessionModeChanged(session) {
        this._logMessage(CAFFEINATE_DEBUG_MSG, 'Session mode change detected, reacting...');
        if (session.currentMode === 'user' || session.parentMode === 'user')
            this._addIndicator();
        else if (session.currentMode === 'unlock-dialog')
            this._removeIndicator();
    }
}

/**
 * Initialize the Extension
 */
function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);
    return new Extension();
}

