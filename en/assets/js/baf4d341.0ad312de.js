"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[6523],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),p=s(n),d=o,f=p["".concat(c,".").concat(d)]||p[d]||m[d]||a;return n?r.createElement(f,i(i({ref:t},l),{},{components:n})):r.createElement(f,i({ref:t},l))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u[p]="string"==typeof e?e:o,i[1]=u;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294);function o(e){var t=e.className,n=void 0===t?"adfit":t,o=e.style,a=e.unit,i=e.height,u=e.width;return(0,r.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",u.toString()),e.setAttribute("data-ad-height",i.toString()),e.setAttribute("data-ad-unit",a.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),r.createElement("div",{style:o},r.createElement("div",{className:n}))}},9388:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294),o=n(7859);function a(e){var t=e.unit,n=e.className,a=e.height,i=void 0===a?100:a,u=e.width,c=void 0===u?320:u,s=e.style;return r.createElement(o.Z,{unit:t,height:i,width:c,className:n,style:Object.assign({flex:1,marginTop:24,marginBottom:24},s)})}},8031:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return m}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=n(9388),u=["components"],c={slug:"meetup-20230628",title:"June Meetup",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Meetup"]},s=void 0,l={permalink:"/en/blog/meetup-20230628",source:"@site/blog/2023-06-28-meetup.mdx",title:"June Meetup",description:"At our June meetup, we continued our discussion from May about UI components, this time with a live coding session. We tackled the Accordion component, which is a bit more challenging and offers more points of consideration than a simple button.",date:"2023-06-28T00:00:00.000Z",formattedDate:"June 28, 2023",tags:[{label:"Meetup",permalink:"/en/blog/tags/meetup"}],readingTime:.72,hasTruncateMarker:!1,authors:[{name:"hyochan",title:"organizer",url:"https://github.com/hyochan",imageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4"}],frontMatter:{slug:"meetup-20230628",title:"June Meetup",author:"hyochan",authorTitle:"organizer",authorURL:"https://github.com/hyochan",authorImageURL:"https://avatars1.githubusercontent.com/u/27461460?s=460&u=b5860875e26d33fd70fd210f4ea74f81cdf9d99b&v=4",authorTwitter:"dooboolab",tags:["Meetup"]},prevItem:{title:"React Native New Architecture",permalink:"/en/blog/2023-07-16-new-architecture"},nextItem:{title:"May Meetup",permalink:"/en/blog/meetup-20230531"}},p={authorsImageUrls:[void 0]},m=[{value:"On-site photo",id:"on-site-photo",level:4},{value:"Part of Presentation Video",id:"part-of-presentation-video",level:4}],d={toc:m},f="wrapper";function h(e){var t=e.components,n=(0,o.Z)(e,u);return(0,a.kt)(f,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"At our June meetup, we continued our discussion from May about UI components, this time with a live coding session. We tackled the Accordion component, which is a bit more challenging and offers more points of consideration than a simple button."),(0,a.kt)("p",null,"We've brought back live coding to our meetups after a long hiatus. If you're interested in participating, we offer a presentation fee worth 150,000 KRW. As you'll see in our videos, our goal is not to intimidate, but rather to learn and help each other. We encourage you to apply in a relaxed manner."),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://forms.gle/x6oAt28FnepAAJtp6"},"Presentation application form")),(0,a.kt)("p",null,"Thank you."),(0,a.kt)("h4",{id:"on-site-photo"},"On-site photo"),(0,a.kt)("img",{src:"https://github.com/crossplatformkorea/crossplatformkorea.com/assets/27461460/a338f047-19ba-43bc-be1c-560070a6dc71",width:"480"}),(0,a.kt)("img",{src:"https://github.com/crossplatformkorea/crossplatformkorea.com/assets/27461460/ac91beb2-1548-4e8a-90fb-3b465a2c3387",width:"480"}),(0,a.kt)("h4",{id:"part-of-presentation-video"},"Part of Presentation Video"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://youtu.be/zjiXDrMJ-R0"},"Live Coding UI Components - Part 1 (Feat. Accordion)")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://youtu.be/MLJ4gXdeDHg"},"Live Coding UI Components - Part 2 (Feat. Accordion)"))),(0,a.kt)(i.Z,{unit:"DAN-MKrQwsmxT8uLhukP",className:"adfit-middle-mobile-2023-06-28",mdxType:"AdFitMobileBanner"}))}h.isMDXComponent=!0}}]);