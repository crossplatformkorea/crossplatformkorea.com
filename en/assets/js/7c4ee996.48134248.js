"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[7569],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return h}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),m=c(r),h=a,f=m["".concat(l,".").concat(h)]||m[h]||p[h]||o;return r?n.createElement(f,i(i({ref:t},s),{},{components:r})):n.createElement(f,i({ref:t},s))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7859:function(e,t,r){r.d(t,{Z:function(){return a}});var n=r(7294);function a(e){var t=e.className,r=void 0===t?"adfit":t,a=e.style,o=e.unit,i=e.height,u=e.width;return(0,n.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",u.toString()),e.setAttribute("data-ad-height",i.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+r).appendChild(e),document.querySelector("."+r).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),n.createElement("div",{style:a},n.createElement("div",{className:r}))}},9388:function(e,t,r){r.d(t,{Z:function(){return o}});var n=r(7294),a=r(7859);function o(e){var t=e.unit,r=e.className;return n.createElement(a.Z,{unit:t,height:100,width:320,className:r,style:{flex:1,marginTop:24,marginBottom:24}})}},9994:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return m}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=r(9388),u=["components"],l={slug:"kakao-login-web",title:"Kakao Login Module Web Support",author:"nain93",authorTitle:"New New Frontend Namgyu Koo",authorURL:"https://github.com/nain93",authorImageURL:"https://avatars.githubusercontent.com/u/73378472?v=4","author Twitter":null,tags:["Meetup","Kakao Login","Web","Web Support","react-native-web"]},c=void 0,s={permalink:"/en/blog/kakao-login-web",source:"@site/blog/2022-09-26-kakao-login-web.mdx",title:"Kakao Login Module Web Support",description:"This is the content of the Cross-Platform Korea meetup on August 31st. KnewKnew front-end developer, Namkyu Kyu shared the process of contributing the web feature to the React Native Kakao Login open source, the problems he encountered, and how he solved them.",date:"2022-09-26T00:00:00.000Z",formattedDate:"September 26, 2022",tags:[{label:"Meetup",permalink:"/en/blog/tags/meetup"},{label:"Kakao Login",permalink:"/en/blog/tags/kakao-login"},{label:"Web",permalink:"/en/blog/tags/web"},{label:"Web Support",permalink:"/en/blog/tags/web-support"},{label:"react-native-web",permalink:"/en/blog/tags/react-native-web"}],readingTime:.3,hasTruncateMarker:!1,authors:[{name:"nain93",title:"New New Frontend Namgyu Koo",url:"https://github.com/nain93",imageURL:"https://avatars.githubusercontent.com/u/73378472?v=4"}],frontMatter:{slug:"kakao-login-web",title:"Kakao Login Module Web Support",author:"nain93",authorTitle:"New New Frontend Namgyu Koo",authorURL:"https://github.com/nain93",authorImageURL:"https://avatars.githubusercontent.com/u/73378472?v=4","author Twitter":null,tags:["Meetup","Kakao Login","Web","Web Support","react-native-web"]},prevItem:{title:"New GitHub stats visualization",permalink:"/en/blog/dooboo-stats"},nextItem:{title:"Greetings",permalink:"/en/blog/intro"}},p={authorsImageUrls:[void 0]},m=[{value:"Related PR",id:"related-pr",level:3}],h={toc:m};function f(e){var t=e.components,r=(0,a.Z)(e,u);return(0,o.kt)("wrapper",(0,n.Z)({},h,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This is the content of the ",(0,o.kt)("a",{parentName:"p",href:"https://www.meetup.com/ko-KR/crossplatformkorea/events/287894080"},"Cross-Platform Korea meetup on August 31st"),". KnewKnew front-end developer, Namkyu Kyu shared the process of contributing the web feature to the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/crossplatformkorea/react-native-kakao-login"},"React Native Kakao Login")," open source, the problems he encountered, and how he solved them."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=DZypUEUWth0"},"https://www.youtube.com/watch?v=DZypUEUWth0")),(0,o.kt)("h3",{id:"related-pr"},"Related PR"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/crossplatformkorea/react-native-kakao-login/pull/319"},"https://github.com/crossplatformkorea/react-native-kakao-login/pull/319")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/crossplatformkorea/react-native-kakao-login/pull/322"},"https://github.com/crossplatformkorea/react-native-kakao-login/pull/322")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/crossplatformkorea/react-native-kakao-login/pull/329"},"https://github.com/crossplatformkorea/react-native-kakao-login/pull/329"))),(0,o.kt)(i.Z,{unit:"DAN-ECUZO05s14SU0P7d",className:"adfit-middle-mobile-2022-09-26",mdxType:"AdFitMobileBanner"}))}f.isMDXComponent=!0}}]);