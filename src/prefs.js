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
const {Gdk, Gtk} = imports.gi;

// Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Import Preference pages
const PrefPages = Me.imports.preferences;

// Initialize translations
const Gettext = imports.gettext.domain(Me.metadata.uuid);
const _ = Gettext.gettext;

// Preferences Pages
const {AboutPrefPage} = PrefPages.AboutPrefs;
const {CaffeinatePrefPage} = PrefPages.CaffeinatePrefs;
const {GameModePrefPage} = PrefPages.GameModePrefs;
const PrefsVisiblePage = {
    ABOUT: 0,
    CAFFINATE: 1,
    GAMEMODE: 2
};

/**
 * Initialize the preferences dialog
 */
function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);
}

/**
 * The preferences window class
 */
const Preferences = class {
    /**
     * Class constructor for the preferences window
     *
     * @param {object} window - A window object to use as our preferences window
     */
    constructor(window) {
        // Get the currently configured settings
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.caffeinate');

        // Import our icons into the current theme
        let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
        if (!iconTheme.get_search_path().includes(`${Me.path}/icons`))
            iconTheme.add_search_path(`${Me.path}/icons`);

        // Set the title of the preferences window
        window.set_title(_('Caffinate Settings'));

        // Enable the ability to search for settings in the window
        window.set_search_enabled(true);

        // Monitor for changes to the currently visible preferences page
        this._pageChangedId = this._settings.connect('changed::prefs-visible-page', () => {
            if (this._settings.get_int('prefs-visible-page') !== PrefsVisiblePage.ABOUT)
                this._setVisiblePage();
        });

        // Populate the window with some content
        this._window = window;
        this._populateWindow();
    }

    /**
     * Populate the preferences window
     */
    _populateWindow() {
        if (this._window.pages?.length > 0)
            this._window.pages.forEach(page => this._window.remove(page));

        this._window.pages = [];

        const caffeinatePrefPage = new CaffeinatePrefPage();
        this._window.add(caffeinatePrefPage);
        this._window.pages.push(caffeinatePrefPage);

        const gamemodePrefPage = new GameModePrefPage();
        this._window.add(gamemodePrefPage);
        this._window.pages.push(gamemodePrefPage);

        const aboutPrefPage = new AboutPrefPage();
        this._window.add(aboutPrefPage);
        this._window.pages.push(aboutPrefPage);

        this._setVisiblePage();
    }

    /**
     * Set the currently visible preferences page in the window
     */
    _setVisiblePage() {
        if (this._settings.get_int('prefs-visible-page') === PrefsVisiblePage.ABOUT)
            this._window.set_visible_page_name('AboutPrefPage');

        else if (this._settings.get_int('prefs-visible-page') === PrefsVisiblePage.CAFFINATE)
            this._window.set_visible_page_name('CaffinatePrefPage');

        else if (this._settings.get_int('prefs-visible-page') === PrefsVisiblePage.GAMEMODE)
            this._window.set_visible_page_name('GamemodePrefPage');

        this._settings.set_int('prefs-visible-page', PrefsVisiblePage.ABOUT);
    }

    /**
     * Destroy the class when its no longer required
     */
    destroy() {
        if (this.pageChangedId) {
            this._settings.disconnect(this._pageChangedId);
            this._pageChangedId = null;
        }
    }
};

/**
 * Fill the preferences window using the Preferences class
 *
 * @param {object} window - A window object to use for our preferences window
 */
function fillPreferencesWindow(window) {
    let preferences = new Preferences(window);
    window.connect('close-request', () => preferences.destroy());
}


