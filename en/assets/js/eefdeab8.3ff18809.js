"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[1572],{6011:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return a},default:function(){return p},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return d}});var i=n(5893),r=n(3905),s=n(9388);const o={id:"built-in",title:"Built-in Styling",sidebar_label:"Built-in Styling"},a=void 0,l={id:"react-native/style/built-in",title:"Built-in Styling",description:'When developing an application, regardless of mobile or web, how it appears and feels to the user is crucial. This appearance and feel are achieved through "styling." Styles have key attributes such as color, size, and position, determining how various parts (or components) of an app are represented.',source:"@site/docs/react-native/style/built-in.mdx",sourceDirName:"react-native/style",slug:"/react-native/style/built-in",permalink:"/en/docs/current/react-native/style/built-in",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/style/built-in.mdx",tags:[],version:"current",frontMatter:{id:"built-in",title:"Built-in Styling",sidebar_label:"Built-in Styling"},sidebar:"react-native",previous:{title:"Style",permalink:"/en/docs/current/category/style"},next:{title:"Styled Components",permalink:"/en/docs/current/react-native/style/styled-component"}},c={},d=[{value:"Applying Styles",id:"applying-styles",level:2},{value:"Understanding Flexbox",id:"understanding-flexbox",level:3},{value:"Points to Note",id:"points-to-note",level:3},{value:"Inline Styles",id:"inline-styles",level:2}];function u(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.ah)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:'When developing an application, regardless of mobile or web, how it appears and feels to the user is crucial. This appearance and feel are achieved through "styling." Styles have key attributes such as color, size, and position, determining how various parts (or components) of an app are represented.'}),"\n",(0,i.jsx)(s.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,i.jsxs)(t.p,{children:["Currently, ",(0,i.jsx)(t.strong,{children:"React Native"})," is mainly known for mobile app development. Using JavaScript and React, you can create apps for both iOS and Android. However, with tools like ",(0,i.jsx)(t.strong,{children:"React Native Web"}),", you can also develop web applications from the same codebase. Thus, essentially, you can write once and deploy across both mobile and web platforms."]}),"\n",(0,i.jsx)(t.h2,{id:"applying-styles",children:"Applying Styles"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Importing Necessary Modules"}),":\nFirst, fetch ",(0,i.jsx)(t.code,{children:"StyleSheet"})," from React Native. This module is essential for creating organized styles."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-javascript",children:"import { StyleSheet } from 'react-native';\n"})}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Defining Styles"}),":\nUse the ",(0,i.jsx)(t.code,{children:"StyleSheet.create"})," method to define styles. Each style has a name and sets attributes that determine the appearance of the component within."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-javascript",children:"const styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center',\n    backgroundColor: '#F5FCFF',\n  },\n  text: {\n    fontSize: 20,\n    textAlign: 'center',\n    margin: 10,\n  }\n});\n"})}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Applying Styles"}),":\nApply the defined styles to the React Native components."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-javascript",children:"import React from 'react';\nimport { View, Text } from 'react-native';\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.text}>Hello, React Native!</Text>\n    </View>\n  );\n}\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"understanding-flexbox",children:"Understanding Flexbox"}),"\n",(0,i.jsxs)(t.p,{children:["React Native adopts the ",(0,i.jsx)(t.code,{children:"flexbox"})," layout system for layouts. Flexbox is a powerful tool that makes designing complex layouts straightforward. The basic concept revolves around controlling the flexibility of containers and items to create layouts that respond to various screen sizes and orientations."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"flexDirection"}),": Sets the primary axis. You can set it to ",(0,i.jsx)(t.code,{children:"row"})," or ",(0,i.jsx)(t.code,{children:"column"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"justifyContent"}),": Determines alignment along the primary axis. Examples include ",(0,i.jsx)(t.code,{children:"center"}),", ",(0,i.jsx)(t.code,{children:"space-between"}),", and ",(0,i.jsx)(t.code,{children:"flex-start"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"alignItems"}),": Sets alignment on the cross-axis. Examples are ",(0,i.jsx)(t.code,{children:"center"}),", ",(0,i.jsx)(t.code,{children:"flex-start"}),", and ",(0,i.jsx)(t.code,{children:"flex-end"}),"."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"Many more attributes are available, but with just these, you can meet most layout requirements."}),"\n",(0,i.jsxs)(t.p,{children:["Flexbox is the most critical concept when dealing with React Native styling. You can find more details about Flexbox ",(0,i.jsx)(t.a,{href:"https://css-tricks.com/snippets/css/a-guide-to-flexbox/",children:"here"}),". Additionally, you may find the video we offer below helpful."]}),"\n",(0,i.jsx)("div",{class:"video-container",style:{marginBottom:8},children:(0,i.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/07ioPW-VKd4?si=-mku-ztYHU2siXJx",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowfullscreen:!0})}),"\n",(0,i.jsx)(t.h3,{id:"points-to-note",children:"Points to Note"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Camel Case"}),": React Native uses camelCase for attribute names. For instance, use ",(0,i.jsx)(t.code,{children:"backgroundColor"})," instead of ",(0,i.jsx)(t.code,{children:"background-color"}),"."]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"inline-styles",children:"Inline Styles"}),"\n",(0,i.jsxs)(t.p,{children:["React Native also supports inline styles, besides ",(0,i.jsx)(t.code,{children:"StyleSheet"}),". This method defines style attributes directly within the component. It's useful for quick styling or testing changes, but for larger projects or recurring styles, using ",(0,i.jsx)(t.code,{children:"StyleSheet"})," is recommended."]}),"\n",(0,i.jsx)(t.p,{children:"Example:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-javascript",children:"import React from 'react';\nimport { View, Text } from 'react-native';\n\nexport default function App() {\n  return (\n    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>\n      <Text style={{ fontSize: 20, textAlign: 'center', margin: 10 }}>\n        This is an example of inline styling!\n      </Text>\n    </View>\n  );\n}\n"})}),"\n",(0,i.jsxs)(t.p,{children:["In the example above, the ",(0,i.jsx)(t.code,{children:"style"})," properties of the ",(0,i.jsx)(t.code,{children:"View"})," and ",(0,i.jsx)(t.code,{children:"Text"})," components directly define style attributes as objects. This direct style definition method is known as inline styling. While this method can be useful for quick styling or experimenting with changes, it's recommended to use ",(0,i.jsx)(t.code,{children:"StyleSheet"})," for larger projects or recurring styles."]}),"\n",(0,i.jsx)(s.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function p(e={}){const{wrapper:t}={...(0,r.ah)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},3905:function(e,t,n){n.d(t,{ah:function(){return c}});var i=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},s=Object.keys(e);for(i=0;i<s.length;i++)n=s[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(i=0;i<s.length;i++)n=s[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=i.createContext({}),c=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},u=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),p=c(n),h=r,m=p["".concat(l,".").concat(h)]||p[h]||d[h]||s;return n?i.createElement(m,o(o({ref:t},u),{},{components:n})):i.createElement(m,o({ref:t},u))}));u.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return s}});var i=n(7294),r=n(5893);function s(e){var t=e.className,n=void 0===t?"adfit":t,s=e.style,o=e.unit,a=e.height,l=e.width;return(0,i.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",l.toString()),e.setAttribute("data-ad-height",a.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),(0,r.jsx)("div",{style:s,children:(0,r.jsx)("div",{className:n})})}},9388:function(e,t,n){n.d(t,{Z:function(){return s}});n(7294);var i=n(7859),r=n(5893);function s(e){var t=e.unit,n=e.className,s=e.height,o=void 0===s?100:s,a=e.width,l=void 0===a?320:a,c=e.style;return(0,r.jsx)(i.Z,{unit:t,height:o,width:l,className:n,style:Object.assign({flex:1,marginTop:24,marginBottom:24},c)})}}}]);