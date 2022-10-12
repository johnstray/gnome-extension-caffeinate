<h1 align="center">
	<img src="https://apps.gnome.org/icons/scalable/org.gnome.Extensions.svg" style="height:48px" /><br />
	Caffeinate Gnome Extension
</h1>
<h6 align="center">Combines the functionality of the original similarly named extension with GameMode support, and rewritten from the ground up for Gnome 43+</h6>

<!-- This is intentional to create blank space -->
<p>&nbsp;</p>

<p align="center">
	<img src="https://img.shields.io/github/v/release/johnstray/gnome-extension-caffeinate?label=latest%20release" alt="Latest release version" />
	<img src="https://img.shields.io/github/downloads/johnstray/gnome-extension-caffeinate/total" alt="Total GitHub release downloads" />
	<img src="https://img.shields.io/github/license/johnstray/gnome-extension-caffeinate" alt="License" />
	<img src="https://img.shields.io/github/issues-raw/johnstray/gnome-extension-caffeinate?logo=github" alt="GitHub open issues" />
	<img src="https://img.shields.io/github/last-commit/johnstray/gnome-extension-caffeinate?logo=github" alt="GitHub last commit" />
</p>

<p align="center">
	<a href="#about">About</a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
	<a href="#installation-and-usage">Installation and Usage</a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
	<a href="#contributions">Contributions</a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
	<a href="supported-languages">Supported Languages</a>
</p>

<!-- This is intentional to create blank space -->
<p>&nbsp;</p>

![Screenshot of Settings Window](/docs/Screenshot.png?raw=true "Screenshot of Settings Window")

## About
This Gnome Shell Extension combines the functionality of the original similarly named extension with GameMode support. It has been written from the ground up for Gnome 43+. I welcome any and all suggestions for future improvements, and if you find any bugs, then please let me know.

The plugin will be a direct replacement for GetSimple Blog and will contain many new features that will be added natively, such as hooks and filters to allow extensibility by other plugins, native integration with some existing plugins, plus much more.

This extension is currently under active development, but is a little while away from completion and ready for release yet. If you’d like to track the development progress, please follow this GitHub project

A new team of translators will be needed for this plugin. If you speak any languages other than those that are already included, then please send me a PM so that I can add you to the project. A GitHub account is a must as the development process is maintained from there.

#### Features Include:
- Inhibits the computer from entering a sleep state or screensaver
- Monitors and enables on-demand control of Feral Interactive's GameMode

## Installation and Usage
It is reccommended that you install this extention from the Gnome Extensions website. However you can build this extension from the GitHub source if you like.

Building from source requires that you have Git, Meson and glib-compile-schemas installed and are running Gnome Shell v43 or later. To build and install from source, clone this repository and run the commands below:
```bash
# Clone the repository
git clone https://github.com/johnstray/gnome-extension-caffeine

# Switch to the build directory
cd gnome-extension-caffeine

# Prepare the build:
# - Use `--prefix=/usr` to install for all users
# - Use `--prefix=$HOME/.local` to install only for your user
meson --prefix=$HOME/.local build/

# Run the install process
meson -C build/ install
```

## Supported Languages
- English (US) - Default language

---

## Contributions
Everyone is welcome to make suggestions on how this extension can be improved by either submitting an issue or a pull-request.
If you would like to contribute to this project, please first have a read of the Contributing Guidelines.

## License
This project is licensed under the terms of the GNU General Public Licence v3 (or later).

This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistrbute it and monify it under certain conditions. See [LICENCE](LICENCE) for details.
