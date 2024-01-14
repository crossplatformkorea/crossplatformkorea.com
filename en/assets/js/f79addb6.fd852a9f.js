"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[5136],{8455:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return l},default:function(){return p},frontMatter:function(){return r},metadata:function(){return a},toc:function(){return c}});var i=t(5893),o=t(1151),s=t(9388);const r={id:"windows",title:"Development Environment for Windows",sidebar_label:"Development Environment for Windows"},l="Development Environment",a={id:"react-native/development-environment/windows",title:"Development Environment for Windows",description:"<AdFitMobileBanner",source:"@site/docs/react-native/development-environment/windows.mdx",sourceDirName:"react-native/development-environment",slug:"/react-native/development-environment/windows",permalink:"/en/docs/current/react-native/development-environment/windows",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/development-environment/windows.mdx",tags:[],version:"current",frontMatter:{id:"windows",title:"Development Environment for Windows",sidebar_label:"Development Environment for Windows"},sidebar:"react-native",previous:{title:"Development Environment for Mac",permalink:"/en/docs/current/react-native/development-environment/macos"},next:{title:"VSCode Plugins",permalink:"/en/docs/current/react-native/development-environment/vscode-plugins"}},d={},c=[{value:"1. Winget",id:"1-winget",level:2},{value:"2. Oh My Posh",id:"2-oh-my-posh",level:2},{value:"Shell Configuration",id:"shell-configuration",level:3},{value:"3. Install NVM (Node Version Manager) followed by Node.js installation",id:"3-install-nvm-node-version-manager-followed-by-nodejs-installation",level:2},{value:"NVM Installation",id:"nvm-installation",level:3},{value:"Node.js Installation",id:"nodejs-installation",level:3},{value:"Install Bun",id:"install-bun",level:4},{value:"5. Git",id:"5-git",level:2},{value:"Installation",id:"installation",level:3},{value:"6. Android Studio",id:"6-android-studio",level:2},{value:"Post-installation Configuration",id:"post-installation-configuration",level:3},{value:"Testing on iOS",id:"testing-on-ios",level:3}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,i.jsxs)(n.p,{children:["In this section, we have prepared resources to help even those new to development set up their development environment. This is for a ",(0,i.jsx)(n.code,{children:"Windows development environment"}),", so if you're a Mac user, please check out ",(0,i.jsx)(n.a,{href:"macos",children:"Mac development environment"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",style:{marginBottom:20},children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4",title:"Development Environment for Windows",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.h1,{id:"development-environment",children:"Development Environment"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Winget"})," is the Windows Package Manager, a tool designed to automate the installation and management of software packages. Initially, it had to be installed separately, but starting with Windows 11 released in 2021, ",(0,i.jsx)(n.code,{children:"Winget"})," began to be included by default in the OS. Hence, from Windows 11 onwards, ",(0,i.jsx)(n.code,{children:"Winget"})," is pre-installed."]}),"\n",(0,i.jsxs)(n.p,{children:["Windows comes with a default shell called ",(0,i.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/powershell/scripting/overview",children:"Powershell"})," and released the ",(0,i.jsx)(n.a,{href:"https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701",children:"Windows Terminal"})," as a stable version in May 2020. ",(0,i.jsx)(n.code,{children:"Windows Terminal"})," is a terminal developed by Microsoft to overcome the limitations of the traditional ",(0,i.jsx)(n.code,{children:"cmd.exe"})," and adapt it to the modern development environment. With multi-tab support, GPU-accelerated rendering, customization options, and support for various shells, it offers a richer terminal experience. By default, ",(0,i.jsx)(n.code,{children:"Windows Terminal"})," uses ",(0,i.jsx)(n.code,{children:"PowerShell"})," as its shell, but this can be changed to the user's preference. Users can add a variety of shells, including ",(0,i.jsx)(n.code,{children:"cmd"}),", ",(0,i.jsx)(n.code,{children:"WSL"}),", or other custom shells. This allows users to choose the shell that best fits their environment and workflow."]}),"\n",(0,i.jsx)(n.p,{children:"Understanding the above will make the installation process much easier to grasp."}),"\n",(0,i.jsx)(n.h2,{id:"1-winget",children:"1. Winget"}),"\n",(0,i.jsxs)(n.p,{children:["As mentioned earlier, while ",(0,i.jsx)(n.code,{children:"Winget"})," is pre-installed by default, if for some reason it's not, run the ",(0,i.jsx)(n.a,{href:"https://www.microsoft.com/en-us/store/top-free/apps/pc",children:"Microsoft Store"})," and install ",(0,i.jsx)(n.a,{href:"https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1",children:"App Installer"}),". Then, open ",(0,i.jsx)(n.a,{href:"https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701",children:"Windows Terminal"})," and check if the ",(0,i.jsx)(n.code,{children:"winget"})," command works correctly."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Advantages of using Winget:"})}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Simplicity"}),": Install multiple programs with just one command, without the need for complex installation processes or downloading several installers."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Consistency"}),": All programs are installed in the same way, allowing users to skip the complex installation procedures of individual programs."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Version Control"}),": Useful when installing or updating a specific version of a program."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Script Support"}),": Bulk installation of multiple programs is possible through installation scripts, which is handy when setting up a new environment or restoring a system."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Safety"}),": Only packages verified from the official repository are provided, ensuring software downloads from trustworthy sources."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["In conclusion, using ",(0,i.jsx)(n.code,{children:"Winget"})," makes software installation and management more straightforward, allowing for consistent software management across various environments."]}),"\n",(0,i.jsx)(n.h2,{id:"2-oh-my-posh",children:"2. Oh My Posh"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Oh My Posh"})," is a prompt theme and configuration tool that helps customize the PowerShell or other shell environments on Windows to your liking. It's useful for users who want to see additional information or change to a more eye-catching style than what the default shell prompt provides. With ",(0,i.jsx)(n.code,{children:"Oh My Posh"})," installed, you can display various styles and colors for the current ",(0,i.jsx)(n.a,{href:"https://git-scm.com",children:"Git"})," status, working directory, execution success/failure indicators, making shell environments clearer and more efficient. This can significantly improve a developer's productivity and work convenience."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Git"})," is a version control system that helps track changes and facilitate collaboration when multiple people are working on the code. Even if you don't know about it now, you'll naturally learn about it as you work on development, so don't worry!"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Let's now install ",(0,i.jsx)(n.a,{href:"https://ohmyposh.dev",children:"Oh My Posh"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=33",title:"Oh My Posh",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["Please refer to the ",(0,i.jsx)(n.a,{href:"https://ohmyposh.dev/docs/installation/windows",children:"Official Homepage \u27a1 Docs \u27a1\ufe0f Get Started \u27a1\ufe0f Installation \u27a1\ufe0f Windows"})," section and enter the command below in the terminal."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"winget install JanDeDobbeleer.OhMyPosh -s winget\n"})}),"\n",(0,i.jsxs)(n.p,{children:["To prevent font issues in the terminal, we'll also install an additional font. Right-click on the ",(0,i.jsx)(n.code,{children:"Windows Terminal"})," and open it with ",(0,i.jsx)(n.code,{children:"administrator rights"}),". Then, install the font with the following command."]}),"\n",(0,i.jsx)(n.p,{children:"``sh\noh-my-posh font install"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'> Entering the command above prompts you to choose a font, where we\'ll install `FiraCode`.\n\n### Terminal Font Setting\n\nNext, open the configuration file in the terminal by pressing `CTRL + SHIFT + ,`. This will open a text editor where you should look for the "profiles" => "defaults" section and edit it as shown below:\n\n```json\n{\n  "profiles":\n  {\n    "defaults":\n    {\n      "font":\n      {\n        "face": "FiraCode Nerd Font"\n      }\n    }\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["In the terminal settings, if you navigate to ",(0,i.jsx)(n.code,{children:"Settings \u27a1\ufe0f Defaults \u27a1\ufe0f Appearance \u27a1\ufe0f Font face"}),", you should see that it's set to ",(0,i.jsx)(n.code,{children:"FiraCode Nerd Font"}),". If it's not, please refer to the ",(0,i.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/windows/terminal/install",children:"manual"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"shell-configuration",children:"Shell Configuration"}),"\n",(0,i.jsxs)(n.p,{children:["Now, let's finalize the ",(0,i.jsx)(n.code,{children:"Oh My Posh"})," configuration so it runs automatically whenever PowerShell starts:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"First, open PowerShell and enter the following command to create a profile configuration file:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"New-Item -Path $PROFILE -Type File -Force\n"})}),"\n",(0,i.jsx)(n.p,{children:"This command creates a profile configuration file for PowerShell."}),"\n",(0,i.jsxs)(n.ol,{start:"2",children:["\n",(0,i.jsx)(n.li,{children:"To open the created profile configuration file in Notepad, enter:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"notepad $PROFILE\n"})}),"\n",(0,i.jsxs)(n.ol,{start:"3",children:["\n",(0,i.jsxs)(n.li,{children:["Once Notepad is open, paste the following code. This ensures ",(0,i.jsx)(n.code,{children:"Oh My Posh"})," is run automatically whenever PowerShell starts."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"oh-my-posh init pwsh | Invoke-Expression\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Your setup is now complete. Every time you start PowerShell, ",(0,i.jsx)(n.code,{children:"Oh My Posh"})," configuration will be automatically applied."]}),"\n",(0,i.jsx)(n.h2,{id:"3-install-nvm-node-version-manager-followed-by-nodejs-installation",children:"3. Install NVM (Node Version Manager) followed by Node.js installation"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://nodejs.org/en",children:"Node.js"})," allows ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/JavaScript",children:"JavaScript"})," to run outside web browsers, enabling developers to use it for creating servers and applications on a computer. This concurrency capability, combined with the advantage of using the same language for both ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Front_and_back_ends",children:"frontend and backend"}),", has made it popular."]}),"\n",(0,i.jsxs)(n.p,{children:["While you could directly install ",(0,i.jsx)(n.code,{children:"Node.js"}),", you might wonder why you should install ",(0,i.jsx)(n.a,{href:"https://github.com/nvm-sh/nvm",children:"NVM"}),". NVM (Node Version Manager) is a tool that allows you to install and manage multiple versions of ",(0,i.jsx)(n.code,{children:"Node.js"}),". By using NVM, you gain the following benefits:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Compatibility"}),": Different projects may require different ",(0,i.jsx)(n.code,{children:"Node.js"})," versions. With NVM, you can set and use the appropriate version for each project."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Convenience"}),": Switch between ",(0,i.jsx)(n.code,{children:"Node.js"})," versions with a simple command."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Stability"}),": If you want to test out a new version of ",(0,i.jsx)(n.code,{children:"Node.js"})," that has experimental features, you can install and use it separately from your stable version."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Updates and Rollbacks"}),": Easily install new versions of ",(0,i.jsx)(n.code,{children:"Node.js"})," and rollback to previous versions if needed."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Thus, managing versions through ",(0,i.jsx)(n.code,{children:"NVM"})," is more flexible and effective for development than just installing ",(0,i.jsx)(n.code,{children:"Node.js"}),". Now, let's proceed with installing ",(0,i.jsx)(n.code,{children:"NVM"})," and then ",(0,i.jsx)(n.code,{children:"Node.js"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=239",title:"Install NVM (Node Version Manager) followed by Node.js installation",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.h3,{id:"nvm-installation",children:"NVM Installation"}),"\n",(0,i.jsxs)(n.p,{children:["Visit the ",(0,i.jsx)(n.a,{href:"https://github.com/coreybutler/nvm-windows",children:"nvm-windows"})," website to download the installer. If you can't find it directly, you can download the latest ",(0,i.jsx)(n.code,{children:"nvm-setup.exe"})," file from the ",(0,i.jsx)(n.a,{href:"https://github.com/coreybutler/nvm-windows/releases",children:"releases"})," page. As of August 20, 2023, ",(0,i.jsx)(n.code,{children:"winget"})," does not support ",(0,i.jsx)(n.code,{children:"nvm"})," \ud83d\ude14."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["External programs not installed via package managers cannot be recognized by the terminal without a restart. To add, theoretically, programs installed via ",(0,i.jsx)(n.code,{children:"winget"})," should be recognized without a restart. However, currently, as ",(0,i.jsx)(n.code,{children:"winget"})," often operates with older Windows installation systems, there are times when you have to close and reopen the terminal. A tip to note: if you install a program with ",(0,i.jsx)(n.code,{children:"winget"})," and a new window pops up to complete the installation, you'll likely need to restart the terminal to recognize the installed program."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Once the installation is complete, close and open a terminal and enter:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"nvm list\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["If the response is ",(0,i.jsx)(n.code,{children:"No installations recognized."}),", it means the installation was successful."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"nodejs-installation",children:"Node.js Installation"}),"\n",(0,i.jsxs)(n.p,{children:["Install ",(0,i.jsx)(n.code,{children:"Node.js"})," using the previously installed ",(0,i.jsx)(n.code,{children:"NVM"})," with the command:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"nvm install lts\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"lts"})," stands for ",(0,i.jsx)(n.code,{children:"long term support"}),", which, as of August 20, 2023, is version ",(0,i.jsx)(n.code,{children:"18.17.1"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Next, select the ",(0,i.jsx)(n.code,{children:"Node.js"})," version in ",(0,i.jsx)(n.code,{children:"nvm"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"nvm use lts\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If everything went correctly, you can check the installed ",(0,i.jsx)(n.code,{children:"Node.js"})," version with the ",(0,i.jsx)(n.code,{children:"node -v"})," command. Additionally, check the version of ",(0,i.jsx)(n.a,{href:"https://www.npmjs.com",children:"npm"})," with ",(0,i.jsx)(n.code,{children:"npm -v"}),". Here, ",(0,i.jsx)(n.code,{children:"npm"})," is a package management tool for ",(0,i.jsx)(n.code,{children:"Node.js"}),", similar to ",(0,i.jsx)(n.code,{children:"Homebrew"}),". In simple terms, ",(0,i.jsx)(n.code,{children:"npm"})," is highly effective in managing software packages installed via ",(0,i.jsx)(n.code,{children:"Node.js"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["In addition to ",(0,i.jsx)(n.code,{children:"npm"}),", I recommend installing ",(0,i.jsx)(n.a,{href:"https://yarnpkg.com",children:"yarn"}),". The installation process is simple as you can use ",(0,i.jsx)(n.code,{children:"npm"}),". ",(0,i.jsx)(n.code,{children:"Yarn"})," is a package manager developed by Meta (previously Facebook) and serves a similar purpose to ",(0,i.jsx)(n.code,{children:"npm"}),". The main reason for recommending ",(0,i.jsx)(n.code,{children:"Yarn"})," is that the upcoming ",(0,i.jsx)(n.a,{href:"https://reactnative.dev",children:"React Native"})," framework is developed by Meta. You can install ",(0,i.jsx)(n.code,{children:"yarn"})," using the command below."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"npm install - yarn\n"})}),"\n",(0,i.jsx)(n.h4,{id:"install-bun",children:"Install Bun"}),"\n",(0,i.jsxs)(n.p,{children:["From 2024, all community projects depends on ",(0,i.jsx)(n.a,{href:"https://bun.sh",children:"bun"}),". Therefore it is recommended to install bun globally."]}),"\n",(0,i.jsx)(n.h1,{id:"4-installing-visual-studio-code",children:"4. Installing Visual Studio Code"}),"\n",(0,i.jsxs)(n.p,{children:["Next, we'll install ",(0,i.jsx)(n.a,{href:"https://code.visualstudio.com",children:"Visual Studio Code"}),". Often referred to as ",(0,i.jsx)(n.code,{children:"vscode"}),", it is one of the most beloved code editors by developers worldwide. In the past, editors like ",(0,i.jsx)(n.a,{href:"https://www.editplus.com",children:"edit plus"}),", ",(0,i.jsx)(n.a,{href:"https://www.sublimetext.com",children:"sublime text"}),", and the now discontinued ",(0,i.jsx)(n.a,{href:"https://github.blog/2022-06-08-sunsetting-atom",children:"atom"})," were predominantly used. However, due to the advanced features and user experience of ",(0,i.jsx)(n.code,{children:"vscode"}),", many developers have switched to this editor."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=327",title:"Installing Visual Studio Code",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Visual Studio Code"})," can be easily installed from the terminal using ",(0,i.jsx)(n.code,{children:"winget"})," with the command below:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"winget install Microsoft.VisualStudioCode\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Once installed, open your ",(0,i.jsx)(n.code,{children:"Powershell"})," profile with ",(0,i.jsx)(n.code,{children:"vscode"})," to check if it's installed correctly."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"code $PROFILE\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If the profile file opens in the ",(0,i.jsx)(n.code,{children:"vscode"})," text editor, it means the installation was successful. If not, restart the terminal and try again."]}),"\n",(0,i.jsx)(n.h2,{id:"5-git",children:"5. Git"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"git"})," is widely used not only for software development but also in various fields as a project management and collaboration tool. Especially, many modern software and platforms provide integration features with ",(0,i.jsx)(n.code,{children:"git"}),", enhancing user convenience. Hence, installing ",(0,i.jsx)(n.code,{children:"git"})," in advance will make it easier and faster to join projects or manage your work using these tools and platforms later on."]}),"\n",(0,i.jsx)(n.h3,{id:"installation",children:"Installation"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"git"})," is a core tool for code management and collaboration and can be easily installed in a Windows environment through ",(0,i.jsx)(n.code,{children:"winget"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=402",title:"Git",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.p,{children:"You can simply install using the command below."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"winget install Git.Git\n"})}),"\n",(0,i.jsxs)(n.p,{children:["After installation, restart the terminal and check the version with the ",(0,i.jsx)(n.code,{children:"git --version"})," command to confirm it's correctly installed."]}),"\n",(0,i.jsx)(n.h2,{id:"6-android-studio",children:"6. Android Studio"}),"\n",(0,i.jsxs)(n.p,{children:["We will now install ",(0,i.jsx)(n.a,{href:"https://developer.android.com/studio/install",children:"Android Studio"}),", which provides an integrated development environment for Android. It's also available through ",(0,i.jsx)(n.code,{children:"winget"}),", making the installation process convenient."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=455",title:"Android Studio",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["To install the stable version, use ",(0,i.jsx)(n.code,{children:"Google.AndroidStudio"}),", and for the latest version, install ",(0,i.jsx)(n.code,{children:"Google.AndroidStudio.Canary"}),". Here, we'll install the latest version."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"winget install Google.AndroidStudio.Canary\n"})}),"\n",(0,i.jsxs)(n.p,{children:["After the installation, search for the ",(0,i.jsx)(n.code,{children:"Android Studio"})," application and run it. Refer to the ",(0,i.jsx)(n.code,{children:"Installation Video"})," to create a new application and launch the project. This is essential to fully set up the Android development environment."]}),"\n",(0,i.jsx)(n.h3,{id:"post-installation-configuration",children:"Post-installation Configuration"}),"\n",(0,i.jsxs)(n.p,{children:["After installing ",(0,i.jsx)(n.code,{children:"Android Studio"}),", there are a few environment settings required for Android development. First, check the path of the ",(0,i.jsx)(n.code,{children:"Android SDK"})," in ",(0,i.jsx)(n.code,{children:"Android Studio"})," settings. This path needs to be added to the Windows environment variables. The steps are as follows:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Go to ",(0,i.jsx)(n.code,{children:"Windows Control Panel"})," \u27a1 \ufe0f",(0,i.jsx)(n.code,{children:"User Accounts"})," \u27a1\ufe0f ",(0,i.jsx)(n.code,{children:"User Accounts"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Click on ",(0,i.jsx)(n.code,{children:"Change my environment variables"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Choose ",(0,i.jsx)(n.code,{children:"New Environment Variable"}),", name it ",(0,i.jsx)(n.code,{children:"ANDROID_HOME"}),", and set its value to the ",(0,i.jsx)(n.code,{children:"Android SDK"})," path."]}),"\n",(0,i.jsxs)(n.li,{children:["Then, add the ",(0,i.jsx)(n.code,{children:"platform-tools"})," path to the system environment variables. Use the ",(0,i.jsx)(n.code,{children:"ANDROID_HOME"})," variable you just added and add ",(0,i.jsx)(n.code,{children:"%ANDROID_HOME%\\platform-tools"})," to the system variables."]}),"\n",(0,i.jsxs)(n.li,{children:["After finalizing the settings, click ",(0,i.jsx)(n.code,{children:"OK"})," to save the changes."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Once these settings are complete and you restart the terminal, the ",(0,i.jsx)(n.code,{children:"adb"})," command will be recognized correctly. This indicates that the Android development environment has been correctly set up in the terminal."]}),"\n",(0,i.jsx)(n.h1,{id:"7-react-native-and-expo",children:"7. React Native and Expo"}),"\n",(0,i.jsxs)(n.p,{children:["Finally, we'll proceed with the installation of ",(0,i.jsx)(n.a,{href:"https://reactnative.dev",children:"React Native"})," which allows development for ",(0,i.jsx)(n.code,{children:"iOS"}),", ",(0,i.jsx)(n.code,{children:"Android"}),", and the ",(0,i.jsx)(n.code,{children:"web"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=677",title:"React Native and Expo",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["To enrich and quickly start the React Native project, we'll use ",(0,i.jsx)(n.a,{href:"https://medium.com/crossplatformkorea/%EC%83%88%EB%A1%9C%EC%9A%B4-dooboo-cli-5c60e17a87e0",children:"dooboo-cli"})," managed by ",(0,i.jsx)(n.a,{href:"https://dooboolab.com",children:"DoobooLab"}),".\nOpen the terminal and enter the following command:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"npx dooboo init\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"npx"})," is a package runner tool for ",(0,i.jsx)(n.code,{children:"npm"}),", introduced in the ",(0,i.jsx)(n.code,{children:"npm"})," version 5.2.0 in 2017. It allows users to directly run npm registry commands without globally installing a package. This facilitates easy execution of the latest version of a package or running a package temporarily."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:" _| _  _ |_  _  _ | _ |_\n(_|(_)(_)|_)(_)(_)|(_||_)\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When the above appears in the terminal and the ",(0,i.jsx)(n.code,{children:"Expo (Typescript)"})," project shows up in a caption state, press ",(0,i.jsx)(n.code,{children:"Enter"})," to continue. Next, type in the project name you desire and press ",(0,i.jsx)(n.code,{children:"Enter"})," again to create the project."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://docs.expo.dev",children:"Expo"})," is an open-source platform for React Native that simplifies and accelerates mobile app development. With Expo, developers can immediately start a new project without initial setup, and easily access various native APIs. Moreover, Expo's development tools allow real-time previews with immediate updates, making the development and debugging process much more efficient."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Once you've moved to the project folder, use ",(0,i.jsx)(n.code,{children:"bun"})," to install necessary local packages. Then run the project using the ",(0,i.jsx)(n.code,{children:"bun start"})," command. Following that, entering either ",(0,i.jsx)(n.code,{children:"a"})," or ",(0,i.jsx)(n.code,{children:"w"})," in the terminal will launch the Android simulator or a web browser, respectively."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["If the web does not execute with ",(0,i.jsx)(n.code,{children:"w"}),", try the ",(0,i.jsx)(n.code,{children:"bun web"})," command. If the Android emulator doesn't launch, use ",(0,i.jsx)(n.code,{children:"Android Studio"})," to create a new emulator. For detailed information, refer to ",(0,i.jsx)(n.a,{href:"https://developer.android.com/studio/run/managing-avds",children:"Creating and Managing Android Virtual Devices"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"testing-on-ios",children:"Testing on iOS"}),"\n",(0,i.jsxs)(n.p,{children:["Projects created through ",(0,i.jsx)(n.code,{children:"dooboo"})," utilize ",(0,i.jsx)(n.a,{href:"https://expo.dev",children:"Expo"}),", so even in a Windows environment, you can run the app on an iOS device. However, for this, you'll need a physical iPhone. After executing the ",(0,i.jsx)(n.code,{children:"bun start"})," command, scan the displayed ",(0,i.jsx)(n.code,{children:"QR"})," code to run the project through the ",(0,i.jsx)(n.a,{href:"https://apps.apple.com/us/app/expo-go/id982107779",children:"Expo Go"})," app. You can check out the detailed information and usage guide in the ",(0,i.jsx)(n.a,{href:"https://docs.expo.dev/get-started/expo-go",children:"Expo Go Official Documentation"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"The installation is now complete. From here on, you can focus solely on coding \ud83c\udf89."}),"\n",(0,i.jsx)(s.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function p(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},7859:function(e,n,t){t.d(n,{Z:function(){return s}});var i=t(7294),o=t(5893);function s(e){let{className:n="adfit",style:t,unit:s,height:r,width:l}=e;return(0,i.useEffect)((()=>{const e=setTimeout((()=>{let e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",l.toString()),e.setAttribute("data-ad-height",r.toString()),e.setAttribute("data-ad-unit",s.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return()=>{clearTimeout(e)}}),[]),(0,o.jsx)("div",{style:t,children:(0,o.jsx)("div",{className:n})})}},9388:function(e,n,t){t.d(n,{Z:function(){return s}});t(7294);var i=t(7859),o=t(5893);function s(e){let{unit:n,className:t,height:s=100,width:r=320,style:l}=e;return(0,o.jsx)(i.Z,{unit:n,height:s,width:r,className:t,style:{flex:1,marginTop:24,marginBottom:24,...l}})}},1151:function(e,n,t){t.d(n,{Z:function(){return l},a:function(){return r}});var i=t(7294);const o={},s=i.createContext(o);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);