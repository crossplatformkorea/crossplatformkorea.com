"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[3084],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return u}});var o=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=o.createContext({}),s=function(e){var t=o.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return o.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=s(r),u=n,v=d["".concat(l,".").concat(u)]||d[u]||m[u]||a;return r?o.createElement(v,i(i({ref:t},p),{},{components:r})):o.createElement(v,i({ref:t},p))}));function u(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:n,i[1]=c;for(var s=2;s<a;s++)i[s]=r[s];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7859:function(e,t,r){r.d(t,{Z:function(){return n}});var o=r(7294);function n(e){var t=e.className,r=void 0===t?"adfit":t,n=e.style,a=e.unit,i=e.height,c=e.width;return(0,o.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",c.toString()),e.setAttribute("data-ad-height",i.toString()),e.setAttribute("data-ad-unit",a.toString()),document.querySelector("."+r).appendChild(e),document.querySelector("."+r).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),o.createElement("div",{style:n},o.createElement("div",{className:r}))}},9388:function(e,t,r){r.d(t,{Z:function(){return a}});var o=r(7294),n=r(7859);function a(e){var t=e.unit,r=e.className,a=e.height,i=void 0===a?100:a,c=e.width,l=void 0===c?320:c,s=e.style;return o.createElement(n.Z,{unit:t,height:i,width:l,className:r,style:Object.assign({flex:1,marginTop:24,marginBottom:24},s)})}},820:function(e,t,r){r.r(t),r.d(t,{assets:function(){return m},contentTitle:function(){return s},default:function(){return v},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return d}});var o=r(7462),n=r(3366),a=(r(7294),r(3905)),i=r(9388),c=["components"],l={id:"vscode-plugins",title:"VSCode \ud50c\ub7ec\uadf8\uc778",sidebar_label:"VSCode \ud50c\ub7ec\uadf8\uc778"},s=void 0,p={unversionedId:"react-native/vscode-plugins",id:"react-native/vscode-plugins",title:"VSCode \ud50c\ub7ec\uadf8\uc778",description:"\uc774\ubc88 \uc139\uc158\uc5d0\uc11c\ub294 Visual Studio Code\uc5d0\uc11c \uac1c\ubc1c\uc744 \ud558\uae30 \uc704\ud574 \ud544\uc218\ub85c \ud544\uc694\ud55c \ud50c\ub7ec\uadf8\uc778\uc5d0 \ub300\ud574 \uc54c\uc544\ubd05\ub2c8\ub2e4.",source:"@site/i18n/ko/docusaurus-plugin-content-docs/current/react-native/2-1-vscode-plugins.mdx",sourceDirName:"react-native",slug:"/react-native/vscode-plugins",permalink:"/docs/current/react-native/vscode-plugins",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/tree/main/ko",tags:[],version:"current",frontMatter:{id:"vscode-plugins",title:"VSCode \ud50c\ub7ec\uadf8\uc778",sidebar_label:"VSCode \ud50c\ub7ec\uadf8\uc778"},sidebar:"react-native",previous:{title:"\uc708\ub3c4\uc6b0 \uac1c\ubc1c \ud658\uacbd",permalink:"/docs/current/react-native/development-environment/windows"},next:{title:"Style",permalink:"/docs/current/category/style"}},m={},d=[{value:"1. Auto Rename Tag",id:"1-auto-rename-tag",level:2},{value:"2. Better Comments",id:"2-better-comments",level:2},{value:"3. vscode-icons",id:"3-vscode-icons",level:2},{value:"4. Code Spell Checker",id:"4-code-spell-checker",level:2},{value:"5. Import Cost",id:"5-import-cost",level:2},{value:"6. vscode-styled-components",id:"6-vscode-styled-components",level:2},{value:"7. ESLint",id:"7-eslint",level:2},{value:"8. Prettier",id:"8-prettier",level:2}],u={toc:d};function v(e){var t=e.components,r=(0,n.Z)(e,c);return(0,a.kt)("wrapper",(0,o.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\uc774\ubc88 \uc139\uc158\uc5d0\uc11c\ub294 ",(0,a.kt)("a",{parentName:"p",href:"https://code.visualstudio.com"},"Visual Studio Code"),"\uc5d0\uc11c \uac1c\ubc1c\uc744 \ud558\uae30 \uc704\ud574 \ud544\uc218\ub85c \ud544\uc694\ud55c \ud50c\ub7ec\uadf8\uc778\uc5d0 \ub300\ud574 \uc54c\uc544\ubd05\ub2c8\ub2e4."),(0,a.kt)(i.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile",mdxType:"AdFitMobileBanner"}),(0,a.kt)("p",null,"\ub9cc\uc57d \ud504\ub85c\uc81d\ud2b8\ub97c ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dooboolab-community/dooboo-cli"},"dooboo-cli"),"\ub85c \uc2dc\uc791\ud588\ub2e4\uba74 \ud504\ub85c\uc81d\ud2b8 \uacbd\ub85c\uc5d0\uc11c ",(0,a.kt)("inlineCode",{parentName:"p"},"vscode"),"\ub97c \uc5f4 \ub54c \uc624\ub978\ucabd \ud558\ub2e8\uc5d0 \ucd94\ucc9c \ud50c\ub7ec\uadf8\uc778\uc744 \uc124\uce58\ud560 \uac70\ub0d0\uace0 \ubb3c\uc5b4\ubd05\ub2c8\ub2e4. \uc5ec\uae30\uc11c \ub9cc\uc57d \uc124\uce58\ub97c \ud558\uba74 \uc544\ub798 8\uac00\uc9c0 \ud50c\ub7ec\uadf8\uc778\ub4e4\uc774 \uc790\ub3d9\uc73c\ub85c \uc124\uce58\ub418\ub2c8 \ucc38\uace0\ud574\uc8fc\uc138\uc694."),(0,a.kt)("p",null,"\uc26c\uc6b4 \ud50c\ub7ec\uadf8\uc778 \uc21c\uc73c\ub85c \ubcf4\uaca0\uc2b5\ub2c8\ub2e4."),(0,a.kt)("h2",{id:"1-auto-rename-tag"},"1. Auto Rename Tag"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=68",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag"},"Auto Rename Tag"),"\ub294 ",(0,a.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Getting_started"},"html"),"\uc774\ub098 ",(0,a.kt)("a",{parentName:"p",href:"https://react.dev"},"\ub9ac\uc561\ud2b8")," \uac19\uc740 \ud0dc\uadf8 \ubb38\ubc95\uc5d0\uc11c \uad49\uc7a5\ud788 \uc720\uc6a9\ud55c \ud50c\ub7ec\uadf8\uc778\uc785\ub2c8\ub2e4. \ubcf4\ud1b5 \ud0dc\uadf8\ub97c \uc5f4\uace0 \ub2eb\uc744 \ub54c \uac19\uc740 \uc774\ub984\uc744 \ub450\ubc88\uc529 \uc368\uc918\uc57c \ud558\ub294\ub370 \ud574\ub2f9 \ud50c\ub7ec\uadf8\uc778\uc744 \uadf8 \uacf5\uc218\ub97c \uc904\uc5ec\uc90d\ub2c8\ub2e4. \uc774\ub294 \ud2b9\ud788 \uc218\uc815\uc744 \ud560 \ub54c \uad49\uc7a5\ud788 \uc720\uc6a9\ud569\ub2c8\ub2e4."),(0,a.kt)("p",null,"\uc608\uc2dc\ub85c \uc544\ub798\uc640 \uac19\uc740 \uc0c1\ud669\uc744 \ubcf4\uaca0\uc2b5\ub2c8\ub2e4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"<View>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n  <Text>HELLO</Text>\n</View>\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"View")," \ud0dc\uadf8 \uc774\ub984\uc744 ",(0,a.kt)("inlineCode",{parentName:"p"},"ScrollView"),"\ub85c \ubcc0\uacbd\ud558\ub824\uba74 \uc77c\ubc18\uc801\uc73c\ub85c \uc2dc\uc791 \ud0dc\uadf8\uc640 \uc885\ub8cc \ud0dc\uadf8 \ubaa8\ub450\ub97c \uc218\uc815\ud574\uc57c \ud569\ub2c8\ub2e4. \uadf8\ub7ec\ub098 ",(0,a.kt)("inlineCode",{parentName:"p"},"Auto Rename Tag")," \ud50c\ub7ec\uadf8\uc778\uc744 \uc0ac\uc6a9\ud558\uba74 \uc2dc\uc791 \ud0dc\uadf8\ub9cc \uc218\uc815\ud574\ub3c4 \uc885\ub8cc \ud0dc\uadf8\uac00 \uc790\ub3d9\uc73c\ub85c \ubcc0\uacbd\ub429\ub2c8\ub2e4."),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"\ub2e8, ",(0,a.kt)("inlineCode",{parentName:"p"},"autocomplete")," \uae30\ub2a5\uc744 \uc0ac\uc6a9\ud574 \ud0dc\uadf8\ub97c \uc790\ub3d9\uc644\uc131\ud560 \uacbd\uc6b0, \uc885\ub8cc \ud0dc\uadf8\uac00 \uc790\ub3d9\uc73c\ub85c \uc218\uc815\ub418\uc9c0 \uc54a\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 \uc704\uc758 \uc601\uc0c1\uc744 \ucc38\uace0\ud558\uc138\uc694.")),(0,a.kt)("h2",{id:"2-better-comments"},"2. Better Comments"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=38",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments"},"Better Comments"),"\ub294 \uac1c\ubc1c\uc790\uac00 \ucf54\ub4dc\uc5d0 \uc8fc\uc11d\uc744 \ub354\uc6b1 \uba85\ud655\ud558\uace0 \uc77d\uae30 \uc27d\uac8c \ud45c\ud604\ud560 \uc218 \uc788\ub3c4\ub85d \ub3c4\uc640\uc90d\ub2c8\ub2e4. \uc774 \ud50c\ub7ec\uadf8\uc778\uc740 \uac1c\ubc1c\uc790\ub4e4\uc774 \ucf54\ub4dc \ub0b4 \uc8fc\uc11d\uc744 \ub354\uc6b1 \uba85\ud655\ud558\uace0 \uc77d\uae30 \uc27d\uac8c \ub9cc\ub4e4 \uc218 \uc788\ub3c4\ub85d \ub3c4\uc640\uc90d\ub2c8\ub2e4. \uc8fc\uc11d\uc744 \ub2e4\uc591\ud55c \uc0c9\uc0c1\uc73c\ub85c \uad6c\ubd84\ud558\uac8c \ud574\uc11c \uac01 \uc8fc\uc11d\uc758 \ubaa9\uc801\uacfc \uc911\uc694\uc131\uc744 \ud55c \ub208\uc5d0 \ud30c\uc545\ud560 \uc218 \uc788\uac8c \ud574\uc90d\ub2c8\ub2e4."),(0,a.kt)("h2",{id:"3-vscode-icons"},"3. vscode-icons"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=108",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons"},"vscode-icons"),"\ub294 \ucf54\ub4dc \ub0b4\uc6a9\uc744 \ube60\ub974\uac8c \uc2a4\uce94\ud558\uac70\ub098 \ud504\ub85c\uc81d\ud2b8 \uad6c\uc870\ub97c \ud30c\uc545\ud560 \ub54c \ub9e4\uc6b0 \uc720\uc6a9\ud558\uac8c \uc0ac\uc6a9\ub429\ub2c8\ub2e4."),(0,a.kt)("img",{src:"https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/images/screenshot.gif"}),(0,a.kt)("h2",{id:"4-code-spell-checker"},"4. Code Spell Checker"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=133",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker"},"Code Spell Checker"),"\ub294 \uc601\uc5b4\uac00 \ubaa8\uad6d\uc5b4\uac00 \uc544\ub2cc \uc0ac\ub78c\uc774\uac70\ub098 \uc601\ud0c0\uac00 \ubbf8\uc219\ud55c \uc0ac\ub78c\ub4e4\uc5d0\uac8c \uaf2d \ucd94\ucc9c\ub4dc\ub9ac\ub294 \ud50c\ub7ec\uadf8\uc778\uc785\ub2c8\ub2e4. \uc774 \ud234\uc758 \uc8fc\uc694 \uc7a5\uc810\uc740 \ucf54\ub4dc\uc758 \uc804\ubb38\uc131\uc744 \uc720\uc9c0\ud558\uace0 \uc2e4\uc218\ub85c \uc778\ud55c \ubc84\uadf8\ub098 \uc624\ud574\ub97c \uc608\ubc29\ud558\ub294 \ub370 \ud070 \ub3c4\uc6c0\uc744 \uc81c\uacf5\ud55c\ub2e4\ub294 \uac83\uc785\ub2c8\ub2e4. \ud2b9\ud788, \ubcc0\uc218\uba85, \ud568\uc218\uba85, \uc8fc\uc11d, \ubb38\uc790\uc5f4 \ub4f1\uc5d0\uc11c \ubc1c\uc0dd\ud560 \uc218 \uc788\ub294 \ucca0\uc790 \uc624\ub958\ub97c \ud6a8\uacfc\uc801\uc73c\ub85c \ucc3e\uc544\ub0bc \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ub610\ud55c, \ub2e4\uc591\ud55c \ud504\ub85c\uadf8\ub798\ubc0d \uc5b8\uc5b4\uc640 \uc790\uc5f0\uc5b4\uc5d0 \ub300\ud55c \uc9c0\uc6d0\uc744 \ud3ec\ud568\ud558\uba70, \uc0ac\uc6a9\uc790 \uc815\uc758 \uc0ac\uc804\uc744 \ud1b5\ud574 \ud2b9\uc815 \ub2e8\uc5b4\ub098 \uc6a9\uc5b4\ub97c \ucd94\uac00\ud558\ub294 \uac83\ub3c4 \uac00\ub2a5\ud558\ubbc0\ub85c, \ud300\uc774\ub098 \ud504\ub85c\uc81d\ud2b8\uc758 \ub3c4\uba54\uc778 \ud2b9\ud654 \uc6a9\uc5b4\uc5d0 \ub300\ud55c \ucca0\uc790 \uac80\uc0ac\ub3c4 \uc190\uc27d\uac8c \uc9c4\ud589\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc774\ub7ec\ud55c \uae30\ub2a5\ub4e4\ub85c \uc778\ud574 \uac1c\ubc1c\uc790\ub294 \ucf54\ub4dc\uc758 \uac00\ub3c5\uc131\uacfc \ud488\uc9c8\uc744 \ud5a5\uc0c1\uc2dc\ud0a4\uba70, \ubd88\ud544\uc694\ud55c \ub9ac\ubdf0 \uc2dc\uac04\uc744 \uc904\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,a.kt)("p",null,"\uc0dd\uac01\ubcf4\ub2e4 \ucf54\ub4dc \ub9ac\ubdf0 \uacfc\uc815\uc5d0\uc11c \uc624\ud0c0\ub97c \uc790\uc8fc \ubc1c\uacac\ud558\uac8c \ub418\uba70, \uc774\ub7f0 \uc624\ud0c0\ub85c \uc778\ud574 \ud55c \ubc88\ucbe4 \ud070 \uc5b4\ub824\uc6c0\uc744 \ub9ce\uc740 \uac1c\ubc1c\uc790\ubd84\ub4e4\uc774 \uacaa\uc5b4 \ubcf4\uc168\uc2b5\ub2c8\ub2e4."),(0,a.kt)("h2",{id:"5-import-cost"},"5. Import Cost"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=167",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost"},"Import Cost"),"\ub294 Visual Studio Code\uc758 \ud655\uc7a5 \uae30\ub2a5\uc73c\ub85c, \uac1c\ubc1c\uc790\uac00 \ucf54\ub4dc\uc5d0 \ubaa8\ub4c8\uc774\ub098 \ub77c\uc774\ube0c\ub7ec\ub9ac\ub97c \uc784\ud3ec\ud2b8\ud560 \ub54c \ud574\ub2f9 \ubaa8\ub4c8\uc774\ub098 \ub77c\uc774\ube0c\ub7ec\ub9ac\uc758 \ud06c\uae30\ub97c \uc2e4\uc2dc\uac04\uc73c\ub85c \ud45c\uc2dc\ud574\uc90d\ub2c8\ub2e4. \uc774\ub85c \uc778\ud574 \uac1c\ubc1c\uc790\ub294 \ubc88\ub4e4 \uc0ac\uc774\uc988\uac00 \uacfc\ub3c4\ud558\uac8c \ucee4\uc9c0\ub294 \uac83\uc744 \ubbf8\ub9ac \uc778\uc9c0\ud558\uace0, \ud544\uc694\ud55c \uacbd\uc6b0 \ub354 \uacbd\ub7c9\ud654\ub41c \ub300\uc548\uc744 \ucc3e\uc744 \uc218 \uc788\uac8c \ub3c4\uc640\uc90d\ub2c8\ub2e4. \uc774\ub294 \uc6f9 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \ub85c\ub529 \uc2dc\uac04\uacfc \uc131\ub2a5 \ucd5c\uc801\ud654\uc5d0 \ud070 \ub3c4\uc6c0\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4."),(0,a.kt)("h2",{id:"6-vscode-styled-components"},"6. vscode-styled-components"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=188",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components"},"vscode-styled-components"),"\ub294 ",(0,a.kt)("a",{parentName:"p",href:"https://emotion.sh/docs/introduction"},"emotion.js"),"\uc640 \uac19\uc740 ",(0,a.kt)("inlineCode",{parentName:"p"},"styled-components")," \ub77c\uc774\ube0c\ub7ec\ub9ac\ub97c \uc0ac\uc6a9\ud558\uc5ec \uc2a4\ud0c0\uc77c\ub9c1\ub41c React \ucef4\ud3ec\ub10c\ud2b8\ub97c \uac1c\ubc1c\ud560 \ub54c \ub3c4\uc6c0\uc744 \uc90d\ub2c8\ub2e4."),(0,a.kt)("p",null,"\uc8fc\uc694 \ud2b9\uc9d5\uacfc \uc7a5\uc810\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"\uad6c\ubb38 \uac15\uc870"),": ",(0,a.kt)("inlineCode",{parentName:"li"},"styled-components"),"\uc758 \ud15c\ud50c\ub9bf \ub9ac\ud130\ub7f4 \ub0b4\uc5d0\uc11c CSS \uad6c\ubb38\uc744 \uac15\uc870\ud558\uc5ec \ucf54\ub4dc\uc758 \uac00\ub3c5\uc131\uc744 \ud5a5\uc0c1\uc2dc\ud0b5\ub2c8\ub2e4."),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"\uc790\ub3d9 \uc644\uc131"),": CSS \uc18d\uc131\uacfc \uac12\uc5d0 \ub300\ud55c \uc790\ub3d9 \uc644\uc131\uc744 \uc81c\uacf5\ud558\uc5ec \ube60\ub974\uace0 \uc815\ud655\ud55c \ucf54\ub4dc \uc791\uc131\uc744 \ub3d5\uc2b5\ub2c8\ub2e4."),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"\ud3ec\ud568\ub41c \uc5d0\ub7ec \ud45c\uc2dc"),": \uc798\ubabb\ub41c CSS \uc18d\uc131 \ub610\ub294 \uac12\uc774 \uc0ac\uc6a9\ub420 \ub54c \uc624\ub958\ub97c \uc2e4\uc2dc\uac04\uc73c\ub85c \ud45c\uc2dc\ud569\ub2c8\ub2e4."),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Go to Definition \ubc0f Peek \uae30\ub2a5"),": CSS \uaddc\uce59\uacfc \uad00\ub828\ub41c \uc2a4\ud0c0\uc77c\ub9c1 \ubd80\ubd84\uc73c\ub85c \uc27d\uac8c \uc774\ub3d9\ud558\uac70\ub098 \ubbf8\ub9ac\ubcf4\uae30\ub97c \uc81c\uacf5\ud569\ub2c8\ub2e4.")),(0,a.kt)("h2",{id:"7-eslint"},"7. ESLint"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=215",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://eslint.org"},"ESLint"),"\ub294 \ucf54\ub4dc \ud488\uc9c8\uacfc \ucf54\ub529 \uc2a4\ud0c0\uc77c \ubb38\uc81c\ub97c \uc2dd\ubcc4\ud558\ub294 \ub370 \uc0ac\uc6a9\ub418\ub294 \uc790\ubc14\uc2a4\ud06c\ub9bd\ud2b8 \ub9b0\ud130\uc785\ub2c8\ub2e4. ",(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint"},"Visual Studio Code\uc6a9 ESLint \ud50c\ub7ec\uadf8\uc778"),"\uc740 \ucf54\ub4dc\ub97c \uc791\uc131\ud558\ub294 \ub3d9\uc548 \uc790\ubc14\uc2a4\ud06c\ub9bd\ud2b8\uc640 TypeScript \ucf54\ub4dc\uc758 \ubb38\uc81c\uc810\uc744 \uc2e4\uc2dc\uac04\uc73c\ub85c \uac10\uc9c0\ud558\uace0 \ud45c\uc2dc\ud574\uc90d\ub2c8\ub2e4. \uc774 \ud50c\ub7ec\uadf8\uc778\uc740 \ud300 \uc804\uccb4\uc758 \ucf54\ub529 \ud45c\uc900\uc744 \uc77c\uad00\ub418\uac8c \uc720\uc9c0\ud558\ub294 \ub370 \ub3c4\uc6c0\uc744 \uc8fc\uba70, \uc7a0\uc7ac\uc801\uc778 \uc624\ub958\ub098 \uc548\ud2f0 \ud328\ud134\uc744 \ud53c\ud560 \uc218 \uc788\uac8c \ud569\ub2c8\ub2e4. \uc0ac\uc6a9\uc790 \uc815\uc758 \uaddc\uce59\uacfc \ud655\uc7a5 \uae30\ub2a5\uc744 \ud1b5\ud574 \ud504\ub85c\uc81d\ud2b8\uc758 \ud2b9\uc815 \ud544\uc694\uc5d0 \ub9de\uac8c \ub9b0\ud305 \uacfc\uc815\uc744 \ub9de\ucda4 \uc124\uc815\ud560 \uc218\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uacb0\ub860\uc801\uc73c\ub85c, ",(0,a.kt)("inlineCode",{parentName:"p"},"ESLint")," \ud50c\ub7ec\uadf8\uc778\uc740 \ucf54\ub4dc\uc758 \ud488\uc9c8\uc744 \ud5a5\uc0c1\uc2dc\ud0a4\uace0, \uac1c\ubc1c\uc790 \uac04\uc758 \ucf54\ub4dc \uc77c\uad00\uc131\uc744 \uc720\uc9c0\ud558\uba70, \uc624\ub958\ub97c \ucd5c\uc18c\ud654\ud558\ub294 \ub370 \ud070 \ub3c4\uc6c0\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4."),(0,a.kt)("h2",{id:"8-prettier"},"8. Prettier"),(0,a.kt)("div",{class:"video-container",style:{marginBottom:8}},(0,a.kt)("iframe",{width:"560",height:"315",src:"https://youtube.com/embed/5ivLyHDNR04?start=256",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://prettier.io"},"Prettier"),"\ub294 \uc790\ub3d9 \ucf54\ub4dc \ud3ec\ub9e4\ud130\ub85c, \uc9c0\uc6d0\ud558\ub294 \uc5ec\ub7ec \ud504\ub85c\uadf8\ub798\ubc0d \uc5b8\uc5b4\uc640 \ub9c8\ud06c\uc5c5 \uc5b8\uc5b4\uc758 \ucf54\ub4dc\ub97c \uc77c\uad00\ub41c \uc2a4\ud0c0\uc77c\ub85c \uc790\ub3d9\uc73c\ub85c \uc815\ub82c\ud574\uc8fc\ub294 \ub3c4\uad6c\uc785\ub2c8\ub2e4. ",(0,a.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode"},"Visual Studio Code\uc6a9 Prettier \ud50c\ub7ec\uadf8\uc778"),"\uc740 \ucf54\ub4dc\ub97c \uc800\uc7a5\ud560 \ub54c \uc790\ub3d9\uc73c\ub85c \ucf54\ub4dc \uc2a4\ud0c0\uc77c\uc744 \ucd5c\uc801\ud654\ud558\uba70, \uac1c\ubc1c\uc790\uac00 \uc218\ub3d9\uc73c\ub85c \ucf54\ub4dc \uc2a4\ud0c0\uc77c\uc744 \ub9de\ucd94\ub294 \uc218\uace0\ub97c \ub35c\uc5b4\uc90d\ub2c8\ub2e4. \uc774 \ud50c\ub7ec\uadf8\uc778\uc740 \ucf54\ub4dc\uc758 \uac00\ub3c5\uc131\uc744 \ud5a5\uc0c1\uc2dc\ud0a4\uace0, \ucf54\ub4dc \ub9ac\ubdf0 \uacfc\uc815\uc5d0\uc11c \uc2a4\ud0c0\uc77c \uad00\ub828\ub41c \ub17c\uc758\ub97c \ucd5c\uc18c\ud654\ud558\uc5ec \uac1c\ubc1c\uc790\ub4e4\uc774 \uc2e4\uc9c8\uc801\uc778 \ub85c\uc9c1\uc5d0 \uc9d1\uc911\ud560 \uc218 \uc788\uac8c \ub3c4\uc640\uc90d\ub2c8\ub2e4. \uc0ac\uc6a9\uc790\ub294 ",(0,a.kt)("inlineCode",{parentName:"p"},"Prettier"),"\uc758 \uc124\uc815\uc744 \ud1b5\ud574 \uc6d0\ud558\ub294 \ucf54\ub4dc \uc2a4\ud0c0\uc77c\uc744 \uc9c0\uc815\ud560 \uc218 \uc788\uc73c\uba70, \uc774 \ud234\uc740 \ud504\ub85c\uc81d\ud2b8 \uc804\uccb4\uc5d0\uc11c \uc77c\uad00\ub41c \ucf54\ub4dc \uc2a4\ud0c0\uc77c\uc744 \uc720\uc9c0\ud558\ub294 \ub370 \ub9e4\uc6b0 \uc720\uc6a9\ud569\ub2c8\ub2e4."),(0,a.kt)(i.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile",mdxType:"AdFitMobileBanner"}))}v.isMDXComponent=!0}}]);