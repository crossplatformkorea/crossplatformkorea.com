"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[4527],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return u}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=p(n),u=o,h=c["".concat(s,".").concat(u)]||c[u]||m[u]||i;return n?a.createElement(h,r(r({ref:t},d),{},{components:n})):a.createElement(h,r({ref:t},d))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,r[1]=l;for(var p=2;p<i;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294);function o(e){var t=e.className,n=void 0===t?"adfit":t,o=e.style,i=e.unit,r=e.height,l=e.width;return(0,a.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",l.toString()),e.setAttribute("data-ad-height",r.toString()),e.setAttribute("data-ad-unit",i.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),a.createElement("div",{style:o},a.createElement("div",{className:n}))}},6408:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(7294),o=n(7859);function i(){return a.createElement(o.Z,{unit:"DAN-weLLBNA8C31gpo1t",height:100,width:320,className:"adfit-top-mobile",style:{flex:1,marginTop:24,marginBottom:24}})}},2037:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return p},default:function(){return h},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return c}});var a=n(7462),o=n(3366),i=(n(7294),n(3905)),r=n(6408),l=["components"],s={id:"development-environment-windows",title:"Development Environment for Windows",sidebar_label:"Development Environment for Windows"},p=void 0,d={unversionedId:"react-native/development-environment-windows",id:"react-native/development-environment-windows",title:"Development Environment for Windows",description:"In this section, we have prepared resources to help even those new to development set up their development environment. This is for a Windows development environment, so if you're a Mac user, please check out Mac development environment.",source:"@site/docs/react-native/1-2-development-environment-windows.mdx",sourceDirName:"react-native",slug:"/react-native/development-environment-windows",permalink:"/en/docs/current/react-native/development-environment-windows",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/1-2-development-environment-windows.mdx",tags:[],version:"current",frontMatter:{id:"development-environment-windows",title:"Development Environment for Windows",sidebar_label:"Development Environment for Windows"},sidebar:"react-native",previous:{title:"Development Environment for Mac",permalink:"/en/docs/current/react-native/development-environment-mac"},next:{title:"VSCode Plugins",permalink:"/en/docs/current/react-native/vscode-plugins"}},m={},c=[{value:"1. Winget",id:"1-winget",level:2},{value:"2. Oh My Posh",id:"2-oh-my-posh",level:2},{value:"Shell Configuration",id:"shell-configuration",level:3},{value:"3. Install NVM (Node Version Manager) followed by Node.js installation",id:"3-install-nvm-node-version-manager-followed-by-nodejs-installation",level:2},{value:"NVM Installation",id:"nvm-installation",level:3},{value:"Node.js Installation",id:"nodejs-installation",level:3},{value:"5. Git",id:"5-git",level:2},{value:"Installation",id:"installation",level:3},{value:"6. Android Studio",id:"6-android-studio",level:2},{value:"Post-installation Configuration",id:"post-installation-configuration",level:3},{value:"Testing on iOS",id:"testing-on-ios",level:3}],u={toc:c};function h(e){var t=e.components,n=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(r.Z,{mdxType:"AdFitTopFixed"}),(0,i.kt)("p",null,"In this section, we have prepared resources to help even those new to development set up their development environment. This is for a ",(0,i.kt)("inlineCode",{parentName:"p"},"Windows development environment"),", so if you're a Mac user, please check out ",(0,i.kt)("a",{parentName:"p",href:"development-environment-mac"},"Mac development environment"),"."),(0,i.kt)("div",{class:"video-container",style:{marginBottom:20}},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4",title:"Development Environment for Windows",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("h1",{id:"development-environment"},"Development Environment"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Winget")," is the Windows Package Manager, a tool designed to automate the installation and management of software packages. Initially, it had to be installed separately, but starting with Windows 11 released in 2021, ",(0,i.kt)("inlineCode",{parentName:"p"},"Winget")," began to be included by default in the OS. Hence, from Windows 11 onwards, ",(0,i.kt)("inlineCode",{parentName:"p"},"Winget")," is pre-installed."),(0,i.kt)("p",null,"Windows comes with a default shell called ",(0,i.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/powershell/scripting/overview"},"Powershell")," and released the ",(0,i.kt)("a",{parentName:"p",href:"https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701"},"Windows Terminal")," as a stable version in May 2020. ",(0,i.kt)("inlineCode",{parentName:"p"},"Windows Terminal")," is a terminal developed by Microsoft to overcome the limitations of the traditional ",(0,i.kt)("inlineCode",{parentName:"p"},"cmd.exe")," and adapt it to the modern development environment. With multi-tab support, GPU-accelerated rendering, customization options, and support for various shells, it offers a richer terminal experience. By default, ",(0,i.kt)("inlineCode",{parentName:"p"},"Windows Terminal")," uses ",(0,i.kt)("inlineCode",{parentName:"p"},"PowerShell")," as its shell, but this can be changed to the user's preference. Users can add a variety of shells, including ",(0,i.kt)("inlineCode",{parentName:"p"},"cmd"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"WSL"),", or other custom shells. This allows users to choose the shell that best fits their environment and workflow."),(0,i.kt)("p",null,"Understanding the above will make the installation process much easier to grasp."),(0,i.kt)("h2",{id:"1-winget"},"1. Winget"),(0,i.kt)("p",null,"As mentioned earlier, while ",(0,i.kt)("inlineCode",{parentName:"p"},"Winget")," is pre-installed by default, if for some reason it's not, run the ",(0,i.kt)("a",{parentName:"p",href:"https://www.microsoft.com/en-us/store/top-free/apps/pc"},"Microsoft Store")," and install ",(0,i.kt)("a",{parentName:"p",href:"https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1"},"App Installer"),". Then, open ",(0,i.kt)("a",{parentName:"p",href:"https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701"},"Windows Terminal")," and check if the ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," command works correctly."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Advantages of using Winget:")),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Simplicity"),": Install multiple programs with just one command, without the need for complex installation processes or downloading several installers."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Consistency"),": All programs are installed in the same way, allowing users to skip the complex installation procedures of individual programs."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Version Control"),": Useful when installing or updating a specific version of a program."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Script Support"),": Bulk installation of multiple programs is possible through installation scripts, which is handy when setting up a new environment or restoring a system."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Safety"),": Only packages verified from the official repository are provided, ensuring software downloads from trustworthy sources.")),(0,i.kt)("p",null,"In conclusion, using ",(0,i.kt)("inlineCode",{parentName:"p"},"Winget")," makes software installation and management more straightforward, allowing for consistent software management across various environments."),(0,i.kt)("h2",{id:"2-oh-my-posh"},"2. Oh My Posh"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Posh")," is a prompt theme and configuration tool that helps customize the PowerShell or other shell environments on Windows to your liking. It's useful for users who want to see additional information or change to a more eye-catching style than what the default shell prompt provides. With ",(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Posh")," installed, you can display various styles and colors for the current ",(0,i.kt)("a",{parentName:"p",href:"https://git-scm.com"},"Git")," status, working directory, execution success/failure indicators, making shell environments clearer and more efficient. This can significantly improve a developer's productivity and work convenience."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"Git")," is a version control system that helps track changes and facilitate collaboration when multiple people are working on the code. Even if you don't know about it now, you'll naturally learn about it as you work on development, so don't worry!")),(0,i.kt)("p",null,"Let's now install ",(0,i.kt)("a",{parentName:"p",href:"https://ohmyposh.dev"},"Oh My Posh"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=33",title:"Oh My Posh",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"Please refer to the ",(0,i.kt)("a",{parentName:"p",href:"https://ohmyposh.dev/docs/installation/windows"},"Official Homepage \u27a1 Docs \u27a1\ufe0f Get Started \u27a1\ufe0f Installation \u27a1\ufe0f Windows")," section and enter the command below in the terminal."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"winget install JanDeDobbeleer.OhMyPosh -s winget\n")),(0,i.kt)("p",null,"To prevent font issues in the terminal, we'll also install an additional font. Right-click on the ",(0,i.kt)("inlineCode",{parentName:"p"},"Windows Terminal")," and open it with ",(0,i.kt)("inlineCode",{parentName:"p"},"administrator rights"),". Then, install the font with the following command."),(0,i.kt)("p",null,"``sh\noh-my-posh font install"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'> Entering the command above prompts you to choose a font, where we\'ll install `FiraCode`.\n\n### Terminal Font Setting\n\nNext, open the configuration file in the terminal by pressing `CTRL + SHIFT + ,`. This will open a text editor where you should look for the "profiles" => "defaults" section and edit it as shown below:\n\n```json\n{\n  "profiles":\n  {\n    "defaults":\n    {\n      "font":\n      {\n        "face": "FiraCode Nerd Font"\n      }\n    }\n  }\n}\n')),(0,i.kt)("p",null,"In the terminal settings, if you navigate to ",(0,i.kt)("inlineCode",{parentName:"p"},"Settings \u27a1\ufe0f Defaults \u27a1\ufe0f Appearance \u27a1\ufe0f Font face"),", you should see that it's set to ",(0,i.kt)("inlineCode",{parentName:"p"},"FiraCode Nerd Font"),". If it's not, please refer to the ",(0,i.kt)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/windows/terminal/install"},"manual"),"."),(0,i.kt)("h3",{id:"shell-configuration"},"Shell Configuration"),(0,i.kt)("p",null,"Now, let's finalize the ",(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Posh")," configuration so it runs automatically whenever PowerShell starts:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"First, open PowerShell and enter the following command to create a profile configuration file:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"New-Item -Path $PROFILE -Type File -Force\n")),(0,i.kt)("p",null,"This command creates a profile configuration file for PowerShell."),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"To open the created profile configuration file in Notepad, enter:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"notepad $PROFILE\n")),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"Once Notepad is open, paste the following code. This ensures ",(0,i.kt)("inlineCode",{parentName:"li"},"Oh My Posh")," is run automatically whenever PowerShell starts.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"oh-my-posh init pwsh | Invoke-Expression\n")),(0,i.kt)("p",null,"Your setup is now complete. Every time you start PowerShell, ",(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Posh")," configuration will be automatically applied."),(0,i.kt)("h2",{id:"3-install-nvm-node-version-manager-followed-by-nodejs-installation"},"3. Install NVM (Node Version Manager) followed by Node.js installation"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/en"},"Node.js")," allows ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/JavaScript"},"JavaScript")," to run outside web browsers, enabling developers to use it for creating servers and applications on a computer. This concurrency capability, combined with the advantage of using the same language for both ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Front_and_back_ends"},"frontend and backend"),", has made it popular."),(0,i.kt)("p",null,"While you could directly install ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),", you might wonder why you should install ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/nvm-sh/nvm"},"NVM"),". NVM (Node Version Manager) is a tool that allows you to install and manage multiple versions of ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),". By using NVM, you gain the following benefits:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Compatibility"),": Different projects may require different ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," versions. With NVM, you can set and use the appropriate version for each project."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Convenience"),": Switch between ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," versions with a simple command."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Stability"),": If you want to test out a new version of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," that has experimental features, you can install and use it separately from your stable version."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Updates and Rollbacks"),": Easily install new versions of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," and rollback to previous versions if needed.")),(0,i.kt)("p",null,"Thus, managing versions through ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM")," is more flexible and effective for development than just installing ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),". Now, let's proceed with installing ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM")," and then ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=239",title:"Install NVM (Node Version Manager) followed by Node.js installation",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("h3",{id:"nvm-installation"},"NVM Installation"),(0,i.kt)("p",null,"Visit the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/coreybutler/nvm-windows"},"nvm-windows")," website to download the installer. If you can't find it directly, you can download the latest ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm-setup.exe")," file from the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/coreybutler/nvm-windows/releases"},"releases")," page. As of August 20, 2023, ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," does not support ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm")," \ud83d\ude14."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"External programs not installed via package managers cannot be recognized by the terminal without a restart. To add, theoretically, programs installed via ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," should be recognized without a restart. However, currently, as ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," often operates with older Windows installation systems, there are times when you have to close and reopen the terminal. A tip to note: if you install a program with ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," and a new window pops up to complete the installation, you'll likely need to restart the terminal to recognize the installed program.")),(0,i.kt)("p",null,"Once the installation is complete, close and open a terminal and enter:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"nvm list\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"If the response is ",(0,i.kt)("inlineCode",{parentName:"p"},"No installations recognized."),", it means the installation was successful.")),(0,i.kt)("h3",{id:"nodejs-installation"},"Node.js Installation"),(0,i.kt)("p",null,"Install ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," using the previously installed ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM")," with the command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"nvm install lts\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"lts")," stands for ",(0,i.kt)("inlineCode",{parentName:"p"},"long term support"),", which, as of August 20, 2023, is version ",(0,i.kt)("inlineCode",{parentName:"p"},"18.17.1"),".")),(0,i.kt)("p",null,"Next, select the ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," version in ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"nvm use lts\n")),(0,i.kt)("p",null,"If everything went correctly, you can check the installed ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," version with the ",(0,i.kt)("inlineCode",{parentName:"p"},"node -v")," command. Additionally, check the version of ",(0,i.kt)("a",{parentName:"p",href:"https://www.npmjs.com"},"npm")," with ",(0,i.kt)("inlineCode",{parentName:"p"},"npm -v"),". Here, ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," is a package management tool for ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),", similar to ",(0,i.kt)("inlineCode",{parentName:"p"},"Homebrew"),". In simple terms, ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," is highly effective in managing software packages installed via ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),"."),(0,i.kt)("p",null,"In addition to ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),", I recommend installing ",(0,i.kt)("a",{parentName:"p",href:"https://yarnpkg.com"},"yarn"),". The installation process is simple as you can use ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),". ",(0,i.kt)("inlineCode",{parentName:"p"},"Yarn")," is a package manager developed by Meta (previously Facebook) and serves a similar purpose to ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),". The main reason for recommending ",(0,i.kt)("inlineCode",{parentName:"p"},"Yarn")," is that the upcoming ",(0,i.kt)("a",{parentName:"p",href:"https://reactnative.dev"},"React Native")," framework is developed by Meta. You can install ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn")," using the command below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"npm install - yarn\n")),(0,i.kt)("h1",{id:"4-installing-visual-studio-code"},"4. Installing Visual Studio Code"),(0,i.kt)("p",null,"Next, we'll install ",(0,i.kt)("a",{parentName:"p",href:"https://code.visualstudio.com"},"Visual Studio Code"),". Often referred to as ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode"),", it is one of the most beloved code editors by developers worldwide. In the past, editors like ",(0,i.kt)("a",{parentName:"p",href:"https://www.editplus.com"},"edit plus"),", ",(0,i.kt)("a",{parentName:"p",href:"https://www.sublimetext.com"},"sublime text"),", and the now discontinued ",(0,i.kt)("a",{parentName:"p",href:"https://github.blog/2022-06-08-sunsetting-atom"},"atom")," were predominantly used. However, due to the advanced features and user experience of ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode"),", many developers have switched to this editor."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=327",title:"Installing Visual Studio Code",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Visual Studio Code")," can be easily installed from the terminal using ",(0,i.kt)("inlineCode",{parentName:"p"},"winget")," with the command below:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"winget install Microsoft.VisualStudioCode\n")),(0,i.kt)("p",null,"Once installed, open your ",(0,i.kt)("inlineCode",{parentName:"p"},"Powershell")," profile with ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode")," to check if it's installed correctly."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"code $PROFILE\n")),(0,i.kt)("p",null,"If the profile file opens in the ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode")," text editor, it means the installation was successful. If not, restart the terminal and try again."),(0,i.kt)("h2",{id:"5-git"},"5. Git"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"git")," is widely used not only for software development but also in various fields as a project management and collaboration tool. Especially, many modern software and platforms provide integration features with ",(0,i.kt)("inlineCode",{parentName:"p"},"git"),", enhancing user convenience. Hence, installing ",(0,i.kt)("inlineCode",{parentName:"p"},"git")," in advance will make it easier and faster to join projects or manage your work using these tools and platforms later on."),(0,i.kt)("h3",{id:"installation"},"Installation"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"git")," is a core tool for code management and collaboration and can be easily installed in a Windows environment through ",(0,i.kt)("inlineCode",{parentName:"p"},"winget"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=402",title:"Git",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"You can simply install using the command below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"winget install Git.Git\n")),(0,i.kt)("p",null,"After installation, restart the terminal and check the version with the ",(0,i.kt)("inlineCode",{parentName:"p"},"git --version")," command to confirm it's correctly installed."),(0,i.kt)("h2",{id:"6-android-studio"},"6. Android Studio"),(0,i.kt)("p",null,"We will now install ",(0,i.kt)("a",{parentName:"p",href:"https://developer.android.com/studio/install"},"Android Studio"),", which provides an integrated development environment for Android. It's also available through ",(0,i.kt)("inlineCode",{parentName:"p"},"winget"),", making the installation process convenient."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=455",title:"Android Studio",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"To install the stable version, use ",(0,i.kt)("inlineCode",{parentName:"p"},"Google.AndroidStudio"),", and for the latest version, install ",(0,i.kt)("inlineCode",{parentName:"p"},"Google.AndroidStudio.Canary"),". Here, we'll install the latest version."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"winget install Google.AndroidStudio.Canary\n")),(0,i.kt)("p",null,"After the installation, search for the ",(0,i.kt)("inlineCode",{parentName:"p"},"Android Studio")," application and run it. Refer to the ",(0,i.kt)("inlineCode",{parentName:"p"},"Installation Video")," to create a new application and launch the project. This is essential to fully set up the Android development environment."),(0,i.kt)("h3",{id:"post-installation-configuration"},"Post-installation Configuration"),(0,i.kt)("p",null,"After installing ",(0,i.kt)("inlineCode",{parentName:"p"},"Android Studio"),", there are a few environment settings required for Android development. First, check the path of the ",(0,i.kt)("inlineCode",{parentName:"p"},"Android SDK")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"Android Studio")," settings. This path needs to be added to the Windows environment variables. The steps are as follows:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Go to ",(0,i.kt)("inlineCode",{parentName:"li"},"Windows Control Panel")," \u27a1 \ufe0f",(0,i.kt)("inlineCode",{parentName:"li"},"User Accounts")," \u27a1\ufe0f ",(0,i.kt)("inlineCode",{parentName:"li"},"User Accounts"),"."),(0,i.kt)("li",{parentName:"ol"},"Click on ",(0,i.kt)("inlineCode",{parentName:"li"},"Change my environment variables"),"."),(0,i.kt)("li",{parentName:"ol"},"Choose ",(0,i.kt)("inlineCode",{parentName:"li"},"New Environment Variable"),", name it ",(0,i.kt)("inlineCode",{parentName:"li"},"ANDROID_HOME"),", and set its value to the ",(0,i.kt)("inlineCode",{parentName:"li"},"Android SDK")," path."),(0,i.kt)("li",{parentName:"ol"},"Then, add the ",(0,i.kt)("inlineCode",{parentName:"li"},"platform-tools")," path to the system environment variables. Use the ",(0,i.kt)("inlineCode",{parentName:"li"},"ANDROID_HOME")," variable you just added and add ",(0,i.kt)("inlineCode",{parentName:"li"},"%ANDROID_HOME%\\platform-tools")," to the system variables."),(0,i.kt)("li",{parentName:"ol"},"After finalizing the settings, click ",(0,i.kt)("inlineCode",{parentName:"li"},"OK")," to save the changes.")),(0,i.kt)("p",null,"Once these settings are complete and you restart the terminal, the ",(0,i.kt)("inlineCode",{parentName:"p"},"adb")," command will be recognized correctly. This indicates that the Android development environment has been correctly set up in the terminal."),(0,i.kt)("h1",{id:"7-react-native-and-expo"},"7. React Native and Expo"),(0,i.kt)("p",null,"Finally, we'll proceed with the installation of ",(0,i.kt)("a",{parentName:"p",href:"https://reactnative.dev"},"React Native")," which allows development for ",(0,i.kt)("inlineCode",{parentName:"p"},"iOS"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"Android"),", and the ",(0,i.kt)("inlineCode",{parentName:"p"},"web"),". "),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/ThByD_7_2v4?start=677",title:"React Native and Expo",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"To enrich and quickly start the React Native project, we'll use ",(0,i.kt)("a",{parentName:"p",href:"https://medium.com/crossplatformkorea/%EC%83%88%EB%A1%9C%EC%9A%B4-dooboo-cli-5c60e17a87e0"},"dooboo-cli")," managed by ",(0,i.kt)("a",{parentName:"p",href:"https://dooboolab.com"},"DoobooLab"),"."),(0,i.kt)("p",null,"Open the terminal and enter the following command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"npx dooboo init\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"npx")," is a package runner tool for ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),", introduced in the ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," version 5.2.0 in 2017. It allows users to directly run npm registry commands without globally installing a package. This facilitates easy execution of the latest version of a package or running a package temporarily.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"}," _| _  _ |_  _  _ | _ |_\n(_|(_)(_)|_)(_)(_)|(_||_)\n")),(0,i.kt)("p",null,"When the above appears in the terminal and the ",(0,i.kt)("inlineCode",{parentName:"p"},"Expo (Typescript)")," project shows up in a caption state, press ",(0,i.kt)("inlineCode",{parentName:"p"},"Enter")," to continue. Next, type in the project name you desire and press ",(0,i.kt)("inlineCode",{parentName:"p"},"Enter")," again to create the project."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("a",{parentName:"p",href:"https://docs.expo.dev"},"Expo")," is an open-source platform for React Native that simplifies and accelerates mobile app development. With Expo, developers can immediately start a new project without initial setup, and easily access various native APIs. Moreover, Expo's development tools allow real-time previews with immediate updates, making the development and debugging process much more efficient.")),(0,i.kt)("p",null,"Once you've moved to the project folder, use ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn")," to install necessary local packages. Then run the project using the ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn start")," command. Following that, entering either ",(0,i.kt)("inlineCode",{parentName:"p"},"a")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"w")," in the terminal will launch the Android simulator or a web browser, respectively."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"If the web does not execute with ",(0,i.kt)("inlineCode",{parentName:"p"},"w"),", try the ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn web")," command. If the Android emulator doesn't launch, use ",(0,i.kt)("inlineCode",{parentName:"p"},"Android Studio")," to create a new emulator. For detailed information, refer to ",(0,i.kt)("a",{parentName:"p",href:"https://developer.android.com/studio/run/managing-avds"},"Creating and Managing Android Virtual Devices"),".")),(0,i.kt)("h3",{id:"testing-on-ios"},"Testing on iOS"),(0,i.kt)("p",null,"Projects created through ",(0,i.kt)("inlineCode",{parentName:"p"},"dooboo")," utilize ",(0,i.kt)("a",{parentName:"p",href:"https://expo.dev"},"Expo"),", so even in a Windows environment, you can run the app on an iOS device. However, for this, you'll need a physical iPhone. After executing the ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn start")," command, scan the displayed ",(0,i.kt)("inlineCode",{parentName:"p"},"QR")," code to run the project through the ",(0,i.kt)("a",{parentName:"p",href:"https://apps.apple.com/us/app/expo-go/id982107779"},"Expo Go")," app. You can check out the detailed information and usage guide in the ",(0,i.kt)("a",{parentName:"p",href:"https://docs.expo.dev/get-started/expo-go"},"Expo Go Official Documentation"),"."),(0,i.kt)("p",null,"The installation is now complete. From here on, you can focus solely on coding \ud83c\udf89."))}h.isMDXComponent=!0}}]);