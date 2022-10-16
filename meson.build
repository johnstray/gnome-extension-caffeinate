# SPDX-FileCopyrightText: 2022 John Stray <gnome-extensions AT johnstray.com>
# SPDX-License-Identifier: GPL-3.0-or-later

project(
    'caffeinate',
    version: '1',
    license: 'GPL-3.0-or-later',
    meson_version: '>= 0.56.0'
)

UUID = 'caffeinate@gnome-extensions.johnstray.com'
DNS = 'org.gnome.shell.extensions.caffeinate'

INSTALL_DIR = get_option('datadir') / 'gnome-shell' / 'extensions' / UUID

i18n = import('i18n')

subdir('src')
subdir('po')

npm_exe = find_program('npm', required: false)
if npm_exe.found()
    run_target(
        'dev'.
        command: [
            npm_exe, 'install', '--save-dev'
        ]
    )
endif

eslint_exe = find_program(
    'eslint', 'eslint.js',
    required: false,
    dirs: [ meson.project_source_root() / 'node_modules' / 'eslint' / 'bin' ]
)
if eslint_exe.found()
    test(
        'eslint',
        eslint_exe,
        args: [ meson.project_source_root() / 'src' ],
        suite: 'code'
    )
endif

if (get_option('pack'))
    INSTALL_DIR = meson.project_build_root() / UUID
    zip_exe = find_program('zip')
    meson.add_install_script(
        meson.project_source_root() / 'ego-pack.sh',
        zip_exe.full_path(),
        UUID,
        meson.project_source_root() / get_option('packdir')
    )
endif
