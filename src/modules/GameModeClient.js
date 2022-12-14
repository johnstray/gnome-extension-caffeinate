/* exported Client */
/**
 *  Caffeinate Gnome Shell Extension
 *  Authors: John D. Stray <gnome-extensions@johnstray.com>
 *           Christian J. Kellner <christian@kellner.me>
 *
 *  GameMode Client Interface
 *  Adapted from 'GameMode GNOME Shell Extension'
 *  <https://github.com/gicmo/gamemode-extension/blob/master/client.js>
 *
 *  Copyright © 2019 Red Hat, Inc
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

const Gio = imports.gi.Gio;
const Signals = imports.signals;


const GameModeClientInterface = '<node> \
  <interface name="com.feralinteractive.GameMode"> \
    <property name="ClientCount" type="i" access="read"></property> \
    <method name="RegisterGame"> \
      <arg type="i" name="pid" direction="in"> </arg> \
      <arg type="i" name="status" direction="out"> </arg> \
    </method> \
    <method name="UnregisterGame"> \
      <arg type="i" name="pid" direction="in"> </arg> \
      <arg type="i" name="status" direction="out"> </arg> \
    </method> \
  </interface> \
</node>';


const GAMEMODE_DBUS_NAME = 'com.feralinteractive.GameMode';
const GAMEMODE_DBUS_IFACE = 'com.feralinteractive.GameMode';
const GAMEMODE_DBUS_PATH = '/com/feralinteractive/GameMode';

var Client = class {
    constructor(readyCallback) {
        this._readyCallback = readyCallback;
        this._proxy = null;

        let nodeInfo = Gio.DBusNodeInfo.new_for_xml(GameModeClientInterface);
        Gio.DBusProxy.new(Gio.DBus.session,
            Gio.DBusProxyFlags.DO_NOT_AUTO_START,
            nodeInfo.lookup_interface(GAMEMODE_DBUS_IFACE),
            GAMEMODE_DBUS_NAME,
            GAMEMODE_DBUS_PATH,
            GAMEMODE_DBUS_IFACE,
            null,
            this._onProxyReady.bind(this));

        this.client_count = 0;
    }

    _onProxyReady(o, res) {
        try {
            this._proxy = Gio.DBusProxy.new_finish(res);
        } catch (e) {
            log('error creating GameMode proxy: %s'.format(e.message));
            return;
        }

        this._propsChangedId = this._proxy.connect('g-properties-changed', this._onPropertiesChanged.bind(this));

        if (this._readyCallback)
            this._readyCallback(this);

        this.client_count = this._proxy.ClientCount;
        if (this.client_count > 0) {
            this.emit('state-changed', true);
            this.emit('count-changed', this.client_count);
        }
    }

    _onPropertiesChanged(proxy, properties) {
        let unpacked = properties.deep_unpack();
        if (!('ClientCount' in unpacked))
            return;

        let beforeN = this.client_count;
        let beforeOn = this.client_count > 0;
        this.client_count = this._proxy.ClientCount;

        let afterOn = this.client_count > 0;

        if (beforeOn !== afterOn)
            this.emit('state-changed', afterOn);

        if (beforeN !== this.client_count)
            this.emit('count-changed', this.client_count);
    }

    /* public methods */
    close() {
        this.disconnectAll();

        if (!this._proxy)
            return;

        this._proxy.disconnect(this._propsChangedId);
        this._proxy = null;
    }

    get clientCount() {
        return this._proxy ? this._proxy.ClientCount : 0;
    }

    registerGame(pid, callback) {
        this._proxy.RegisterGameRemote(pid, (res, err) => {
            if (err) {
                callback(-2, err);
                return;
            }

            let [status] = res;
            callback(status, null);
        });
    }

    unregisterGame(pid, callback) {
        this._proxy.UnregisterGameRemote(pid, (res, err) => {
            if (err) {
                callback(-2, err);
                return;
            }

            let [status] = res;
            callback(status, null);
        });
    }
};

Signals.addSignalMethods(Client.prototype);
