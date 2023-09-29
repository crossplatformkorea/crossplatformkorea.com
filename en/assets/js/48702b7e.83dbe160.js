"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[9045],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return h}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=i.createContext({}),c=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=c(e.components);return i.createElement(l.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},m=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),m=a,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||o;return n?i.createElement(h,r(r({ref:t},d),{},{components:n})):i.createElement(h,r({ref:t},d))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,r[1]=s;for(var c=2;c<o;c++)r[c]=n[c];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return a}});var i=n(7294);function a(e){var t=e.className,n=void 0===t?"adfit":t,a=e.style,o=e.unit,r=e.height,s=e.width;return(0,i.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",s.toString()),e.setAttribute("data-ad-height",r.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),i.createElement("div",{style:a},i.createElement("div",{className:n}))}},9388:function(e,t,n){n.d(t,{Z:function(){return o}});var i=n(7294),a=n(7859);function o(e){var t=e.unit,n=e.className,o=e.height,r=void 0===o?100:o,s=e.width,l=void 0===s?320:s,c=e.style;return i.createElement(a.Z,{unit:t,height:r,width:l,className:n,style:Object.assign({flex:1,marginTop:24,marginBottom:24},c)})}},4401:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return g},frontMatter:function(){return l},metadata:function(){return d},toc:function(){return u}});var i=n(7462),a=n(3366),o=(n(7294),n(3905)),r=n(9388),s=["components"],l={id:"vscode-plugins",title:"VSCode Plugins",sidebar_label:"VSCode Plugins"},c=void 0,d={unversionedId:"react-native/vscode-plugins",id:"react-native/vscode-plugins",title:"VSCode Plugins",description:"In this section, we will explore essential plugins required for development in Visual Studio Code.",source:"@site/docs/react-native/2-1-vscode-plugins.mdx",sourceDirName:"react-native",slug:"/react-native/vscode-plugins",permalink:"/en/docs/current/react-native/vscode-plugins",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/2-1-vscode-plugins.mdx",tags:[],version:"current",frontMatter:{id:"vscode-plugins",title:"VSCode Plugins",sidebar_label:"VSCode Plugins"},sidebar:"react-native",previous:{title:"Development Environment for Windows",permalink:"/en/docs/current/react-native/development-environment/windows"},next:{title:"Style",permalink:"/en/docs/current/category/style"}},p={},u=[{value:"1. Auto Rename Tag",id:"1-auto-rename-tag",level:2},{value:"2. Better Comments",id:"2-better-comments",level:2},{value:"3. vscode-icons",id:"3-vscode-icons",level:2},{value:"4. Code Spell Checker",id:"4-code-spell-checker",level:2},{value:"5. Import Cost",id:"5-import-cost",level:2},{value:"6. vscode-styled-components",id:"6-vscode-styled-components",level:2},{value:"7. ESLint",id:"7-eslint",level:2},{value:"8. Prettier",id:"8-prettier",level:2}],m={toc:u},h="wrapper";function g(e){var t=e.components,n=(0,a.Z)(e,s);return(0,o.kt)(h,(0,i.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"In this section, we will explore essential plugins required for development in ",(0,o.kt)("a",{parentName:"p",href:"https://code.visualstudio.com"},"Visual Studio Code"),"."),(0,o.kt)(r.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile",mdxType:"AdFitMobileBanner"}),(0,o.kt)("p",null,"If you've initiated your project using ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/dooboolab-community/dooboo-cli"},"dooboo-cli"),", upon opening ",(0,o.kt)("inlineCode",{parentName:"p"},"vscode")," within your project directory, you'll be prompted at the bottom right to install recommended plugins. Accepting these recommendations will automatically install the following 8 plugins, so please keep that in mind."),(0,o.kt)("p",null,"We'll be presenting these plugins in order of ease of use."),(0,o.kt)("h2",{id:"1-auto-rename-tag"},"1. Auto Rename Tag"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=38",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag"},"Auto Rename Tag")," is an extremely useful plugin for tag-based syntaxes like ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Getting_started"},"html")," or ",(0,o.kt)("a",{parentName:"p",href:"https://react.dev"},"react"),". Normally, when opening and closing tags, you have to write the same tag name twice. This plugin reduces that redundancy. It's especially handy when making modifications."),(0,o.kt)("p",null,"Let's look at an example to illustrate this."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"<View>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n</View>\n")),(0,o.kt)("p",null,"If you want to change the ",(0,o.kt)("inlineCode",{parentName:"p"},"View")," tag name to ",(0,o.kt)("inlineCode",{parentName:"p"},"ScrollView"),", typically, you'd need to edit both the opening and closing tags. However, with the ",(0,o.kt)("inlineCode",{parentName:"p"},"Auto Rename Tag")," plugin, just modifying the opening tag will automatically adjust the closing tag for you."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Note: If you use the ",(0,o.kt)("inlineCode",{parentName:"p"},"autocomplete")," feature to auto-complete the tag, the closing tag might not be automatically adjusted. Please refer to the video above for more details.")),(0,o.kt)("h2",{id:"2-better-comments"},"2. Better Comments"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=68",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments"},"Better Comments")," assists developers in expressing comments within their code more clearly and legibly. This plugin enhances the clarity and readability of annotations by allowing developers to differentiate comments with various colors. By doing so, the purpose and significance of each comment can be quickly grasped at a glance."),(0,o.kt)("h2",{id:"3-vscode-icons"},"3. vscode-icons"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=108",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons"},"vscode-icons")," is particularly beneficial when quickly scanning through code or understanding a project's structure. This extension provides intuitive and visually appealing icons for different file types and folders, enhancing the overall visual experience and making it easier for developers to navigate through their workspace."),(0,o.kt)("img",{src:"https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/images/screenshot.gif"}),(0,o.kt)("h2",{id:"4-code-spell-checker"},"4. Code Spell Checker"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=133",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker"},"Code Spell Checker")," is a plugin I highly recommend, especially for those whose native language isn't English or who aren't proficient in typing in English. A primary benefit of this tool is its capability to maintain the professionalism of your code and prevent bugs or misunderstandings that might arise from inadvertent mistakes. It effectively detects spelling errors in variable names, function names, comments, strings, and other textual content within your code. Moreover, it includes support for various programming languages and natural languages. The ability to add specific words or terms through a user-defined dictionary means that domain-specific terms relevant to a team or project can easily undergo spell-checking. By leveraging these features, developers can enhance the readability and quality of their code and reduce unnecessary review time."),(0,o.kt)("p",null,"More often than not, developers encounter typos during the code review process, and many have faced significant challenges because of such oversights."),(0,o.kt)("h2",{id:"5-import-cost"},"5. Import Cost"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=167",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost"},"Import Cost")," is an extension for Visual Studio Code that displays the size of a module or library in real-time as developers import it into their code. This instant feedback allows developers to be aware of potential bloat in their bundle size, offering them an opportunity to seek more lightweight alternatives if necessary. Such awareness is invaluable for optimizing web application loading times and overall performance."),(0,o.kt)("h2",{id:"6-vscode-styled-components"},"6. vscode-styled-components"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=188",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components"},"vscode-styled-components")," is a tool that aids developers when working on styled React components using libraries like ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," and similar ones such as ",(0,o.kt)("a",{parentName:"p",href:"https://emotion.sh/docs/introduction"},"emotion.js"),"."),(0,o.kt)("p",null,"Key features and benefits include:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Syntax Highlighting"),": The extension improves code readability by emphasizing the CSS syntax inside the template literals of ",(0,o.kt)("inlineCode",{parentName:"li"},"styled-components"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Auto-Completion"),": It offers auto-completion for CSS properties and values, facilitating quicker and more accurate code drafting."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"In-line Error Display"),": If a mistaken CSS property or value is utilized, the extension promptly indicates the error."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Go to Definition and Peek"),": Developers can seamlessly navigate to the segment of code that concerns a particular CSS rule, or even get a quick preview, optimizing the workflow and productivity.")),(0,o.kt)("h2",{id:"7-eslint"},"7. ESLint"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=215",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://eslint.org"},"ESLint")," is a JavaScript linter used for identifying and reporting on patterns in JavaScript. The ",(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint"},"ESLint plugin for Visual Studio Code")," provides real-time feedback on issues in JavaScript and TypeScript code as you write. This plugin assists teams in maintaining a consistent coding standard across the board and helps avoid potential errors and anti-patterns. Through custom rules and extensions, linting can be tailored to suit the specific needs of a project. In essence, the ",(0,o.kt)("inlineCode",{parentName:"p"},"ESLint")," plugin significantly aids in enhancing code quality, maintaining consistency among developers, and minimizing errors."),(0,o.kt)("h2",{id:"8-prettier"},"8. Prettier"),(0,o.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,o.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/fzvzPWJTeds?start=256",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://prettier.io"},"Prettier")," is an automatic code formatter that aligns code in several supported programming and markup languages to a consistent style. The ",(0,o.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode"},"Prettier plugin for Visual Studio Code")," optimizes code styling automatically upon saving, reducing the need for developers to manually adjust code style. This plugin enhances code readability and minimizes discussions related to style during code reviews, allowing developers to focus on the actual logic. Through Prettier's configurations, users can specify their desired code style, making this tool incredibly useful in maintaining a consistent code style throughout a project."),(0,o.kt)(r.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile",mdxType:"AdFitMobileBanner"}))}g.isMDXComponent=!0}}]);