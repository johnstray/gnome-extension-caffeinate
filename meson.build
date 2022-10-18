# SPDX-FileCopyrightText: 2022 John Stray <gnome-extensions AT johnstray.com>
# SPDX-License-Identifier: GPL-3.0-or-later

project(
    'gnome-shell-extension-caffeinate',
    version: '1',
    licence: 'GPL-3.0-or-later',
    meson_version: '>= 0.59.0'
)

# CONSTANTS
UUID = 'caffeinate@gnome-extensions.johnstray.com'
DNS = 'org.gnome.shell.extensions.caffeinate'
DCONF = '/org/gnome/shell/extensions/caffeinate'

# PATHS
DATADIR = join_paths(get_option('prefix'), get_option('datadir'))
INSTALL_DIR = join_paths(DATADIR, 'gnome-shell', 'extensions', UUID)
GSCHEMA_DIR = join_paths(DATADIR, 'glib-2.0', 'schemas')

# CONFIGURATION
CONFIG = configuration_data()
CONFIG.set('EXTENSION_VERSION', meson.project_version())
CONFIG.set('EXTENSION_UUID', UUID)
CONFIG.set('EXTENSION_DNS', DNS)
CONFIG.set('EXTENSION_DCONF', DCONF)
CONFIG.set('GSETTINGS_SCHEMA_DIR', GSCHEMA_DIR)

# IMPORTS
gnome = import('gnome')
i18n = import('i18n')


# -----
# DISTRIBUTION TARGETS
# -----

env_util = find_program('env')

# DIST - Make ZIP for EGO
run_target(
    'make-zip',
    command: [
        env_util,
        'UUID=' + UUID,
        'DATADIR=' + DATADIR,
        'GSCHEMADIR=' + GSCHEMA_DIR,
        join_paths(meson.project_source_root(), 'build-aux', 'mkzip.sh')
    ]
)

# DIST - Install from generated ZIP
run_target (
    'install-zip',
    command: [
        env_util,
        'UUID=' + UUID,
        'DATADIR=' + DATADIR,
        'GSCHEMADIR=' + GSCHEMA_DIR,
        'INSTALL=true',
        join_paths(meson.project_source_root(), 'build-aux', 'mkzip.sh')
    ]
)


# -----
# BUILD / INSTALL
# -----

configure_file(
    input: 'src/metadata.json.in',
    output: 'src/metadata.json',
    configuration: CONFIG,
    install_dir: INSTALL_DIR
)

main = [
    'src/extension.js',
    'src/prefs.js'
]

modules = [
    'src/modules/CaffeinateClient.js',
    'src/modules/GameModeClient.js',
    'src/modules/QuickSettingsMenu.js'
]

preferences = [
    'src/preferences/AboutPrefs.js',
    'src/preferences/CaffeinatePrefs.js',
    'src/preferences/GameModePrefs.js'
]

icons = [
    'src/icons/caffeinate-off-symbolic.svg',
    'src/icons/caffeinate-on-symbolic.svg',
    'src/icons/heart-filled-symbolic.svg'
]

install_data(main, install_dir: INSTALL_DIR)
install_data(modules, install_dir: INSTALL_DIR / 'modules')
install_data(preferences, install_dir: INSTALL_DIR / 'preferences')
install_data(icons, install_dir: INSTALL_DIR / 'icons')

# Compile GSettings Schema File
glib_compile_schemas_exe = find_program('glib-compile-schemas')
install_data(
    'src/schemas/org.gnome.shell.extensions.caffeinate.gschema.xml',
    install_dir: GSCHEMA_DIR
)
configure_file(
    input: 'src/schemas/org.gnome.shell.extensions.caffeinate.gschema.xml',
    output: 'src/schemas/gschemas.compiled',
    command: [
        glib_compile_schemas_exe,
        'targetdir=@CURRENT_SOURCE_DIR@/src/schemas/',
        '@CURRENT_SOURCE_DIR@/src/schemas/'
    ],
    install: true,
    install_dir: INSTALL_DIR / 'schemas'
)

subdir('po')


# -----
# TEST - Run ESLint on the source code
# -----

eslint_exe = find_program(
    'eslint', 'eslint.js',
    required: false,
    dirs: join_paths(meson.project_source_root(), 'node_modules', 'eslint', 'bin')
)

if eslint_exe.found()
    test('eslint', eslint_exe,
        args: join_paths(meson.project_source_root(), 'src'),
        suite: 'lint'
    )
endif


# -----
# DEV - Setup development environment with Node.js
# -----

npm_exe = find_program('npm', required: false)
if npm_exe.found()
    run_target(
        'dev'.
        command: [
            npm_exe, 'install', '--save-dev'
        ]
    )
endif