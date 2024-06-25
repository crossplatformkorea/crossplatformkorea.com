"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[5585],{229:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var r=t(4848),a=t(8453),o=t(5391);const i={id:"expo-router",title:"Expo Router",sidebar_label:"Expo Router",sidebar_position:2},s=void 0,c={id:"react-native/router/expo-router",title:"Expo Router",description:"<AdFitMobileBanner",source:"@site/docs/react-native/router/expo-router.mdx",sourceDirName:"react-native/router",slug:"/react-native/router/expo-router",permalink:"/en/docs/current/react-native/router/expo-router",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/router/expo-router.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"expo-router",title:"Expo Router",sidebar_label:"Expo Router",sidebar_position:2},sidebar:"react-native",previous:{title:"Router",permalink:"/en/docs/current/react-native/router/"},next:{title:"Development",permalink:"/en/docs/current/category/development"}},d={},l=[{value:"Tabs",id:"tabs",level:2},{value:"1. What is a Tab Layout?",id:"1-what-is-a-tab-layout",level:3},{value:"2. Hiding Tabs",id:"2-hiding-tabs",level:3},{value:"3. Dynamic Routes",id:"3-dynamic-routes",level:3},{value:"Drawers",id:"drawers",level:2},{value:"How to set up Drawers:",id:"how-to-set-up-drawers",level:3}];function u(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.A,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,r.jsxs)(n.p,{children:["In the ",(0,r.jsx)(n.a,{href:"./router",children:"Router Section"})," as mentioned, while React Native has various routers like ",(0,r.jsx)(n.a,{href:"https://reactnavigation.org",children:"react-navigation"})," and ",(0,r.jsx)(n.a,{href:"https://github.com/wix/react-native-navigation",children:"react-native-navigation"}),",\nin our community, we recommend ",(0,r.jsx)(n.a,{href:"https://docs.expo.dev/routing/introduction",children:"expo-router"}),". It's not just because it's a newly introduced router, but because it's a file-based router. This not only reduces unnecessary code but also makes the code itself more concise and intuitive."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Expo Router"})," is a file-based router designed for ",(0,r.jsx)(n.strong,{children:"Universal React Native"})," applications built with ",(0,r.jsx)(n.strong,{children:"Expo"}),".\nThis router allows for managing screen transitions in both ",(0,r.jsx)(n.strong,{children:"React Native"})," and web applications, facilitating smooth navigation for users across different parts of the app's UI.\nThrough this, it's possible to manage screen transitions within an app using the same components across multiple platforms (Android, iOS, and web)."]}),"\n",(0,r.jsxs)(n.p,{children:["Detailed information on how to use Expo Router can be found ",(0,r.jsx)(n.a,{href:"https://docs.expo.dev/routing/introduction",children:"here"}),".\nThis document explains how to manage screen transitions using Expo Router.\nFor instance, the following code demonstrates how to navigate between the ",(0,r.jsx)(n.code,{children:"HomeScreen"})," and ",(0,r.jsx)(n.code,{children:"ProfileScreen"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { useNavigation } from '@react-navigation/native';\nimport { Button } from 'react-native';\n\nfunction HomeScreen() {\n  const navigation = useNavigation();\n\n  return (\n    <Button\n      title=\"Go to Profile\"\n      onPress={() => {\n        navigation.navigate('Profile', { name: 'Jane' });\n      }}\n    />\n  );\n}\n\nfunction ProfileScreen({ route }) {\n  return <Text>This is {route.params.name}'s profile</Text>;\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["In the code above, the ",(0,r.jsx)(n.code,{children:"useNavigation"})," hook is employed to retrieve the ",(0,r.jsx)(n.code,{children:"navigation"})," object, followed by rendering the ",(0,r.jsx)(n.code,{children:"Button"})," component.\nUpon triggering the ",(0,r.jsx)(n.code,{children:"onPress"})," handler, the ",(0,r.jsx)(n.code,{children:"navigation.navigate"})," method is invoked to transition to the ",(0,r.jsx)(n.code,{children:"ProfileScreen"}),".\nAt this juncture, the ",(0,r.jsx)(n.code,{children:"name"})," parameter is passed along. Within the ",(0,r.jsx)(n.code,{children:"ProfileScreen"}),", the ",(0,r.jsx)(n.code,{children:"name"})," parameter is accessed using ",(0,r.jsx)(n.code,{children:"route.params.name"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"tabs",children:"Tabs"}),"\n",(0,r.jsx)(n.h3,{id:"1-what-is-a-tab-layout",children:"1. What is a Tab Layout?"}),"\n",(0,r.jsx)(n.p,{children:"The Tab layout in Expo Router makes use of the bottom tabs provided by React Navigation."}),"\n",(0,r.jsxs)(n.p,{children:["Expo Router introduces an ",(0,r.jsx)(n.code,{children:"href"})," screen option, but this can only be used in object form screen options (e.g., ",(0,r.jsx)(n.code,{children:'screenOptions={{ href: "/path" }}'}),"), and it cannot be used in conjunction with ",(0,r.jsx)(n.code,{children:"tabBarButton"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"2-hiding-tabs",children:"2. Hiding Tabs"}),"\n",(0,r.jsxs)(n.p,{children:["Sometimes you may want to keep a route but not have it displayed on the tab bar. In such cases, you can disable the button using ",(0,r.jsx)(n.code,{children:"href: null"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { Tabs } from 'expo-router/tabs';\n\nexport default function AppLayout() {\n  return (\n    <Tabs>\n      <Tabs.Screen\n        // Name of the route you want to hide.\n        name=\"index\"\n        options={{\n          // This tab will no longer appear on the tab bar.\n          href: null,\n        }}\n      />\n    </Tabs>\n  );\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"3-dynamic-routes",children:"3. Dynamic Routes"}),"\n",(0,r.jsxs)(n.p,{children:["When trying to use a dynamic route in the tab bar (e.g., a profile tab), you might want to ensure that the button always links to a specific ",(0,r.jsx)(n.code,{children:"href"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { Tabs } from 'expo-router/tabs';\n\nexport default function AppLayout() {\n  return (\n    <Tabs>\n      <Tabs.Screen\n        // Name of the dynamic route.\n        name=\"[user]\"\n        options={{\n          // Make the tab always link to this particular href.\n          href: '/evanbacon',\n          // Or you can use an Href object:\n          href: {\n            pathname: '/[user]',\n            params: {\n              user: 'evanbacon',\n            },\n          },\n        }}\n      />\n    </Tabs>\n  );\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"Following the above guide, you can effectively utilize tab navigation in Expo Router."}),"\n",(0,r.jsx)(n.h2,{id:"drawers",children:"Drawers"}),"\n",(0,r.jsx)(n.p,{children:'Using the drawer layout in Expo Router allows you to create a side navigation menu, often referred to as a "drawer". This drawer is hidden off-screen and can be accessed through swipes or toggles.'}),"\n",(0,r.jsx)(n.h3,{id:"how-to-set-up-drawers",children:"How to set up Drawers:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Install the required packages:"}),"\nBefore you can use the drawer navigator, you need to install a few packages:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"@react-navigation/drawer"}),": The primary package for the drawer navigator."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"react-native-gesture-handler"}),": Manages touch gestures in React Native."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"react-native-reanimated"}),": Provides more variety in animation and gesture handling."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Update babel.config.js:"}),"\nAfter installing the packages, update ",(0,r.jsx)(n.code,{children:"babel.config.js"})," to include the reanimated plugin:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"module.exports = {\n  presets: [\n      ... \n    ],\n  plugins: [\n    ... \n    'react-native-reanimated/plugin',\n  ],\n};\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"This configuration ensures the React Native Reanimated plugin integrates correctly with Babel. It's essential for smooth animations and gestures."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Clear the Babel cache:"}),"\nAfter making changes to ",(0,r.jsx)(n.code,{children:"babel.config.js"}),", clear the babel cache and restart the development server:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npx expo start --clear\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Implement the drawer in the layout:"}),"\nNow, you are ready to incorporate the drawer layout into your app:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { Drawer } from 'expo-router/drawer';\n\nexport default function Layout() {\n  return <Drawer />;\n}\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"This code showcases the basic implementation of Expo Router's drawer. You can expand upon this as needed to provide additional settings or content to the drawer."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"When working with tools or packages, it's a good idea to consult official documentation or in-depth tutorials if you're looking to build complex navigation patterns. This guide aims to provide basic information required to get started with Expo Router's drawer."}),"\n",(0,r.jsx)(o.A,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},9111:(e,n,t)=>{t.d(n,{A:()=>o});var r=t(6540),a=t(4848);function o(e){let{className:n="adfit",style:t,unit:o,height:i,width:s}=e;return(0,r.useEffect)((()=>{const e=setTimeout((()=>{let e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",s.toString()),e.setAttribute("data-ad-height",i.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return()=>{clearTimeout(e)}}),[]),(0,a.jsx)("div",{style:t,children:(0,a.jsx)("div",{className:n})})}},5391:(e,n,t)=>{t.d(n,{A:()=>o});t(6540);var r=t(9111),a=t(4848);function o(e){let{unit:n,className:t,height:o=100,width:i=320,style:s}=e;return(0,a.jsx)(r.A,{unit:n,height:o,width:i,className:t,style:{flex:1,marginTop:24,marginBottom:24,...s}})}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>s});var r=t(6540);const a={},o=r.createContext(a);function i(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);