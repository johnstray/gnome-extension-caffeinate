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
const {Adw, Gtk, Gdk, GObject} = imports.gi;

// Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Import required helpers
const ActionRow = Me.imports.preferences.switchActionRow;

const PrefWidgetTitle = 'GameMode';
const PrefWidgetDescription = 'Toggle Caffeination with GameMode';

var GameModePrefPage = GObject.registerClass(
    class GameModePrefWidget extends Adw.PreferencesPage {
        
        /**
         * _init(setting)
         */
        _init(settings) {
            super._init( {
                title: 'About',
                icon_name: 'emote-love-symbolic',
                name: 'AboutPrefPage'
            } );
            
            // Content of the preference page goes here...
            
        }
        
    }
}

