"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[9295],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return h}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=p(n),h=o,u=c["".concat(s,".").concat(h)]||c[h]||m[h]||i;return n?a.createElement(u,r(r({ref:t},d),{},{components:n})):a.createElement(u,r({ref:t},d))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,r[1]=l;for(var p=2;p<i;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294);function o(e){var t=e.className,n=void 0===t?"adfit":t,o=e.style,i=e.unit,r=e.height,l=e.width;return(0,a.useEffect)((function(){var e,t,a=document.createElement("ins"),o=document.createElement("script");a.className="kakao_ad_area",a.style="display:none; width:100%;",o.async="true",o.type="text/javascript",o.src="//t1.daumcdn.net/kas/static/ba.min.js",a.setAttribute("data-ad-width",l.toString()),a.setAttribute("data-ad-height",r.toString()),a.setAttribute("data-ad-unit",i.toString()),null==(e=document.querySelector("."+n))||e.appendChild(a),null==(t=document.querySelector("."+n))||t.appendChild(o)}),[]),a.createElement("div",{style:o},a.createElement("div",{className:n}))}},6408:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(7294),o=n(7859);function i(){return a.createElement(o.Z,{unit:"DAN-weLLBNA8C31gpo1t",height:100,width:320,className:"adfit-top-mobile",style:{flex:1,marginTop:24,marginBottom:24}})}},1555:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return p},default:function(){return u},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return c}});var a=n(7462),o=n(3366),i=(n(7294),n(3905)),r=n(6408),l=["components"],s={id:"development-environment-mac",title:"Development Environment for Mac",sidebar_label:"Development Environment for Mac"},p=void 0,d={unversionedId:"react-native/development-environment-mac",id:"react-native/development-environment-mac",title:"Development Environment for Mac",description:"In this section, we've prepared materials to help even those new to development set up their development environment. This is about the Mac development environment, so if you're a Windows user, please check out the Windows development environment.",source:"@site/docs/react-native/1-1-development-environment-mac.mdx",sourceDirName:"react-native",slug:"/react-native/development-environment-mac",permalink:"/en/docs/current/react-native/development-environment-mac",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/1-1-development-environment-mac.mdx",tags:[],version:"current",frontMatter:{id:"development-environment-mac",title:"Development Environment for Mac",sidebar_label:"Development Environment for Mac"},sidebar:"react-native",previous:{title:"Development Environment",permalink:"/en/docs/current/category/development-environment"},next:{title:"Development Environment for Windows",permalink:"/en/docs/current/react-native/development-environment-windows"}},m={},c=[{value:"1. Oh My Zsh",id:"1-oh-my-zsh",level:2},{value:"2. Homebrew",id:"2-homebrew",level:2},{value:"3. Install NVM (Node Version Manager) and then Node.js",id:"3-install-nvm-node-version-manager-and-then-nodejs",level:2},{value:"Installing NVM",id:"installing-nvm",level:3},{value:"Installing Node.js",id:"installing-nodejs",level:3},{value:"5. Android Development Environment",id:"5-android-development-environment",level:2},{value:"Watchman",id:"watchman",level:3},{value:"Java",id:"java",level:3},{value:"Android Studio",id:"android-studio",level:3},{value:"6. Visual Studio Code",id:"6-visual-studio-code",level:2},{value:"7. React Native and Expo",id:"7-react-native-and-expo",level:2}],h={toc:c};function u(e){var t=e.components,n=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(r.Z,{mdxType:"AdFitTopFixed"}),(0,i.kt)("p",null,"In this section, we've prepared materials to help even those new to development set up their development environment. This is about the ",(0,i.kt)("inlineCode",{parentName:"p"},"Mac development environment"),", so if you're a Windows user, please check out the ",(0,i.kt)("a",{parentName:"p",href:"development-environment-windows"},"Windows development environment"),"."),(0,i.kt)("div",{class:"video-container",style:{marginBottom:20}},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0,style:{marginBottom:20}})),(0,i.kt)("h1",{id:"development-environment"},"Development Environment"),(0,i.kt)("p",null,"Starting from the macOS ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/MacOS_Catalina"},"Catalina")," version ",(0,i.kt)("inlineCode",{parentName:"p"},"10.15"),", ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Z_shell"},(0,i.kt)("inlineCode",{parentName:"a"},"zsh"),"(Z shell)")," began to be used as the default shell. Previously, ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Bash_(Unix_shell)"},(0,i.kt)("inlineCode",{parentName:"a"},"bash"),"(Bourne Again Shell)")," was the default shell for macOS. This change took place in Catalina, released in 2019. Among the reasons for this change was an issue related to the licensing of the GNU project's bash version."),(0,i.kt)("p",null,"We also recommend installing ",(0,i.kt)("a",{parentName:"p",href:"https://ohmyz.sh"},"oh my zsh")," which further enriches the current default shell ",(0,i.kt)("inlineCode",{parentName:"p"},"zsh"),". It includes plugins and themes favored by developers worldwide, making development more approachable."),(0,i.kt)("h2",{id:"1-oh-my-zsh"},"1. Oh My Zsh"),(0,i.kt)("p",null,"Now, let's install Oh My Zsh. For beginners, we provide an installation method through video."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=6",title:"Oh My Zsh",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"First, visit the ",(0,i.kt)("a",{parentName:"p",href:"https://ohmyz.sh"},"oh my zsh official website"),". Then, scroll down and copy the command under ",(0,i.kt)("inlineCode",{parentName:"p"},"Install oh-my-zsh via curl")," and paste it into your terminal. The copied command is as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"\n')),(0,i.kt)("p",null,"Executing the command in the terminal will start the ",(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Zsh")," installation. If a popup for ",(0,i.kt)("inlineCode",{parentName:"p"},"command line developer tools")," appears during installation, select 'Install'. ",(0,i.kt)("inlineCode",{parentName:"p"},"git")," is required for ",(0,i.kt)("inlineCode",{parentName:"p"},"Oh My Zsh")," installation, and this tool is provided by ",(0,i.kt)("inlineCode",{parentName:"p"},"command line developer tools"),". Thus, consider this tool essential for installation."),(0,i.kt)("p",null,"Once installed, it will be beautifully displayed in the terminal as:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"         __                                     __\n  ____  / /_     ____ ___  __  __   ____  _____/ /_\n / __ \\/ __ \\   / __ `__ \\/ / / /  /_  / / ___/ __ \\\n/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /\n\\____/_/ /_/  /_/ /_/ /_/\\__, /    /___/____/_/ /_/\n                        /____/\n")),(0,i.kt)("p",null,"Additionally, we will install ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/zsh-users/zsh-syntax-highlighting"},"zsh-syntax-highlighting"),". Go to the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md"},"installation guide")," and navigate to ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#in-your-zshrc"},"In your ~/.zshrc")," to copy the command below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git\necho "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc\n')),(0,i.kt)("p",null,"Paste and execute the command in the terminal to complete the installation. If you wish to specify a different download path, please refer to ",(0,i.kt)("a",{parentName:"p",href:"https://youtu.be/o3dfpDaICb4?t=53"},"the video")," below."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=53",title:"Zsh Syntax Highlighting",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"Once installed, recognizable commands in the terminal will appear in ",(0,i.kt)("inlineCode",{parentName:"p"},"green"),", and unrecognizable commands will appear in ",(0,i.kt)("inlineCode",{parentName:"p"},"red"),", enhancing the convenience of development."),(0,i.kt)("h2",{id:"2-homebrew"},"2. Homebrew"),(0,i.kt)("p",null,"Next, we will install the ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Package_manager"},"package manager")," for macOS called ",(0,i.kt)("a",{parentName:"p",href:"https://brew.sh"},"Homebrew"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=74",title:"Homebrew",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"A package manager is a crucial tool for efficiently managing software dependencies within an OS. It might be challenging for those new to development to understand at first, but once you experience a package manager, you will clearly appreciate its significance and convenience."),(0,i.kt)("p",null,"The most popular package manager on Mac is ",(0,i.kt)("a",{parentName:"p",href:"https://brew.sh"},"Homebrew"),", and it can be easily installed using the command provided on the official page:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n')),(0,i.kt)("p",null,"Copy and paste the command into your terminal. The shell will request your login password. Enter the password to proceed with the installation. During the installation, you may be prompted to press the ",(0,i.kt)("inlineCode",{parentName:"p"},"Enter")," key or other responses. Carefully read the terminal's prompt messages and proceed accordingly."),(0,i.kt)("h2",{id:"3-install-nvm-node-version-manager-and-then-nodejs"},"3. Install NVM (Node Version Manager) and then Node.js"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org"},"Node.js")," is a tool that allows ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/JavaScript"},"JavaScript")," to be executed outside the web browser. This has enabled the use of JavaScript when building servers or applications on computers. It allows for fast concurrent processing and has the advantage of being able to work in both ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Front_and_back_ends"},"frontend and backend")," using the same language."),(0,i.kt)("p",null,"You might wonder why you need to install ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/nvm-sh/nvm"},"NVM")," when you can just install ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),". ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM")," (Node Version Manager) is a tool that allows you to install and manage multiple versions of ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),". If you install ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," directly, you can only use one version, but with ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM"),", you can easily switch between different versions. This has several advantages:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Compatibility"),": Different projects may require different versions of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js"),". By using ",(0,i.kt)("inlineCode",{parentName:"li"},"NVM"),", you can set the appropriate version for each project."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Convenience"),": You can easily switch between versions of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," with a single command."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Stability"),": If you want to test the latest version of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," that includes experimental features, you can install and use it separately from the stable version."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"Updates and Rollbacks"),": You can easily install new versions of ",(0,i.kt)("inlineCode",{parentName:"li"},"Node.js")," and roll back to previous versions if there are issues.")),(0,i.kt)("p",null,"Therefore, managing versions through ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM")," is a much more flexible and effective method than just installing ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=106",title:"NVM and Node.js",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("h3",{id:"installing-nvm"},"Installing NVM"),(0,i.kt)("p",null,"Now, to install ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM"),", visit the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/nvm-sh/nvm"},"official homepage"),". Find and copy the command below, then paste it into your terminal."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Please note that the ",(0,i.kt)("inlineCode",{parentName:"p"},"0.39.4")," version number might increase over time.")),(0,i.kt)("p",null,"Next, you'll need to modify ",(0,i.kt)("inlineCode",{parentName:"p"},"~/.zshrc"),". Developers can edit using tools like ",(0,i.kt)("a",{parentName:"p",href:"https://www.vim.org"},"vim"),", but if you're new to development, you can open it with the default ",(0,i.kt)("inlineCode",{parentName:"p"},"TextEdit")," program:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"open -a TextEdit ~/.zshrc\n")),(0,i.kt)("p",null,"After opening ",(0,i.kt)("inlineCode",{parentName:"p"},"TextEdit"),", paste the following commands at the very bottom. Note that these commands will be displayed in the terminal after the ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm")," installation is complete."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"  # This loads nvm\n[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion\n')),(0,i.kt)("p",null,"Save and exit. Then reload your ",(0,i.kt)("inlineCode",{parentName:"p"},"zsh")," profile using the ",(0,i.kt)("inlineCode",{parentName:"p"},"source ~/.zshrc")," command. After this, you should be able to recognize the ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm")," command."),(0,i.kt)("h3",{id:"installing-nodejs"},"Installing Node.js"),(0,i.kt)("p",null,"Now, using the previously installed ",(0,i.kt)("inlineCode",{parentName:"p"},"NVM"),", we'll install ",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/"},"Node.js"),". First, check the installed versions using the ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm list")," command (it should be empty if everything's right). Use the ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm install 18")," command to install version 18 of ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),". Running ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm list")," again, you should see the ",(0,i.kt)("inlineCode",{parentName:"p"},"v18")," version installed. Then finish the default settings with the following commands:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"nvm use 18\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"This sets ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," version ",(0,i.kt)("inlineCode",{parentName:"p"},"18")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm"),".")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"nvm alias default 18\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"This sets ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," version ",(0,i.kt)("inlineCode",{parentName:"p"},"18")," as the default in ",(0,i.kt)("inlineCode",{parentName:"p"},"nvm"),".")),(0,i.kt)("p",null,"Once installation is complete, you can check the installed ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js")," version using the ",(0,i.kt)("inlineCode",{parentName:"p"},"node -v")," command. Additionally, check the version of ",(0,i.kt)("a",{parentName:"p",href:"https://www.npmjs.com"},"npm")," using the ",(0,i.kt)("inlineCode",{parentName:"p"},"npm -v")," command. Here, ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," is a package manager for ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),", similar to ",(0,i.kt)("inlineCode",{parentName:"p"},"Homebrew"),". Simply put, ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," is very effective in managing software packages installed with ",(0,i.kt)("inlineCode",{parentName:"p"},"Node.js"),"."),(0,i.kt)("p",null,"In addition to ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),", it's recommended to install ",(0,i.kt)("a",{parentName:"p",href:"https://yarnpkg.com"},"yarn"),". The installation process is straightforward using ",(0,i.kt)("inlineCode",{parentName:"p"},"npm"),". ",(0,i.kt)("inlineCode",{parentName:"p"},"Yarn")," is a package manager similar to ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," developed by Meta (previously Facebook). The main reason for installing ",(0,i.kt)("inlineCode",{parentName:"p"},"Yarn")," is because the upcoming ",(0,i.kt)("a",{parentName:"p",href:"https://reactnative.dev"},"React Native")," framework is developed by Meta. To install ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn"),", use the following command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"npm install -g yarn\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"-g")," option stands for ",(0,i.kt)("inlineCode",{parentName:"p"},"global"),". Using this option installs the program globally, allowing you to access the installed program from anywhere in the terminal."),(0,i.kt)("h1",{id:"4-ios-development-environment"},"4. iOS Development Environment"),(0,i.kt)("p",null,"Let's set up the ",(0,i.kt)("inlineCode",{parentName:"p"},"iOS")," app development environment."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=167",title:"iOS Development Environment",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"Download ",(0,i.kt)("a",{parentName:"p",href:"https://developer.apple.com/xcode"},"Xcode")," from the ",(0,i.kt)("a",{parentName:"p",href:"https://www.apple.com/app-store"},"App Store"),". Note that you must access directly through the built-in App Store application on Mac instead of the App Store link."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Once installed, make sure that the ",(0,i.kt)("a",{parentName:"p",href:"https://mac.install.guide/commandlinetools/index.html"},"Command Line Tools")," are correctly installed. It's likely that it was already installed during the ",(0,i.kt)("a",{parentName:"p",href:"#1-oh-my-zsh"},"1. Oh My Zsh")," setup.")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"Xcode Command Line Tools")," provides essential compilers and various development tools for programming on macOS. Specifically, it includes ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Compiler"},"compilers")," like GCC and Clang, version control systems like ",(0,i.kt)("a",{parentName:"p",href:"https://git-scm.com"},"Git"),", and many UNIX-based command-line tools. These tools are essential when developing code or managing packages in the terminal without the Xcode IDE, and for compiling and installing in many development projects and software packages.")),(0,i.kt)("h2",{id:"5-android-development-environment"},"5. Android Development Environment"),(0,i.kt)("p",null,"Next, we'll prepare the ",(0,i.kt)("inlineCode",{parentName:"p"},"Android")," app development environment."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=203",title:"Android Studio",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("h3",{id:"watchman"},"Watchman"),(0,i.kt)("p",null,"Firstly, ",(0,i.kt)("a",{parentName:"p",href:"https://facebook.github.io/watchman"},"watchman")," is not directly related to Android, but as it might have been missed in the previous installation process, we'll guide the installation here to match the video sequence. ",(0,i.kt)("inlineCode",{parentName:"p"},"Watchman")," is a file system monitoring tool developed by ",(0,i.kt)("inlineCode",{parentName:"p"},"Meta"),". Using it improves the development experience in ",(0,i.kt)("inlineCode",{parentName:"p"},"React Native")," by quickly detecting real-time file changes. In ",(0,i.kt)("inlineCode",{parentName:"p"},"RN"),", it's recommended but not essential for efficient code change detection and seamless integration with the development server."),(0,i.kt)("h3",{id:"java"},"Java"),(0,i.kt)("p",null,"Next, install ",(0,i.kt)("a",{parentName:"p",href:"https://www.java.com"},"java")," using ",(0,i.kt)("inlineCode",{parentName:"p"},"brew"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"brew tap homebrew/cask-versions\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"brew install --cask zulu11\n")),(0,i.kt)("h3",{id:"android-studio"},"Android Studio"),(0,i.kt)("p",null,"Lastly, install ",(0,i.kt)("a",{parentName:"p",href:"https://developer.android.com/studio/install"},"Android Studio"),". You can install via ",(0,i.kt)("inlineCode",{parentName:"p"},"brew"),", but the video shows how to download and install directly. Choose your installation method accordingly."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"brew install --cask android-studio\n")),(0,i.kt)("p",null,"After installation, it's recommended to create a new Android project as per the video. This is to ensure the Android environment is correctly set up. If the Android project runs smoothly, the environment setup is successful. Next, you'll need to add the path of the ",(0,i.kt)("inlineCode",{parentName:"p"},"Android SDK")," to your ",(0,i.kt)("inlineCode",{parentName:"p"},"zsh")," profile. Use the command below to open your ",(0,i.kt)("inlineCode",{parentName:"p"},"zsh")," profile."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"open -a TextEdit ~/.zshrc\n")),(0,i.kt)("p",null,"Then, add the following environment variables at the bottom of the file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"export ANDROID_HOME=$HOME/Library/Android/sdk\nexport PATH=$PATH:$ANDROID_HOME/emulator\nexport PATH=$PATH:$ANDROID_HOME/platform-tools\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Make sure the ",(0,i.kt)("inlineCode",{parentName:"p"},"ANDROID_HOME")," path is set correctly for your PC. You can check how to verify this in ",(0,i.kt)("a",{parentName:"p",href:"https://youtu.be/o3dfpDaICb4?t=332"},"this video"),".")),(0,i.kt)("h2",{id:"6-visual-studio-code"},"6. Visual Studio Code"),(0,i.kt)("p",null,"Next, we'll install ",(0,i.kt)("a",{parentName:"p",href:"https://code.visualstudio.com"},"Visual Studio Code"),". Often referred to as ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode"),", it's one of the most beloved code editors among developers worldwide. In the past, editors like ",(0,i.kt)("a",{parentName:"p",href:"https://www.editplus.com"},"edit plus"),", ",(0,i.kt)("a",{parentName:"p",href:"https://www.sublimetext.com"},"sublime text"),", and the now-discontinued ",(0,i.kt)("a",{parentName:"p",href:"https://github.blog/2022-06-08-sunsetting-atom"},"atom")," were popular. However, many developers have since switched to ",(0,i.kt)("inlineCode",{parentName:"p"},"vscode")," due to its superior features and user experience."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=354",title:"Visual Studio Code",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"Install using ",(0,i.kt)("inlineCode",{parentName:"p"},"brew")," as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"brew install --cask visual-studio-code\n")),(0,i.kt)("h2",{id:"7-react-native-and-expo"},"7. React Native and Expo"),(0,i.kt)("p",null,"Lastly, we'll install ",(0,i.kt)("a",{parentName:"p",href:"https://reactnative.dev"},"React Native"),", which allows for development across ",(0,i.kt)("inlineCode",{parentName:"p"},"iOS"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"Android"),", and ",(0,i.kt)("inlineCode",{parentName:"p"},"web"),"."),(0,i.kt)("div",{class:"video-container"},(0,i.kt)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/o3dfpDaICb4?start=406",title:"NVM and Node.js",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,i.kt)("p",null,"For a richer and quicker start to a React Native project, we'll use ",(0,i.kt)("a",{parentName:"p",href:"https://medium.com/crossplatformkorea/new-dooboo-cli-5c60e17a87e0"},"dooboo-cli"),", managed by ",(0,i.kt)("a",{parentName:"p",href:"https://dooboolab.com"},"dooboolab"),"."),(0,i.kt)("p",null,"Open the terminal and input:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"npx dooboo init\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"npx")," is an npm package runner introduced in ",(0,i.kt)("inlineCode",{parentName:"p"},"npm")," version 5.2.0 in 2017. It lets users run package commands directly from the npm registry without globally installing them. This facilitates easy execution of the latest versions of specific packages or temporarily running packages.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"}," _| _  _ |_  _  _ | _ |_\n(_|(_)(_)|_)(_)(_)|(_||_)\n")),(0,i.kt)("p",null,"Once you see the above in the terminal and the ",(0,i.kt)("inlineCode",{parentName:"p"},"Expo (Typescript)")," project appears in the caption state, press the ",(0,i.kt)("inlineCode",{parentName:"p"},"Enter")," key to proceed. Then, input your desired project name and press ",(0,i.kt)("inlineCode",{parentName:"p"},"Enter")," to create the project."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("a",{parentName:"p",href:"https://docs.expo.dev"},"Expo")," is an open-source platform for React Native, simplifying and accelerating mobile app development. Developers can instantly start new projects without initial setup using Expo, with easy access to various native APIs. Additionally, Expo's development tools allow real-time previews and instant updates, making the development and debugging process more efficient.")),(0,i.kt)("p",null,"Navigate to the folder with the project name, use ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn")," to install necessary local packages, and"),(0,i.kt)("p",null," start the project:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"cd your-project-name\nyarn install\nyarn start\n")),(0,i.kt)("p",null,"Then, follow the on-screen prompts to launch your React Native app on the iOS simulator or Android emulator. Also, check out ",(0,i.kt)("a",{parentName:"p",href:"https://dooboo-ui.dooboolab.com"},"dooboo-ui"),", an open-source React Native UI kit developed by dooboolab for various components, designs, and utilities."))}u.isMDXComponent=!0}}]);