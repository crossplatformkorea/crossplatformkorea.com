"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[4607],{3905:function(t,e,r){r.d(e,{Zo:function(){return p},kt:function(){return f}});var a=r(7294);function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,a)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function c(t,e){if(null==t)return{};var r,a,n=function(t,e){if(null==t)return{};var r,a,n={},o=Object.keys(t);for(a=0;a<o.length;a++)r=o[a],e.indexOf(r)>=0||(n[r]=t[r]);return n}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(a=0;a<o.length;a++)r=o[a],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}var u=a.createContext({}),l=function(t){var e=a.useContext(u),r=e;return t&&(r="function"==typeof t?t(e):i(i({},e),t)),r},p=function(t){var e=l(t.components);return a.createElement(u.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},m=a.forwardRef((function(t,e){var r=t.components,n=t.mdxType,o=t.originalType,u=t.parentName,p=c(t,["components","mdxType","originalType","parentName"]),m=l(r),f=n,d=m["".concat(u,".").concat(f)]||m[f]||s[f]||o;return r?a.createElement(d,i(i({ref:e},p),{},{components:r})):a.createElement(d,i({ref:e},p))}));function f(t,e){var r=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var o=r.length,i=new Array(o);i[0]=m;var c={};for(var u in e)hasOwnProperty.call(e,u)&&(c[u]=e[u]);c.originalType=t,c.mdxType="string"==typeof t?t:n,i[1]=c;for(var l=2;l<o;l++)i[l]=r[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7859:function(t,e,r){r.d(e,{Z:function(){return n}});var a=r(7294);function n(t){var e=t.className,r=void 0===e?"adfit":e,n=t.style,o=t.unit,i=t.height,c=t.width;return(0,a.useEffect)((function(){var t=setTimeout((function(){var t=document.createElement("ins"),e=document.createElement("script");t.className="kakao_ad_area",t.style="display:none; width:100%;",e.async="true",e.type="text/javascript",e.src="//t1.daumcdn.net/kas/static/ba.min.js",t.setAttribute("data-ad-width",c.toString()),t.setAttribute("data-ad-height",i.toString()),t.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+r).appendChild(t),document.querySelector("."+r).appendChild(e)}),100);return function(){clearTimeout(t)}}),[]),a.createElement("div",{style:n},a.createElement("div",{className:r}))}},9388:function(t,e,r){r.d(e,{Z:function(){return o}});var a=r(7294),n=r(7859);function o(t){var e=t.unit,r=t.className;return a.createElement(n.Z,{unit:e,height:100,width:320,className:r,style:{flex:1,marginTop:24,marginBottom:24}})}},427:function(t,e,r){r.r(e),r.d(e,{assets:function(){return s},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return m}});var a=r(7462),n=r(3366),o=(r(7294),r(3905)),i=r(9388),c=["components"],u={slug:"2023-07-16-new-architecture",title:"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c \ub9ac\uc544\ud0a4\ud14d\uccd0",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Blog","React Native","New Architecture"]},l=void 0,p={permalink:"/blog/2023-07-16-new-architecture",source:"@site/i18n/ko/docusaurus-plugin-content-blog/2023-07-16-new-architecture.mdx",title:"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c \ub9ac\uc544\ud0a4\ud14d\uccd0",description:"React Native Architecture\ub294 React Native \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \ub0b4\ubd80 \uad6c\uc870\uc640 \ub3d9\uc791 \uc6d0\ub9ac\ub97c \uc124\uba85\ud558\ub294 \uc6a9\uc5b4\uc785\ub2c8\ub2e4. React Native\uc758 \ucd08\uae30 \uc544\ud0a4\ud14d\ucc98\ub294 \uba87 \uac00\uc9c0 \uc8fc\uc694 \uad6c\uc131 \uc694\uc18c\ub85c \uad6c\uc131\ub418\uc5c8\uc73c\uba70, \uc2dc\uac04\uc774 \uc9c0\ub098\uba74\uc11c \uac1c\uc120\uacfc \uc5c5\ub370\uc774\ud2b8\uac00 \uc774\ub8e8\uc5b4\uc838 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \uc131\ub2a5\uacfc \uc548\uc815\uc131\uc744 \ud5a5\uc0c1\uc2dc\ucf30\uc2b5\ub2c8\ub2e4. 2021\ub144\uae4c\uc9c0\uc758 \uc815\ubcf4\ub97c \uae30\ubc18\uc73c\ub85c \uc124\uba85\ud558\uaca0\uc2b5\ub2c8\ub2e4.",date:"2023-07-16T00:00:00.000Z",formattedDate:"2023\ub144 7\uc6d4 16\uc77c",tags:[{label:"Blog",permalink:"/blog/tags/blog"},{label:"React Native",permalink:"/blog/tags/react-native"},{label:"New Architecture",permalink:"/blog/tags/new-architecture"}],readingTime:2.715,hasTruncateMarker:!1,authors:[{name:"hyochan",title:"organizer",url:"https://github.com/hyochan",imageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4"}],frontMatter:{slug:"2023-07-16-new-architecture",title:"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c \ub9ac\uc544\ud0a4\ud14d\uccd0",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Blog","React Native","New Architecture"]},prevItem:{title:"Hermes \uc5d4\uc9c4\uc774\ub780?",permalink:"/blog/2023-07-16-hermes"},nextItem:{title:"6\uc6d4 \ubc0b\uc5c5",permalink:"/blog/meetup-20230628"}},s={authorsImageUrls:[void 0]},m=[],f={toc:m};function d(t){var e=t.components,r=(0,n.Z)(t,c);return(0,o.kt)("wrapper",(0,a.Z)({},f,r,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"React Native Architecture"),"\ub294 React Native \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \ub0b4\ubd80 \uad6c\uc870\uc640 \ub3d9\uc791 \uc6d0\ub9ac\ub97c \uc124\uba85\ud558\ub294 \uc6a9\uc5b4\uc785\ub2c8\ub2e4. React Native\uc758 \ucd08\uae30 \uc544\ud0a4\ud14d\ucc98\ub294 \uba87 \uac00\uc9c0 \uc8fc\uc694 \uad6c\uc131 \uc694\uc18c\ub85c \uad6c\uc131\ub418\uc5c8\uc73c\uba70, \uc2dc\uac04\uc774 \uc9c0\ub098\uba74\uc11c \uac1c\uc120\uacfc \uc5c5\ub370\uc774\ud2b8\uac00 \uc774\ub8e8\uc5b4\uc838 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \uc131\ub2a5\uacfc \uc548\uc815\uc131\uc744 \ud5a5\uc0c1\uc2dc\ucf30\uc2b5\ub2c8\ub2e4. 2021\ub144\uae4c\uc9c0\uc758 \uc815\ubcf4\ub97c \uae30\ubc18\uc73c\ub85c \uc124\uba85\ud558\uaca0\uc2b5\ub2c8\ub2e4."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Bridge"),": React Native\uc758 \ucd08\uae30 \uc544\ud0a4\ud14d\ucc98\uc758 \ud575\uc2ec \uc694\uc18c\uc600\uc2b5\ub2c8\ub2e4. Bridge\ub294 JavaScript \uc2a4\ub808\ub4dc\uc640 Native \uc2a4\ub808\ub4dc \uac04\uc758 \ud1b5\uc2e0\uc744 \uac00\ub2a5\ud558\uac8c \ud588\uc2b5\ub2c8\ub2e4. JavaScript\uc5d0\uc11c \uc0dd\uc131\ub41c UI \uc5c5\ub370\uc774\ud2b8, \uc774\ubca4\ud2b8 \ub4f1\uc744 Native \ucf54\ub4dc\ub85c \uc804\uc1a1\ud558\ub294 \uc5ed\ud560\uc744 \ud569\ub2c8\ub2e4.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"JavaScript Core (JSC)"),": iOS\uc5d0\uc11c \uc0ac\uc6a9\ub418\ub294 JavaScript \uc5d4\uc9c4\uc785\ub2c8\ub2e4. Android\uc5d0\uc11c\ub294 JSC\ub97c \ud3ec\ud568\ud558\uc5ec \ubc88\ub4e4\uc5d0 \ud3ec\ud568\uc2dc\ucf1c \ubc30\ud3ec\ud569\ub2c8\ub2e4.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Native Modules"),": React Native \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0\uc11c \uae30\uae30\uc758 Native \uae30\ub2a5\uc5d0 \uc811\uadfc\ud560 \uc218 \uc788\uac8c \ud574\uc8fc\ub294 \ubaa8\ub4c8\uc785\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uba74, \uce74\uba54\ub77c, GPS, \ud30c\uc77c \uc2dc\uc2a4\ud15c\uc5d0 \uc811\uadfc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."))),(0,o.kt)("p",null,'\uadf8\ub7ec\ub098 Facebook\uc740 React Native\uc758 \uc131\ub2a5\uacfc \uc720\uc5f0\uc131\uc744 \ud5a5\uc0c1\uc2dc\ud0a4\uae30 \uc704\ud574 \uc544\ud0a4\ud14d\ucc98\ub97c \uacc4\uc18d \uac1c\uc120\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. "Fabric" \ubc0f "TurboModules"\uc640 \uac19\uc740 \uc0c8\ub85c\uc6b4 \uc544\ud0a4\ud14d\ucc98 \uc5c5\ub370\uc774\ud2b8\uac00 \ub3c4\uc785\ub418\uc5c8\uc2b5\ub2c8\ub2e4.'),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Fabric"),": React Native\uc758 UI \ub808\uc774\uc5b4\ub97c \uc7ac\uc791\uc131\ud558\ub294 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc774\ub97c \ud1b5\ud574 \ub354 \ube60\ub978 UI \uc5c5\ub370\uc774\ud2b8\uc640 \ub354 \ubd80\ub4dc\ub7ec\uc6b4 \uc560\ub2c8\uba54\uc774\uc158\uc744 \ub2ec\uc131\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. Fabric\uc740 JavaScript\uc640 Native \uac04\uc758 \ud1b5\uc2e0\uc744 \ucd5c\uc18c\ud654\ud558\uc5ec \uc131\ub2a5\uc744 \ud5a5\uc0c1\uc2dc\ud0b5\ub2c8\ub2e4.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"TurboModules"),": Native Modules\uc758 \uc7ac\uc791\uc131 \ubc84\uc804\uc73c\ub85c, JavaScript \uc2a4\ub808\ub4dc\uc640 Native \uc2a4\ub808\ub4dc \uac04\uc758 \ud1b5\uc2e0 \uc131\ub2a5\uc744 \ud5a5\uc0c1\uc2dc\ud0b5\ub2c8\ub2e4."))),(0,o.kt)("p",null,"\uc0c8\ub85c\uc6b4 \uc544\ud0a4\ud14d\ucc98\uc758 \ub3c4\uc785\uc740 React Native \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc758 \uc131\ub2a5\uc744 \ud5a5\uc0c1\uc2dc\ud0a4\uba70, Native\uc640\uc758 \ud1b5\ud569\uc744 \ub354\uc6b1 \uc6d0\ud65c\ud558\uac8c \ub9cc\ub4e4\uae30 \uc704\ud55c \uac83\uc785\ub2c8\ub2e4."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://medium.com/crossplatformkorea/%EB%A6%AC%EC%95%A1%ED%8A%B8%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8C-%EC%83%88%EB%A1%9C%EC%9A%B4-%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90-fae32d16f651"},"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c \uc0c8\ub85c\uc6b4 \uc544\ud0a4\ud14d\uccd0"),"\uc5d0 \ub300\ud574\uc11c \ub354 \uc790\uc138\ud788 \uc54c\uc544\ubcf4\uc138\uc694."),(0,o.kt)(i.Z,{unit:"DAN-ToBFS44DTfrAHzOv",className:"adfit-middle-mobile-2023-07-16-2",mdxType:"AdFitMobileBanner"}))}d.isMDXComponent=!0}}]);