"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[9172],{3905:function(e,t,a){a.d(t,{Zo:function(){return l},kt:function(){return h}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var u=r.createContext({}),s=function(e){var t=r.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},l=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,u=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=s(a),d=n,h=p["".concat(u,".").concat(d)]||p[d]||m[d]||i;return a?r.createElement(h,o(o({ref:t},l),{},{components:a})):r.createElement(h,o({ref:t},l))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,o=new Array(i);o[0]=d;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c[p]="string"==typeof e?e:n,o[1]=c;for(var s=2;s<i;s++)o[s]=a[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},7859:function(e,t,a){a.d(t,{Z:function(){return n}});var r=a(7294);function n(e){var t=e.className,a=void 0===t?"adfit":t,n=e.style,i=e.unit,o=e.height,c=e.width;return(0,r.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",c.toString()),e.setAttribute("data-ad-height",o.toString()),e.setAttribute("data-ad-unit",i.toString()),document.querySelector("."+a).appendChild(e),document.querySelector("."+a).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),r.createElement("div",{style:n},r.createElement("div",{className:a}))}},9388:function(e,t,a){a.d(t,{Z:function(){return i}});var r=a(7294),n=a(7859);function i(e){var t=e.unit,a=e.className,i=e.height,o=void 0===i?100:i,c=e.width,u=void 0===c?320:c,s=e.style;return r.createElement(n.Z,{unit:t,height:o,width:u,className:a,style:Object.assign({flex:1,marginTop:24,marginBottom:24},s)})}},4697:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return u},metadata:function(){return l},toc:function(){return m}});var r=a(7462),n=a(3366),i=(a(7294),a(3905)),o=a(9388),c=["components"],u={slug:"2023-07-16-new-architecture",title:"React Native New Architecture",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Blog","React Native","New Architecture"]},s=void 0,l={permalink:"/en/blog/2023-07-16-new-architecture",source:"@site/blog/2023-07-16-new-architecture.mdx",title:"React Native New Architecture",description:"React Native Architecture refers to the internal structure and operating principles of a React Native application. The initial architecture of React Native consisted of several main components, and over time, enhancements and updates were made to improve the performance and stability of the application. This explanation is based on information up to 2021.",date:"2023-07-16T00:00:00.000Z",formattedDate:"July 16, 2023",tags:[{label:"Blog",permalink:"/en/blog/tags/blog"},{label:"React Native",permalink:"/en/blog/tags/react-native"},{label:"New Architecture",permalink:"/en/blog/tags/new-architecture"}],readingTime:1.36,hasTruncateMarker:!1,authors:[{name:"hyochan",title:"organizer",url:"https://github.com/hyochan",imageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4"}],frontMatter:{slug:"2023-07-16-new-architecture",title:"React Native New Architecture",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Blog","React Native","New Architecture"]},prevItem:{title:"Hermes \uc5d4\uc9c4\uc774\ub780",permalink:"/en/blog/2023-07-16-hermes"},nextItem:{title:"June Meetup",permalink:"/en/blog/meetup-20230628"}},p={authorsImageUrls:[void 0]},m=[],d={toc:m},h="wrapper";function f(e){var t=e.components,a=(0,n.Z)(e,c);return(0,i.kt)(h,(0,r.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"React Native Architecture")," refers to the internal structure and operating principles of a React Native application. The initial architecture of React Native consisted of several main components, and over time, enhancements and updates were made to improve the performance and stability of the application. This explanation is based on information up to 2021."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Bridge"),": This was a core component of React Native's initial architecture. The Bridge facilitated communication between the JavaScript thread and the Native thread. It was responsible for sending UI updates, events, etc., generated in JavaScript, to the Native code.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"JavaScript Core (JSC)"),": This is the JavaScript engine used in iOS. In Android, the JSC is bundled for distribution.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Native Modules"),": These are modules in React Native applications that provide access to the native features of a device. For instance, they allow access to the camera, GPS, and file system."))),(0,i.kt)("p",null,'However, Facebook is continuously working to improve the performance and flexibility of React Native\'s architecture. New architectural updates, like "Fabric" and "TurboModules," have been introduced.'),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Fabric"),": This is a project to rewrite the UI layer of React Native. It aims to achieve faster UI updates and smoother animations. Fabric minimizes the communication between JavaScript and Native, thereby enhancing performance.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"TurboModules"),": These are a rewritten version of Native Modules, aiming to improve the communication performance between the JavaScript thread and the Native thread."))),(0,i.kt)("p",null,"The introduction of this new architecture aims to boost the performance of React Native applications and streamline their integration with Native components."),(0,i.kt)("p",null,"For a more detailed understanding, check out ",(0,i.kt)("a",{parentName:"p",href:"https://medium.com/crossplatformkorea/%EB%A6%AC%EC%95%A1%ED%8A%B8%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8C-%EC%83%88%EB%A1%9C%EC%9A%B4-%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90-fae32d16f651"},"The New Architecture of React Native"),"."),(0,i.kt)(o.Z,{unit:"DAN-ToBFS44DTfrAHzOv",className:"adfit-middle-mobile-2023-07-16-2",mdxType:"AdFitMobileBanner"}))}f.isMDXComponent=!0}}]);