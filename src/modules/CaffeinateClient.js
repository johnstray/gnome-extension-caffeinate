/**
    Caffeinate Gnome Shell Extension
    Authors: John D. Stray <gnome-extensions@johnstray.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/

// Import necessary libraries
const {Gobject} = imports.gi;

// Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// DBus Interfaces
const DBusSessionManagerIface = '<node>\
    <interface name="org.gnome.SessionManager">\
        <method name="Inhibit">\
            <arg type="s" direction="in" />\
            <arg type="u" direction="in" />\
            <arg type="s" direction="in" />\
            <arg type="u" direction="in" />\
            <arg type="u" direction="out" />\
        </method>\
        <method name="Uninhibit">\
            <arg type="u" direction="in" />\
        </method>\
        <method name="GetInhibitors">\
            <arg type="ao" direction="out" />\
        </method>\
        <signal name="InhibitorAdded">\
            <arg type="o" direction="out" />\
        </signal>\
        <signal name="InhibitorRemoved">\
            <arg type="o" direction="out" />\
        </signal>\
    </interface>\
</node>';

const DBusSessionManagerProxy = Gio.DBusProxy.makeProxyWrapper(DBusSessionManagerIface);
const DisplayDeviceInterface = loadInterfaceXML("org.freedesktop.UPower.Device");
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(DisplayDeviceInterface);
const DBusSessionManagerInhibitorIface = loadInterfaceXML("org.gnome.SessionManager.Inhibitor");
const DBusSessionManagerInhibitorProxy = Gio.DBusProxy.makeProxyWrapper(DBusSessionManagerInhibitorIface);

/**
 * The Caffeination Class
 */
var Client = class {

    constructor() {}
    
    /**
     * ----- PUBLIC GETTERS -----
     */
    
    /** Returns whether the device has a battery */
    get hasBattery() {}
    
    /** Returns whether the device is currently receiving power */
    get isCharging() {}
    
    /** Returns whether the device is docked (charging and connected to external monitor) */
    get isDocked() {}
    
    /** Returns whether we are in fullscreen mode */
    get inFullscreen() {}
    
    /**
     * ----- PUBLIC METHODS -----
     */
    
    toggleState() {}
    
    toggleCharging() {}
    
    toggleFullscreen() {}
    
    /** Adds an inhibitor */
    addInhibitor( app_id ) {}
    
    /** Removes an inhibitor */
    removeInhibitor( app_id ) {}
    
    
    close() {}
    
    /**
     * ----- INTERNAL METHODS -----
     */
    
    _onInhibitorAdded( proxy, sender, [object] ) {}
    
    _onInhibitorRemoved( proxy, sender, [object] ) {}
    
    _manageNightLight() {}
    
    _updateAppConfigs() {}
    
    _updateAppData() {}
    
    _appWindowsChanged() {}
    
    /**
     * Connects to a Gjs object and listens to a specific signal.
     * Keeps track of all connections, for easier disconnection.
     * 
     * @argument {Object} target - The Gjs object to connect to
     * @argument {string} signal - The signal to listen to
     * @argument {Function} hook - The function to invoke when the signal is emitted
     */
    _connect( target, signal, hook ) {}
    
    /**
     * Disconnects all connected signals from Gjs objects
     */
    _disconnectAll() {}

}
