"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[5020],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),m=l(n),f=a,d=m["".concat(c,".").concat(f)]||m[f]||p[f]||o;return n?r.createElement(d,u(u({ref:t},s),{},{components:n})):r.createElement(d,u({ref:t},s))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,u=new Array(o);u[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,u[1]=i;for(var l=2;l<o;l++)u[l]=n[l];return r.createElement.apply(null,u)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294);function a(e){var t=e.className,n=void 0===t?"adfit":t,a=e.style,o=e.unit,u=e.height,i=e.width;return(0,r.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",i.toString()),e.setAttribute("data-ad-height",u.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),r.createElement("div",{style:a},r.createElement("div",{className:n}))}},9388:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294),a=n(7859);function o(e){var t=e.unit,n=e.className;return r.createElement(a.Z,{unit:t,height:100,width:320,className:n,style:{flex:1,marginTop:24,marginBottom:24}})}},7166:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),u=n(9388),i=["components"],c={slug:"code-push",title:"Code push experience",author:"JeffGuKang",authorTitle:"Monymony CTO",authorURL:"https://github.com/JeffGuKang",authorImageURL:"https://avatars.githubusercontent.com/u/216363?s=64&v=4","author Twitter":null,tags:["Meetup","App Center","CI","CD"]},l=void 0,s={permalink:"/en/blog/code-push",source:"@site/blog/2022-10-24-code-push.mdx",title:"Code push experience",description:"JeffGuKang shared talks about updating mobile clients on the fly via CodePush.",date:"2022-10-24T00:00:00.000Z",formattedDate:"October 24, 2022",tags:[{label:"Meetup",permalink:"/en/blog/tags/meetup"},{label:"App Center",permalink:"/en/blog/tags/app-center"},{label:"CI",permalink:"/en/blog/tags/ci"},{label:"CD",permalink:"/en/blog/tags/cd"}],readingTime:.105,hasTruncateMarker:!1,authors:[{name:"JeffGuKang",title:"Monymony CTO",url:"https://github.com/JeffGuKang",imageURL:"https://avatars.githubusercontent.com/u/216363?s=64&v=4"}],frontMatter:{slug:"code-push",title:"Code push experience",author:"JeffGuKang",authorTitle:"Monymony CTO",authorURL:"https://github.com/JeffGuKang",authorImageURL:"https://avatars.githubusercontent.com/u/216363?s=64&v=4","author Twitter":null,tags:["Meetup","App Center","CI","CD"]},prevItem:{title:"October Meetup",permalink:"/en/blog/meetup-20221026"},nextItem:{title:"Easy Build & Test Deployments with App Center",permalink:"/en/blog/app-center"}},p={authorsImageUrls:[void 0]},m=[],f={toc:m};function d(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"JeffGuKang shared talks about updating mobile clients on the fly via CodePush."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://youtu.be/78UAlT4z9XE"},"https://youtu.be/78UAlT4z9XE")),(0,o.kt)(u.Z,{unit:"DAN-xs0r56ZGEL2yMihi",className:"adfit-middle-mobile-2022-10-24",mdxType:"AdFitMobileBanner"}))}d.isMDXComponent=!0}}]);