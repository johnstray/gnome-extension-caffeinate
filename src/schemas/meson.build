# SPDX-FileCopyrightText: 2022 John Stray <gnome-extensions AT johnstray.com>
# SPDX-License-Identifier: GPL-3.0-or-later

glib_compile_schemas_exe = find_program('glib-compile-schemas')
custom_target(
    'gschemas',
    build_by_default: true,
    build_always_stale: true,
    output: 'gschemas.compiled',
    command: [
        glib_compile_schemas_exe,
        'targetdir=@OUTDIR@',
        '@CURRENT_SOURCE_DIR@'
    ],
    install: true,
    install_dir: INSTALL_DIR / 'schemas'
)
