---
id: development-environment-mac
title: Development Environment for Mac
sidebar_label: Development Environment for Mac
---

In this section, we've prepared materials to help even those new to development set up their development environment. This is about the `Mac development environment`, so if you're a Windows user, please check out the [Windows development environment](development-environment-windows).

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style={{marginBottom: 20}}></iframe>
</div>

# Development Environment

Starting from the macOS [Catalina](https://en.wikipedia.org/wiki/MacOS_Catalina) version `10.15`, [`zsh`(Z shell)](https://en.wikipedia.org/wiki/Z_shell) began to be used as the default shell. Previously, [`bash`(Bourne Again Shell)](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) was the default shell for macOS. This change took place in Catalina, released in 2019. Among the reasons for this change was an issue related to the licensing of the GNU project's bash version.

We also recommend installing [oh my zsh](https://ohmyz.sh) which further enriches the current default shell `zsh`. It includes plugins and themes favored by developers worldwide, making development more approachable.

## 1. Oh My Zsh

Now, let's install Oh My Zsh. For beginners, we provide an installation method through video.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=6" title="Oh My Zsh" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

First, visit the [oh my zsh official website](https://ohmyz.sh). Then, scroll down and copy the command under `Install oh-my-zsh via curl` and paste it into your terminal. The copied command is as follows:

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Executing the command in the terminal will start the `Oh My Zsh` installation. If a popup for `command line developer tools` appears during installation, select 'Install'. `git` is required for `Oh My Zsh` installation, and this tool is provided by `command line developer tools`. Thus, consider this tool essential for installation.

Once installed, it will be beautifully displayed in the terminal as:

```sh
         __                                     __
  ____  / /_     ____ ___  __  __   ____  _____/ /_
 / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \
/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
\____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/
                        /____/
```

Additionally, we will install [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting). Go to the [installation guide](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md) and navigate to [In your ~/.zshrc](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#in-your-zshrc) to copy the command below.

```sh
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
echo "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
```

Copy and execute the command in the terminal to complete the installation. If you wish to specify a different download path, please refer to [the video](https://youtu.be/o3dfpDaICb4?t=53) below.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=53" title="Zsh Syntax Highlighting" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Once installed, recognizable commands in the terminal will appear in `green`, and unrecognizable commands will appear in `red`, enhancing the convenience of development.

## 2. Homebrew

Next, we will install the [package manager](https://en.wikipedia.org/wiki/Package_manager) for macOS called [Homebrew](https://brew.sh).

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=74" title="Homebrew" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

A package manager is a crucial tool for efficiently managing software dependencies within an OS. It might be challenging for those new to development to understand at first, but once you experience a package manager, you will clearly appreciate its significance and convenience.

The most popular package manager on Mac is [Homebrew](https://brew.sh), and it can be easily installed using the command provided on the official page:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Copy and paste the command into your terminal. The shell will request your login password. Enter the password to proceed with the installation. During the installation, you may be prompted to press the `Enter` key or other responses. Carefully read the terminal's prompt messages and proceed accordingly.

## 3. Install NVM (Node Version Manager) and then Node.js

[Node.js](https://nodejs.org) is a tool that allows [JavaScript](https://en.wikipedia.org/wiki/JavaScript) to be executed outside the web browser. This has enabled the use of JavaScript when building servers or applications on computers. It allows for fast concurrent processing and has the advantage of being able to work in both [frontend and backend](https://en.wikipedia.org/wiki/Front_and_back_ends) using the same language.

You might wonder why you need to install [NVM](https://github.com/nvm-sh/nvm) when you can just install `Node.js`. `NVM` (Node Version Manager) is a tool that allows you to install and manage multiple versions of `Node.js`. If you install `Node.js` directly, you can only use one version, but with `NVM`, you can easily switch between different versions. This has several advantages:

1. **Compatibility**: Different projects may require different versions of `Node.js`. By using `NVM`, you can set the appropriate version for each project.
2. **Convenience**: You can easily switch between versions of `Node.js` with a single command.
3. **Stability**: If you want to test the latest version of `Node.js` that includes experimental features, you can install and use it separately from the stable version.
4. **Updates and Rollbacks**: You can easily install new versions of `Node.js` and roll back to previous versions if there are issues.

Therefore, managing versions through `NVM` is a much more flexible and effective method than just installing `Node.js`.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=106" title="NVM and Node.js" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Installing NVM

Now, to install `NVM`, visit the [official homepage](https://github.com/nvm-sh/nvm). Find and copy the command below, then paste it into your terminal.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```

> Please note that the `0.39.4` version number might increase over time.

Next, you'll need to modify `~/.zshrc`. Developers can edit using tools like [vim](https://www.vim.org), but if you're new to development, you can open it with the default `TextEdit` program:

```sh
open -a TextEdit ~/.zshrc
```

After opening `TextEdit`, paste the following commands at the very bottom. Note that these commands will be displayed in the terminal after the `nvm` installation is complete.

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Save and exit. Then reload your `zsh` profile using the `source ~/.zshrc` command. After this, you should be able to recognize the `nvm` command.

### Installing Node.js

Now, using the previously installed `NVM`, we'll install [Node.js](https://nodejs.org/). First, check the installed versions using the `nvm list` command (it should be empty if everything's right). Use the `nvm install 18` command to install version 18 of `Node.js`. Running `nvm list` again, you should see the `v18` version installed. Then finish the default settings with the following commands:

```sh
nvm use 18
```

> This sets `Node.js` version `18` in `nvm`.

```sh
nvm alias default 18
```

> This sets `Node.js` version `18` as the default in `nvm`.

Once installation is complete, you can check the installed `Node.js` version using the `node -v` command. Additionally, check the version of [npm](https://www.npmjs.com) using the `npm -v` command. Here, `npm` is a package manager for `Node.js`, similar to `Homebrew`. Simply put, `npm` is very effective in managing software packages installed with `Node.js`.

In addition to `npm`, it's recommended to install [yarn](https://yarnpkg.com). The installation process is straightforward using `npm`. `Yarn` is a package manager similar to `npm` developed by Meta (previously Facebook). The main reason for installing `Yarn` is because the upcoming [React Native](https://reactnative.dev) framework is developed by Meta. To install `yarn`, use the following command:

```sh
npm install -g yarn
```

The `-g` option stands for `global`. Using this option installs the program globally, allowing you to access the installed program from anywhere in the terminal.

# 4. iOS Development Environment

Let's set up the `iOS` app development environment.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=167" title="iOS Development Environment" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Download [Xcode](https://developer.apple.com/xcode) from the [App Store](https://www.apple.com/app-store). Note that you must access directly through the built-in App Store application on Mac instead of the App Store link.

> Once installed, make sure that the [Command Line Tools](https://mac.install.guide/commandlinetools/index.html) are correctly installed. It's likely that it was already installed during the [1. Oh My Zsh](#1-oh-my-zsh) setup.

> `Xcode Command Line Tools` provides essential compilers and various development tools for programming on macOS. Specifically, it includes [compilers](https://en.wikipedia.org/wiki/Compiler) like GCC and Clang, version control systems like [Git](https://git-scm.com), and many UNIX-based command-line tools. These tools are essential when developing code or managing packages in the terminal without the Xcode IDE, and for compiling and installing in many development projects and software packages.

## 5. Android Development Environment

Next, we'll prepare the `Android` app development environment.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=203" title="Android Studio" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Watchman

Firstly, [watchman](https://facebook.github.io/watchman) is not directly related to Android, but as it might have been missed in the previous installation process, we'll guide the installation here to match the video sequence. `Watchman` is a file system monitoring tool developed by `Meta`. Using it improves the development experience in `React Native` by quickly detecting real-time file changes. In `RN`, it's recommended but not essential for efficient code change detection and seamless integration with the development server.

### Java

Next, install [java](https://www.java.com) using `brew`.

```sh
brew tap homebrew/cask-versions
```

```sh
brew install --cask zulu11
```

### Android Studio

Lastly, install [Android Studio](https://developer.android.com/studio/install). You can install via `brew`, but the video shows how to download and install directly. Choose your installation method accordingly.

```sh
brew install --cask android-studio
```

After installation, it's recommended to create a new Android project as per the video. This is to ensure the Android environment is correctly set up. If the Android project runs smoothly, the environment setup is successful. Next, you'll need to add the path of the `Android SDK` to your `zsh` profile. Use the command below to open your `zsh` profile.

```sh
open -a TextEdit ~/.zshrc
```

Then, add the following environment variables at the bottom of the file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

> Make sure the `ANDROID_HOME` path is set correctly for your PC. You can check how to verify this in [this video](https://youtu.be/o3dfpDaICb4?t=332).

## 6. Visual Studio Code

Next, we'll install [Visual Studio Code](https://code.visualstudio.com). Often referred to as `vscode`, it's one of the most beloved code editors among developers worldwide. In the past, editors like [edit plus](https://www.editplus.com), [sublime text](https://www.sublimetext.com), and the now-discontinued [atom](https://github.blog/2022-06-08-sunsetting-atom) were popular. However, many developers have since switched to `vscode` due to its superior features and user experience.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=354" title="Visual Studio Code" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Install using `brew` as follows:

```sh
brew install --cask visual-studio-code
```

## 7. React Native and Expo

Lastly, we'll install [React Native](https://reactnative.dev), which allows for development across `iOS`, `Android`, and `web`.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/o3dfpDaICb4?start=406" title="NVM and Node.js" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

For a richer and quicker start to a React Native project, we'll use [dooboo-cli](https://medium.com/crossplatformkorea/new-dooboo-cli-5c60e17a87e0), managed by [dooboolab](https://dooboolab.com).

Open the terminal and input:

```sh
npx dooboo init
```
> `npx` is an npm package runner introduced in `npm` version 5.2.0 in 2017. It lets users run package commands directly from the npm registry without globally installing them. This facilitates easy execution of the latest versions of specific packages or temporarily running packages.

```sh
 _| _  _ |_  _  _ | _ |_
(_|(_)(_)|_)(_)(_)|(_||_)
```

Once you see the above in the terminal and the `Expo (Typescript)` project appears in the caption state, press the `Enter` key to proceed. Then, input your desired project name and press `Enter` to create the project.

> [Expo](https://docs.expo.dev) is an open-source platform for React Native, simplifying and accelerating mobile app development. Developers can instantly start new projects without initial setup using Expo, with easy access to various native APIs. Additionally, Expo's development tools allow real-time previews and instant updates, making the development and debugging process more efficient.

Navigate to the folder with the project name, use `yarn` to install necessary local packages, and

 start the project:

```sh
cd your-project-name
yarn install
yarn start
```

Then, follow the on-screen prompts to launch your React Native app on the iOS simulator or Android emulator. Also, check out [dooboo-ui](https://dooboo-ui.dooboolab.com), an open-source React Native UI kit developed by dooboolab for various components, designs, and utilities.
