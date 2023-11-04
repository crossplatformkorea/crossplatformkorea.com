"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[271],{9565:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return a},default:function(){return p},frontMatter:function(){return r},metadata:function(){return l},toc:function(){return d}});var i=t(5893),s=t(3905),o=t(9388);const r={id:"macos",title:"Development Environment for Mac",sidebar_label:"Development Environment for Mac"},a="Development Environment",l={id:"react-native/development-environment/macos",title:"Development Environment for Mac",description:"In this section, we've prepared materials to help even those new to development set up their development environment. This is about the Mac development environment, so if you're a Windows user, please check out the Windows development environment.",source:"@site/docs/react-native/development-environment/macos.mdx",sourceDirName:"react-native/development-environment",slug:"/react-native/development-environment/macos",permalink:"/en/docs/current/react-native/development-environment/macos",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/development-environment/macos.mdx",tags:[],version:"current",frontMatter:{id:"macos",title:"Development Environment for Mac",sidebar_label:"Development Environment for Mac"},sidebar:"react-native",previous:{title:"Development Environment",permalink:"/en/docs/current/category/development-environment"},next:{title:"Development Environment for Windows",permalink:"/en/docs/current/react-native/development-environment/windows"}},c={},d=[{value:"1. Oh My Zsh",id:"1-oh-my-zsh",level:2},{value:"2. Homebrew",id:"2-homebrew",level:2},{value:"3. Install NVM (Node Version Manager) and then Node.js",id:"3-install-nvm-node-version-manager-and-then-nodejs",level:2},{value:"Installing NVM",id:"installing-nvm",level:3},{value:"Installing Node.js",id:"installing-nodejs",level:3},{value:"5. Android Development Environment",id:"5-android-development-environment",level:2},{value:"Watchman",id:"watchman",level:3},{value:"Java",id:"java",level:3},{value:"Android Studio",id:"android-studio",level:3},{value:"6. Visual Studio Code",id:"6-visual-studio-code",level:2},{value:"7. React Native and Expo",id:"7-react-native-and-expo",level:2}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,s.ah)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["In this section, we've prepared materials to help even those new to development set up their development environment. This is about the ",(0,i.jsx)(n.code,{children:"Mac development environment"}),", so if you're a Windows user, please check out the ",(0,i.jsx)(n.a,{href:"windows",children:"Windows development environment"}),"."]}),"\n",(0,i.jsx)(o.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,i.jsx)("div",{class:"video-container",style:{marginBottom:20},children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0,style:{marginBottom:20}})}),"\n",(0,i.jsx)(n.h1,{id:"development-environment",children:"Development Environment"}),"\n",(0,i.jsxs)(n.p,{children:["Starting from the macOS ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/MacOS_Catalina",children:"Catalina"})," version ",(0,i.jsx)(n.code,{children:"10.15"}),", ",(0,i.jsxs)(n.a,{href:"https://en.wikipedia.org/wiki/Z_shell",children:[(0,i.jsx)(n.code,{children:"zsh"}),"(Z shell)"]})," began to be used as the default shell. Previously, ",(0,i.jsxs)(n.a,{href:"https://en.wikipedia.org/wiki/Bash_(Unix_shell)",children:[(0,i.jsx)(n.code,{children:"bash"}),"(Bourne Again Shell)"]})," was the default shell for macOS. This change took place in Catalina, released in 2019. Among the reasons for this change was an issue related to the licensing of the GNU project's bash version."]}),"\n",(0,i.jsxs)(n.p,{children:["We also recommend installing ",(0,i.jsx)(n.a,{href:"https://ohmyz.sh",children:"oh my zsh"})," which further enriches the current default shell ",(0,i.jsx)(n.code,{children:"zsh"}),". It includes plugins and themes favored by developers worldwide, making development more approachable."]}),"\n",(0,i.jsx)(n.h2,{id:"1-oh-my-zsh",children:"1. Oh My Zsh"}),"\n",(0,i.jsx)(n.p,{children:"Now, let's install Oh My Zsh. For beginners, we provide an installation method through video."}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=6",title:"Oh My Zsh",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["First, visit the ",(0,i.jsx)(n.a,{href:"https://ohmyz.sh",children:"oh my zsh official website"}),". Then, scroll down and copy the command under ",(0,i.jsx)(n.code,{children:"Install oh-my-zsh via curl"})," and paste it into your terminal. The copied command is as follows:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Executing the command in the terminal will start the ",(0,i.jsx)(n.code,{children:"Oh My Zsh"})," installation. If a popup for ",(0,i.jsx)(n.code,{children:"command line developer tools"})," appears during installation, select 'Install'. ",(0,i.jsx)(n.code,{children:"git"})," is required for ",(0,i.jsx)(n.code,{children:"Oh My Zsh"})," installation, and this tool is provided by ",(0,i.jsx)(n.code,{children:"command line developer tools"}),". Thus, consider this tool essential for installation."]}),"\n",(0,i.jsx)(n.p,{children:"Once installed, it will be beautifully displayed in the terminal as:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"         __                                     __\n  ____  / /_     ____ ___  __  __   ____  _____/ /_\n / __ \\/ __ \\   / __ `__ \\/ / / /  /_  / / ___/ __ \\\n/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /\n\\____/_/ /_/  /_/ /_/ /_/\\__, /    /___/____/_/ /_/\n                        /____/\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Additionally, we will install ",(0,i.jsx)(n.a,{href:"https://github.com/zsh-users/zsh-syntax-highlighting",children:"zsh-syntax-highlighting"}),". Go to the ",(0,i.jsx)(n.a,{href:"https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md",children:"installation guide"})," and navigate to ",(0,i.jsx)(n.a,{href:"https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#in-your-zshrc",children:"In your ~/.zshrc"})," to copy the command below."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git\necho "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Paste and execute the command in the terminal to complete the installation. If you wish to specify a different download path, please refer to ",(0,i.jsx)(n.a,{href:"https://youtu.be/o3dfpDaICb4?t=53",children:"the video"})," below."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=53",title:"Zsh Syntax Highlighting",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["Once installed, recognizable commands in the terminal will appear in ",(0,i.jsx)(n.code,{children:"green"}),", and unrecognizable commands will appear in ",(0,i.jsx)(n.code,{children:"red"}),", enhancing the convenience of development."]}),"\n",(0,i.jsx)(n.h2,{id:"2-homebrew",children:"2. Homebrew"}),"\n",(0,i.jsxs)(n.p,{children:["Next, we will install the ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Package_manager",children:"package manager"})," for macOS called ",(0,i.jsx)(n.a,{href:"https://brew.sh",children:"Homebrew"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=74",title:"Homebrew",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.p,{children:"A package manager is a crucial tool for efficiently managing software dependencies within an OS. It might be challenging for those new to development to understand at first, but once you experience a package manager, you will clearly appreciate its significance and convenience."}),"\n",(0,i.jsxs)(n.p,{children:["The most popular package manager on Mac is ",(0,i.jsx)(n.a,{href:"https://brew.sh",children:"Homebrew"}),", and it can be easily installed using the command provided on the official page:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Copy and paste the command into your terminal. The shell will request your login password. Enter the password to proceed with the installation. During the installation, you may be prompted to press the ",(0,i.jsx)(n.code,{children:"Enter"})," key or other responses. Carefully read the terminal's prompt messages and proceed accordingly."]}),"\n",(0,i.jsx)(n.h2,{id:"3-install-nvm-node-version-manager-and-then-nodejs",children:"3. Install NVM (Node Version Manager) and then Node.js"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://nodejs.org",children:"Node.js"})," is a tool that allows ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/JavaScript",children:"JavaScript"})," to be executed outside the web browser. This has enabled the use of JavaScript when building servers or applications on computers. It allows for fast concurrent processing and has the advantage of being able to work in both ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Front_and_back_ends",children:"frontend and backend"})," using the same language."]}),"\n",(0,i.jsxs)(n.p,{children:["You might wonder why you need to install ",(0,i.jsx)(n.a,{href:"https://github.com/nvm-sh/nvm",children:"NVM"})," when you can just install ",(0,i.jsx)(n.code,{children:"Node.js"}),". ",(0,i.jsx)(n.code,{children:"NVM"})," (Node Version Manager) is a tool that allows you to install and manage multiple versions of ",(0,i.jsx)(n.code,{children:"Node.js"}),". If you install ",(0,i.jsx)(n.code,{children:"Node.js"})," directly, you can only use one version, but with ",(0,i.jsx)(n.code,{children:"NVM"}),", you can easily switch between different versions. This has several advantages:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Compatibility"}),": Different projects may require different versions of ",(0,i.jsx)(n.code,{children:"Node.js"}),". By using ",(0,i.jsx)(n.code,{children:"NVM"}),", you can set the appropriate version for each project."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Convenience"}),": You can easily switch between versions of ",(0,i.jsx)(n.code,{children:"Node.js"})," with a single command."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Stability"}),": If you want to test the latest version of ",(0,i.jsx)(n.code,{children:"Node.js"})," that includes experimental features, you can install and use it separately from the stable version."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Updates and Rollbacks"}),": You can easily install new versions of ",(0,i.jsx)(n.code,{children:"Node.js"})," and roll back to previous versions if there are issues."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Therefore, managing versions through ",(0,i.jsx)(n.code,{children:"NVM"})," is a much more flexible and effective method than just installing ",(0,i.jsx)(n.code,{children:"Node.js"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=106",title:"NVM and Node.js",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.h3,{id:"installing-nvm",children:"Installing NVM"}),"\n",(0,i.jsxs)(n.p,{children:["Now, to install ",(0,i.jsx)(n.code,{children:"NVM"}),", visit the ",(0,i.jsx)(n.a,{href:"https://github.com/nvm-sh/nvm",children:"official homepage"}),". Find and copy the command below, then paste it into your terminal."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Please note that the ",(0,i.jsx)(n.code,{children:"0.39.4"})," version number might increase over time."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Next, you'll need to modify ",(0,i.jsx)(n.code,{children:"~/.zshrc"}),". Developers can edit using tools like ",(0,i.jsx)(n.a,{href:"https://www.vim.org",children:"vim"}),", but if you're new to development, you can open it with the default ",(0,i.jsx)(n.code,{children:"TextEdit"})," program:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"open -a TextEdit ~/.zshrc\n"})}),"\n",(0,i.jsxs)(n.p,{children:["After opening ",(0,i.jsx)(n.code,{children:"TextEdit"}),", paste the following commands at the very bottom. Note that these commands will be displayed in the terminal after the ",(0,i.jsx)(n.code,{children:"nvm"})," installation is complete."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"  # This loads nvm\n[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Save and exit. Then reload your ",(0,i.jsx)(n.code,{children:"zsh"})," profile using the ",(0,i.jsx)(n.code,{children:"source ~/.zshrc"})," command. After this, you should be able to recognize the ",(0,i.jsx)(n.code,{children:"nvm"})," command."]}),"\n",(0,i.jsx)(n.h3,{id:"installing-nodejs",children:"Installing Node.js"}),"\n",(0,i.jsxs)(n.p,{children:["Now, using the previously installed ",(0,i.jsx)(n.code,{children:"NVM"}),", we'll install ",(0,i.jsx)(n.a,{href:"https://nodejs.org/",children:"Node.js"}),". First, check the installed versions using the ",(0,i.jsx)(n.code,{children:"nvm list"})," command (it should be empty if everything's right). Use the ",(0,i.jsx)(n.code,{children:"nvm install 18"})," command to install version 18 of ",(0,i.jsx)(n.code,{children:"Node.js"}),". Running ",(0,i.jsx)(n.code,{children:"nvm list"})," again, you should see the ",(0,i.jsx)(n.code,{children:"v18"})," version installed. Then finish the default settings with the following commands:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"nvm use 18\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["This sets ",(0,i.jsx)(n.code,{children:"Node.js"})," version ",(0,i.jsx)(n.code,{children:"18"})," in ",(0,i.jsx)(n.code,{children:"nvm"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"nvm alias default 18\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["This sets ",(0,i.jsx)(n.code,{children:"Node.js"})," version ",(0,i.jsx)(n.code,{children:"18"})," as the default in ",(0,i.jsx)(n.code,{children:"nvm"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Once installation is complete, you can check the installed ",(0,i.jsx)(n.code,{children:"Node.js"})," version using the ",(0,i.jsx)(n.code,{children:"node -v"})," command. Additionally, check the version of ",(0,i.jsx)(n.a,{href:"https://www.npmjs.com",children:"npm"})," using the ",(0,i.jsx)(n.code,{children:"npm -v"})," command. Here, ",(0,i.jsx)(n.code,{children:"npm"})," is a package manager for ",(0,i.jsx)(n.code,{children:"Node.js"}),", similar to ",(0,i.jsx)(n.code,{children:"Homebrew"}),". Simply put, ",(0,i.jsx)(n.code,{children:"npm"})," is very effective in managing software packages installed with ",(0,i.jsx)(n.code,{children:"Node.js"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["In addition to ",(0,i.jsx)(n.code,{children:"npm"}),", it's recommended to install ",(0,i.jsx)(n.a,{href:"https://yarnpkg.com",children:"yarn"}),". The installation process is straightforward using ",(0,i.jsx)(n.code,{children:"npm"}),". ",(0,i.jsx)(n.code,{children:"Yarn"})," is a package manager similar to ",(0,i.jsx)(n.code,{children:"npm"})," developed by Meta (previously Facebook). The main reason for installing ",(0,i.jsx)(n.code,{children:"Yarn"})," is because the upcoming ",(0,i.jsx)(n.a,{href:"https://reactnative.dev",children:"React Native"})," framework is developed by Meta. To install ",(0,i.jsx)(n.code,{children:"yarn"}),", use the following command:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"npm install -g yarn\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"-g"})," option stands for ",(0,i.jsx)(n.code,{children:"global"}),". Using this option installs the program globally, allowing you to access the installed program from anywhere in the terminal."]}),"\n",(0,i.jsx)(n.h1,{id:"4-ios-development-environment",children:"4. iOS Development Environment"}),"\n",(0,i.jsxs)(n.p,{children:["Let's set up the ",(0,i.jsx)(n.code,{children:"iOS"})," app development environment."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=167",title:"iOS Development Environment",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["Download ",(0,i.jsx)(n.a,{href:"https://developer.apple.com/xcode",children:"Xcode"})," from the ",(0,i.jsx)(n.a,{href:"https://www.apple.com/app-store",children:"App Store"}),". Note that you must access directly through the built-in App Store application on Mac instead of the App Store link."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Once installed, make sure that the ",(0,i.jsx)(n.a,{href:"https://mac.install.guide/commandlinetools/index.html",children:"Command Line Tools"})," are correctly installed. It's likely that it was already installed during the ",(0,i.jsx)(n.a,{href:"#1-oh-my-zsh",children:"1. Oh My Zsh"})," setup."]}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"Xcode Command Line Tools"})," provides essential compilers and various development tools for programming on macOS. Specifically, it includes ",(0,i.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Compiler",children:"compilers"})," like GCC and Clang, version control systems like ",(0,i.jsx)(n.a,{href:"https://git-scm.com",children:"Git"}),", and many UNIX-based command-line tools. These tools are essential when developing code or managing packages in the terminal without the Xcode IDE, and for compiling and installing in many development projects and software packages."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"5-android-development-environment",children:"5. Android Development Environment"}),"\n",(0,i.jsxs)(n.p,{children:["Next, we'll prepare the ",(0,i.jsx)(n.code,{children:"Android"})," app development environment."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=203",title:"Android Studio",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(n.h3,{id:"watchman",children:"Watchman"}),"\n",(0,i.jsxs)(n.p,{children:["Firstly, ",(0,i.jsx)(n.a,{href:"https://facebook.github.io/watchman",children:"watchman"})," is not directly related to Android, but as it might have been missed in the previous installation process, we'll guide the installation here to match the video sequence. ",(0,i.jsx)(n.code,{children:"Watchman"})," is a file system monitoring tool developed by ",(0,i.jsx)(n.code,{children:"Meta"}),". Using it improves the development experience in ",(0,i.jsx)(n.code,{children:"React Native"})," by quickly detecting real-time file changes. In ",(0,i.jsx)(n.code,{children:"RN"}),", it's recommended but not essential for efficient code change detection and seamless integration with the development server."]}),"\n",(0,i.jsx)(n.h3,{id:"java",children:"Java"}),"\n",(0,i.jsxs)(n.p,{children:["Next, install ",(0,i.jsx)(n.a,{href:"https://www.java.com",children:"java"})," using ",(0,i.jsx)(n.code,{children:"brew"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"brew tap homebrew/cask-versions\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"brew install --cask zulu11\n"})}),"\n",(0,i.jsx)(n.h3,{id:"android-studio",children:"Android Studio"}),"\n",(0,i.jsxs)(n.p,{children:["Lastly, install ",(0,i.jsx)(n.a,{href:"https://developer.android.com/studio/install",children:"Android Studio"}),". You can install via ",(0,i.jsx)(n.code,{children:"brew"}),", but the video shows how to download and install directly. Choose your installation method accordingly."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"brew install --cask android-studio\n"})}),"\n",(0,i.jsxs)(n.p,{children:["After installation, it's recommended to create a new Android project as per the video. This is to ensure the Android environment is correctly set up. If the Android project runs smoothly, the environment setup is successful. Next, you'll need to add the path of the ",(0,i.jsx)(n.code,{children:"Android SDK"})," to your ",(0,i.jsx)(n.code,{children:"zsh"})," profile. Use the command below to open your ",(0,i.jsx)(n.code,{children:"zsh"})," profile."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"open -a TextEdit ~/.zshrc\n"})}),"\n",(0,i.jsx)(n.p,{children:"Then, add the following environment variables at the bottom of the file:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"export ANDROID_HOME=$HOME/Library/Android/sdk\nexport PATH=$PATH:$ANDROID_HOME/emulator\nexport PATH=$PATH:$ANDROID_HOME/platform-tools\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Make sure the ",(0,i.jsx)(n.code,{children:"ANDROID_HOME"})," path is set correctly for your PC. You can check how to verify this in ",(0,i.jsx)(n.a,{href:"https://youtu.be/o3dfpDaICb4?t=332",children:"this video"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"6-visual-studio-code",children:"6. Visual Studio Code"}),"\n",(0,i.jsxs)(n.p,{children:["Next, we'll install ",(0,i.jsx)(n.a,{href:"https://code.visualstudio.com",children:"Visual Studio Code"}),". Often referred to as ",(0,i.jsx)(n.code,{children:"vscode"}),", it's one of the most beloved code editors among developers worldwide. In the past, editors like ",(0,i.jsx)(n.a,{href:"https://www.editplus.com",children:"edit plus"}),", ",(0,i.jsx)(n.a,{href:"https://www.sublimetext.com",children:"sublime text"}),", and the now-discontinued ",(0,i.jsx)(n.a,{href:"https://github.blog/2022-06-08-sunsetting-atom",children:"atom"})," were popular. However, many developers have since switched to ",(0,i.jsx)(n.code,{children:"vscode"})," due to its superior features and user experience."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=354",title:"Visual Studio Code",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["Install using ",(0,i.jsx)(n.code,{children:"brew"})," as follows:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"brew install --cask visual-studio-code\n"})}),"\n",(0,i.jsx)(n.h2,{id:"7-react-native-and-expo",children:"7. React Native and Expo"}),"\n",(0,i.jsxs)(n.p,{children:["Lastly, we'll install ",(0,i.jsx)(n.a,{href:"https://reactnative.dev",children:"React Native"}),", which allows for development across ",(0,i.jsx)(n.code,{children:"iOS"}),", ",(0,i.jsx)(n.code,{children:"Android"}),", and ",(0,i.jsx)(n.code,{children:"web"}),"."]}),"\n",(0,i.jsx)("div",{class:"video-container",children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=406",title:"NVM and Node.js",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsxs)(n.p,{children:["For a richer and quicker start to a React Native project, we'll use ",(0,i.jsx)(n.a,{href:"https://medium.com/crossplatformkorea/new-dooboo-cli-5c60e17a87e0",children:"dooboo-cli"}),", managed by ",(0,i.jsx)(n.a,{href:"https://dooboolab.com",children:"dooboolab"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Open the terminal and input:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"npx dooboo init\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"npx"})," is an npm package runner introduced in ",(0,i.jsx)(n.code,{children:"npm"})," version 5.2.0 in 2017. It lets users run package commands directly from the npm registry without globally installing them. This facilitates easy execution of the latest versions of specific packages or temporarily running packages."]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:" _| _  _ |_  _  _ | _ |_\n(_|(_)(_)|_)(_)(_)|(_||_)\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Once you see the above in the terminal and the ",(0,i.jsx)(n.code,{children:"Expo (Typescript)"})," project appears in the caption state, press the ",(0,i.jsx)(n.code,{children:"Enter"})," key to proceed. Then, input your desired project name and press ",(0,i.jsx)(n.code,{children:"Enter"})," to create the project."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://docs.expo.dev",children:"Expo"})," is an open-source platform for React Native, simplifying and accelerating mobile app development. Developers can instantly start new projects without initial setup using Expo, with easy access to various native APIs. Additionally, Expo's development tools allow real-time previews and instant updates, making the development and debugging process more efficient."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Navigate to the folder with the project name, use ",(0,i.jsx)(n.code,{children:"yarn"})," to install necessary local packages, and"]}),"\n",(0,i.jsx)(n.p,{children:"start the project:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"cd your-project-name\nyarn install\nyarn start\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Then, follow the on-screen prompts to launch your React Native app on the iOS simulator or Android emulator. Also, check out ",(0,i.jsx)(n.a,{href:"https://dooboo-ui.dooboolab.com",children:"dooboo-ui"}),", an open-source React Native UI kit developed by dooboolab for various components, designs, and utilities."]}),"\n",(0,i.jsx)(o.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function p(e={}){const{wrapper:n}={...(0,s.ah)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},3905:function(e,n,t){t.d(n,{ah:function(){return c}});var i=t(7294);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,i,s=function(e,n){if(null==e)return{};var t,i,s={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var l=i.createContext({}),c=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},d={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},h=i.forwardRef((function(e,n){var t=e.components,s=e.mdxType,o=e.originalType,l=e.parentName,h=a(e,["components","mdxType","originalType","parentName"]),p=c(t),m=s,u=p["".concat(l,".").concat(m)]||p[m]||d[m]||o;return t?i.createElement(u,r(r({ref:n},h),{},{components:t})):i.createElement(u,r({ref:n},h))}));h.displayName="MDXCreateElement"},7859:function(e,n,t){t.d(n,{Z:function(){return o}});var i=t(7294),s=t(5893);function o(e){var n=e.className,t=void 0===n?"adfit":n,o=e.style,r=e.unit,a=e.height,l=e.width;return(0,i.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),n=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",n.async="true",n.type="text/javascript",n.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",l.toString()),e.setAttribute("data-ad-height",a.toString()),e.setAttribute("data-ad-unit",r.toString()),document.querySelector("."+t).appendChild(e),document.querySelector("."+t).appendChild(n)}),100);return function(){clearTimeout(e)}}),[]),(0,s.jsx)("div",{style:o,children:(0,s.jsx)("div",{className:t})})}},9388:function(e,n,t){t.d(n,{Z:function(){return o}});t(7294);var i=t(7859),s=t(5893);function o(e){var n=e.unit,t=e.className,o=e.height,r=void 0===o?100:o,a=e.width,l=void 0===a?320:a,c=e.style;return(0,s.jsx)(i.Z,{unit:n,height:r,width:l,className:t,style:Object.assign({flex:1,marginTop:24,marginBottom:24},c)})}}}]);