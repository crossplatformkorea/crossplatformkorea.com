"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[2538],{1636:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var o=t(4848),a=t(8453),s=t(5391);const r={id:"react",title:"React",sidebar_label:"React",sidebar_position:3},i=void 0,c={id:"react-native/react",title:"React",description:"<AdFitMobileBanner",source:"@site/docs/react-native/react.mdx",sourceDirName:"react-native",slug:"/react-native/react",permalink:"/en/docs/current/react-native/react",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/react.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"react",title:"React",sidebar_label:"React",sidebar_position:3},sidebar:"react-native",previous:{title:"ES6",permalink:"/en/docs/current/react-native/es6"},next:{title:"Style",permalink:"/en/docs/current/category/style"}},l={},d=[{value:"React for React Native",id:"react-for-react-native",level:2},{value:"1. Component",id:"1-component",level:3},{value:"2. State &amp; Props",id:"2-state--props",level:3},{value:"props (Properties)",id:"props-properties",level:4},{value:"state (Status)",id:"state-status",level:4},{value:"3. Lifecycle &amp; Hooks",id:"3-lifecycle--hooks",level:3}];function p(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s.A,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,o.jsx)(n.p,{children:"React Native is a framework for mobile app development, based on the fundamental principles of React. Understanding React's core concepts greatly assists in using React Native effectively."}),"\n",(0,o.jsx)(n.h2,{id:"react-for-react-native",children:"React for React Native"}),"\n",(0,o.jsx)(n.p,{children:"In this article, we'll delve into React's core concepts and see how they apply to React Native."}),"\n",(0,o.jsx)(n.h3,{id:"1-component",children:"1. Component"}),"\n",(0,o.jsx)(n.p,{children:"Components are the core of both React and React Native. They are reusable units that make up the UI and are independent and recyclable."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"React Example:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:"function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"React Native Example:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:"import { Text } from 'react-native';\n\nfunction Welcome(props) {\n  return <Text>Hello, {props.name}</Text>;\n}\n"})}),"\n",(0,o.jsx)(n.h3,{id:"2-state--props",children:"2. State & Props"}),"\n",(0,o.jsxs)(n.p,{children:["React components manage data through ",(0,o.jsx)(n.code,{children:"state"})," and ",(0,o.jsx)(n.code,{children:"props"}),". ",(0,o.jsx)(n.code,{children:"Props"})," are data passed down from parent components, while ",(0,o.jsx)(n.code,{children:"state"})," represents data that can change within a component."]}),"\n",(0,o.jsx)(n.p,{children:"Components can have their own state and properties (props), and the UI of a React application is composed of a combination of these components. Components can be defined either as functional or class-based. In modern React applications, functional components are predominantly used."}),"\n",(0,o.jsxs)(n.p,{children:["When designing components in React, ",(0,o.jsx)(n.code,{children:"props"})," and ",(0,o.jsx)(n.code,{children:"state"})," are two crucial concepts. These two help define how a component processes and displays information."]}),"\n",(0,o.jsx)(n.h4,{id:"props-properties",children:"props (Properties)"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"props"}),' is short for "properties".']}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Information Transfer"}),": ",(0,o.jsx)(n.code,{children:"props"})," are used to pass information from a parent component to a child component."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Read-only"}),": ",(0,o.jsx)(n.code,{children:"props"})," cannot be modified within a component. In other words, a component must use the ",(0,o.jsx)(n.code,{children:"props"})," as they are received."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Example"}),": Imagine giving someone your business card to convey your name. The information on that card doesn't change. Similarly, ",(0,o.jsx)(n.code,{children:"props"})," passed to a component can be thought of as unchangeable information."]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"state-status",children:"state (Status)"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"state"})," is information managed within the component."]}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Changeable"}),": ",(0,o.jsx)(n.code,{children:"state"})," can change over time. It can be updated for various reasons, such as user interactions or receiving new data from a server."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Internally Managed"}),": ",(0,o.jsx)(n.code,{children:"state"})," is managed only within the component, and it cannot be directly modified from outside."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.strong,{children:"Example"}),": Imagine things like your mood or thoughts, which can change as time passes. The component's ",(0,o.jsx)(n.code,{children:"state"})," manages information that can change over time in a similar way."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"To summarize briefly:"}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"props"}),": Information received from the parent that cannot be changed."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Official Documentation: ",(0,o.jsx)(n.a,{href:"https://react.dev/learn/passing-props-to-a-component",children:"Passing Props to a Component"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"state"}),": Information managed within the component that can change depending on time or circumstances."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Official Documentation: ",(0,o.jsx)(n.a,{href:"https://react.dev/learn/managing-state",children:"Managing State"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"React Native Example:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import React, { useState } from 'react';\nimport { Text, Button } from 'react-native';\n\nfunction Counter(): JSX.Element {\n  const [count, setCount] = useState<number>(0);\n\n  const increment = () => {\n    setCount(prevCount => prevCount + 1);\n  };\n\n  return (\n    <>\n      <Text>{count}</Text>\n      <Button title=\"Increase\" onPress={increment} />\n    </>\n  );\n}\n\nexport default Counter;\n"})}),"\n",(0,o.jsx)(n.h3,{id:"3-lifecycle--hooks",children:"3. Lifecycle & Hooks"}),"\n",(0,o.jsxs)(n.p,{children:["Lifecycle methods are used in class components and get executed at specific times during a component's life. In function components, similar functionalities can be achieved using ",(0,o.jsx)(n.code,{children:"Hooks"}),"."]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"React Native Hooks Example:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:"import { useState, useEffect } from 'react';\nimport { Text } from 'react-native';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    // Executes when the component mounts or updates.\n    console.log('Component updated!');\n\n    return () => {\n      // Executes when the component will unmount.\n      console.log('Component will unmount!');\n    };\n  }, [count]); // Executes every time 'count' changes.\n\n  return <Text>{count}</Text>;\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"These fundamental concepts of React apply directly to React Native. Building on these React principles allows for more effective mobile app development in React Native. Thus, a solid grasp of React's fundamentals will naturally lead to a smoother transition to React Native."}),"\n",(0,o.jsx)(s.A,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},9111:(e,n,t)=>{t.d(n,{A:()=>s});var o=t(6540),a=t(4848);function s(e){let{className:n="adfit",style:t,unit:s,height:r,width:i}=e;return(0,o.useEffect)((()=>{const e=setTimeout((()=>{let e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",i.toString()),e.setAttribute("data-ad-height",r.toString()),e.setAttribute("data-ad-unit",s.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return()=>{clearTimeout(e)}}),[]),(0,a.jsx)("div",{style:t,children:(0,a.jsx)("div",{className:n})})}},5391:(e,n,t)=>{t.d(n,{A:()=>s});t(6540);var o=t(9111),a=t(4848);function s(e){let{unit:n,className:t,height:s=100,width:r=320,style:i}=e;return(0,a.jsx)(o.A,{unit:n,height:s,width:r,className:t,style:{flex:1,marginTop:24,marginBottom:24,...i}})}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>i});var o=t(6540);const a={},s=o.createContext(a);function r(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);