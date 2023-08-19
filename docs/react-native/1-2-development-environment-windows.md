---
id: development-environment-windows
title: Development Environment for Windows
sidebar_label: Development Environment for Windows
---

In this section, we have prepared resources to help even those new to development set up their development environment. This is for a `Windows development environment`, so if you're a Mac user, please check out [Mac development environment](development-environment-mac).

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4" title="Development Environment for Windows" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style={{marginBottom: 20}}></iframe>
</div>

# Development Environment

`Winget` is the Windows Package Manager, a tool designed to automate the installation and management of software packages. Initially, it had to be installed separately, but starting with Windows 11 released in 2021, `Winget` began to be included by default in the OS. Hence, from Windows 11 onwards, `Winget` is pre-installed.

Windows comes with a default shell called [Powershell](https://learn.microsoft.com/en-us/powershell/scripting/overview) and released the [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) as a stable version in May 2020. `Windows Terminal` is a terminal developed by Microsoft to overcome the limitations of the traditional `cmd.exe` and adapt it to the modern development environment. With multi-tab support, GPU-accelerated rendering, customization options, and support for various shells, it offers a richer terminal experience. By default, `Windows Terminal` uses `PowerShell` as its shell, but this can be changed to the user's preference. Users can add a variety of shells, including `cmd`, `WSL`, or other custom shells. This allows users to choose the shell that best fits their environment and workflow.

Understanding the above will make the installation process much easier to grasp.

## 1. Winget

As mentioned earlier, while `Winget` is pre-installed by default, if for some reason it's not, run the [Microsoft Store](https://www.microsoft.com/en-us/store/top-free/apps/pc) and install [App Installer](https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1). Then, open [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) and check if the `winget` command works correctly.

**Advantages of using Winget:**

1. **Simplicity**: Install multiple programs with just one command, without the need for complex installation processes or downloading several installers.
2. **Consistency**: All programs are installed in the same way, allowing users to skip the complex installation procedures of individual programs.
3. **Version Control**: Useful when installing or updating a specific version of a program.
4. **Script Support**: Bulk installation of multiple programs is possible through installation scripts, which is handy when setting up a new environment or restoring a system.
5. **Safety**: Only packages verified from the official repository are provided, ensuring software downloads from trustworthy sources.

In conclusion, using `Winget` makes software installation and management more straightforward, allowing for consistent software management across various environments.

## 2. Oh My Posh

`Oh My Posh` is a prompt theme and configuration tool that helps customize the PowerShell or other shell environments on Windows to your liking. It's useful for users who want to see additional information or change to a more eye-catching style than what the default shell prompt provides. With `Oh My Posh` installed, you can display various styles and colors for the current [Git](https://git-scm.com) status, working directory, execution success/failure indicators, making shell environments clearer and more efficient. This can significantly improve a developer's productivity and work convenience.

> `Git` is a version control system that helps track changes and facilitate collaboration when multiple people are working on the code. Even if you don't know about it now, you'll naturally learn about it as you work on development, so don't worry!

Let's now install [Oh My Posh](https://ohmyposh.dev).

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=33" title="Oh My Posh" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Please refer to the [Official Homepage ➡ Docs ➡️ Get Started ➡️ Installation ➡️ Windows](https://ohmyposh.dev/docs/installation/windows) section and enter the command below in the terminal.

```sh
winget install JanDeDobbeleer.OhMyPosh -s winget
```

To prevent font issues in the terminal, we'll also install an additional font. Right-click on the `Windows Terminal` and open it with `administrator rights`. Then, install the font with the following command.

``sh
oh-my-posh font install
```
> Entering the command above prompts you to choose a font, where we'll install `FiraCode`.

### Terminal Font Setting

Next, open the configuration file in the terminal by pressing `CTRL + SHIFT + ,`. This will open a text editor where you should look for the "profiles" => "defaults" section and edit it as shown below:

```json
{
  "profiles":
  {
    "defaults":
    {
      "font":
      {
        "face": "FiraCode Nerd Font"
      }
    }
  }
}
```

In the terminal settings, if you navigate to `Settings ➡️ Defaults ➡️ Appearance ➡️ Font face`, you should see that it's set to `FiraCode Nerd Font`. If it's not, please refer to the [manual](https://learn.microsoft.com/en-us/windows/terminal/install).

### Shell Configuration

Now, let's finalize the `Oh My Posh` configuration so it runs automatically whenever PowerShell starts:

1. First, open PowerShell and enter the following command to create a profile configuration file:
```sh
New-Item -Path $PROFILE -Type File -Force
```
This command creates a profile configuration file for PowerShell.

2. To open the created profile configuration file in Notepad, enter:
```sh
notepad $PROFILE
```

3. Once Notepad is open, paste the following code. This ensures `Oh My Posh` is run automatically whenever PowerShell starts.
```sh
oh-my-posh init pwsh | Invoke-Expression
```

Your setup is now complete. Every time you start PowerShell, `Oh My Posh` configuration will be automatically applied.

## 3. Install NVM (Node Version Manager) followed by Node.js installation

[Node.js](https://nodejs.org/en) allows [JavaScript](https://en.wikipedia.org/wiki/JavaScript) to run outside web browsers, enabling developers to use it for creating servers and applications on a computer. This concurrency capability, combined with the advantage of using the same language for both [frontend and backend](https://en.wikipedia.org/wiki/Front_and_back_ends), has made it popular.

While you could directly install `Node.js`, you might wonder why you should install [NVM](https://github.com/nvm-sh/nvm). NVM (Node Version Manager) is a tool that allows you to install and manage multiple versions of `Node.js`. By using NVM, you gain the following benefits:

1. **Compatibility**: Different projects may require different `Node.js` versions. With NVM, you can set and use the appropriate version for each project.
2. **Convenience**: Switch between `Node.js` versions with a simple command.
3. **Stability**: If you want to test out a new version of `Node.js` that has experimental features, you can install and use it separately from your stable version.
4. **Updates and Rollbacks**: Easily install new versions of `Node.js` and rollback to previous versions if needed.

Thus, managing versions through `NVM` is more flexible and effective for development than just installing `Node.js`. Now, let's proceed with installing `NVM` and then `Node.js`.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=239" title="Install NVM (Node Version Manager) followed by Node.js installation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### NVM Installation

Visit the [nvm-windows](https://github.com/coreybutler/nvm-windows) website to download the installer. If you can't find it directly, you can download the latest `nvm-setup.exe` file from the [releases](https://github.com/coreybutler/nvm-windows/releases) page. As of August 20, 2023, `winget` does not support `nvm` 😔.

Once the installation is complete, open a terminal and enter:

```sh
nvm list
```
> If the response is `No installations recognized.`, it means the installation was successful.

### Node.js Installation

Install `Node.js` using the previously installed `NVM` with the command:

```sh
nvm install lts
```
> `lts` stands for `long term support`, which, as of August 20, 2023, is version `18.17.1`.

Next, select the `Node.js` version in `nvm`:

```sh
nvm use lts
```

If everything went correctly, you can check the installed `Node.js` version with the `node -v` command. Additionally, check the version of [npm](https://www.npmjs.com) with `npm -v`. Here, `npm` is a package management tool for `Node.js`, similar to `Homebrew`. In simple terms, `npm` is highly effective in managing software packages installed via `Node.js`.

In addition to `npm`, I recommend installing [yarn](https://yarnpkg.com). The installation process is simple as you can use `npm`. `Yarn` is a package manager developed by Meta (previously Facebook) and serves a similar purpose to `npm`. The main reason for recommending `Yarn` is that the upcoming [React Native](https://reactnative.dev) framework is developed by Meta. You can install `yarn` using the command below.

```sh
npm install - yarn
```

# 4. Installing Visual Studio Code

Next, we'll install [Visual Studio Code](https://code.visualstudio.com). Often referred to as `vscode`, it is one of the most beloved code editors by developers worldwide. In the past, editors like [edit plus](https://www.editplus.com), [sublime text](https://www.sublimetext.com), and the now discontinued [atom](https://github.blog/2022-06-08-sunsetting-atom) were predominantly used. However, due to the advanced features and user experience of `vscode`, many developers have switched to this editor.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=327" title="Installing Visual Studio Code" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

`Visual Studio Code` can be easily installed from the terminal using `winget` with the command below:

```sh
winget install Microsoft.VisualStudioCode
```

Once installed, open your `Powershell` profile with `vscode` to check if it's installed correctly.

```sh
code $PROFILE
```

If the profile file opens in the `vscode` text editor, it means the installation was successful. If not, restart the terminal and try again.

## 5. Git

`git` is widely used not only for software development but also in various fields as a project management and collaboration tool. Especially, many modern software and platforms provide integration features with `git`, enhancing user convenience. Hence, installing `git` in advance will make it easier and faster to join projects or manage your work using these tools and platforms later on.

### Installation

`git` is a core tool for code management and collaboration and can be easily installed in a Windows environment through `winget`.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=402" title="Git" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

You can simply install using the command below.

```sh
winget install Git.Git
```

After installation, restart the terminal and check the version with the `git --version` command to confirm it's correctly installed.

## 6. Android Studio

We will now install [Android Studio](https://developer.android.com/studio/install), which provides an integrated development environment for Android. It's also available through `winget`, making the installation process convenient.

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=455" title="Android Studio" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To install the stable version, use `Google.AndroidStudio`, and for the latest version, install `Google.AndroidStudio.Canary`. Here, we'll install the latest version.

```sh
winget install Google.AndroidStudio.Canary
```

After the installation, search for the `Android Studio` application and run it. Refer to the `Installation Video` to create a new application and launch the project. This is essential to fully set up the Android development environment.

### Post-installation Configuration

After installing `Android Studio`, there are a few environment settings required for Android development. First, check the path of the `Android SDK` in `Android Studio` settings. This path needs to be added to the Windows environment variables. The steps are as follows:

1. Go to `Windows Control Panel` ➡ ️`User Accounts` ➡️ `User Accounts`.
2. Click on `Change my environment variables`.
3. Choose `New Environment Variable`, name it `ANDROID_HOME`, and set its value to the `Android SDK` path.
4. Then, add the `platform-tools` path to the system environment variables. Use the `ANDROID_HOME` variable you just added and add `%ANDROID_HOME%\platform-tools` to the system variables.
5. After finalizing the settings, click `OK` to save the changes.

Once these settings are complete and you restart the terminal, the `adb` command will be recognized correctly. This indicates that the Android development environment has been correctly set up in the terminal.

# 7. React Native and Expo

Finally, we'll proceed with the installation of [React Native](https://reactnative.dev) which allows development for `iOS`, `Android`, and the `web`. 

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ThByD_7_2v4?start=677" title="React Native and Expo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To enrich and quickly start the React Native project, we'll use [dooboo-cli](https://medium.com/crossplatformkorea/%EC%83%88%EB%A1%9C%EC%9A%B4-dooboo-cli-5c60e17a87e0) managed by [DoobooLab](https://dooboolab.com).

Open the terminal and enter the following command:

```sh
npx dooboo init
```

> `npx` is a package runner tool for `npm`, introduced in the `npm` version 5.2.0 in 2017. It allows users to directly run npm registry commands without globally installing a package. This facilitates easy execution of the latest version of a package or running a package temporarily.

```sh
 _| _  _ |_  _  _ | _ |_
(_|(_)(_)|_)(_)(_)|(_||_)
```

When the above appears in the terminal and the `Expo (Typescript)` project shows up in a caption state, press `Enter` to continue. Next, type in the project name you desire and press `Enter` again to create the project.

> [Expo](https://docs.expo.dev) is an open-source platform for React Native that simplifies and accelerates mobile app development. With Expo, developers can immediately start a new project without initial setup, and easily access various native APIs. Moreover, Expo's development tools allow real-time previews with immediate updates, making the development and debugging process much more efficient.

Once you've moved to the project folder, use `yarn` to install necessary local packages. Then run the project using the `yarn start` command. Following that, entering either `a` or `w` in the terminal will launch the Android simulator or a web browser, respectively.
> If the web does not execute with `w`, try the `yarn web` command. If the Android emulator doesn't launch, use `Android Studio` to create a new emulator. For detailed information, refer to [Creating and Managing Android Virtual Devices](https://developer.android.com/studio/run/managing-avds).

### Testing on iOS
Projects created through `dooboo` utilize [Expo](https://expo.dev), so even in a Windows environment, you can run the app on an iOS device. However, for this, you'll need a physical iPhone. After executing the `yarn start` command, scan the displayed `QR` code to run the project through the [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) app. You can check out the detailed information and usage guide in the [Expo Go Official Documentation](https://docs.expo.dev/get-started/expo-go).

The installation is now complete. From here on, you can focus solely on coding 🎉.
