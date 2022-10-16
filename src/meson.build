# SPDX-FileCopyrightText: 2022 John Stray <gnome-extensions AT johnstray.com>
# SPDX-License-Identifier: GPL-3.0-or-later

configure_file(
    input: 'metadata.json.in',
    output: 'metadata.json',
    configuration: {
        'DNS': DNS,
        'UUID': UUID,
        'VERSION': meson.project_version(),
        'BUILD_TYPE': get_option('buildtype')
    },
    install_dir: INSTALL_DIR
)

main = [
    'extension.js',
    'prefs.js'
]

modules = [
    'modules/CaffeinateClient.js',
    'modules/GameModeClient.js',
    'modules/QuickSettingsMenu.js'
]

preferences = [
    'preferences/AboutPrefs.js',
    'preferences/CaffeinatePrefs.js',
    'preferences/GameModePrefs.js'
]

icons = [
    'icons/caffeinate-off-symbolic.svg',
    'icons/caffeinate-on-symbolic.svg',
    'icons/heart-filled-symbolic.svg'
]

install_data(main, install_dir: INSTALL_DIR)
install_data(modules, install_dir: INSTALL_DIR / 'modules')
install_data(preferences, install_dir: INSTALL_DIR / 'preferences')
install_data(icons, install_dir: INSTALL_DIR / 'icons')

subdir('schemas')
