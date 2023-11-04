"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[8482],{2638:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return o},metadata:function(){return a},toc:function(){return d}});var i=t(5893),s=t(3905),r=t(9388);const o={id:"styled-component",title:"Styled Components",sidebar_label:"Styled Components"},l=void 0,a={id:"react-native/style/styled-component",title:"Styled Components",description:"React Native inherently comes with an API named StyleSheet for styling.",source:"@site/docs/react-native/style/styled-component.mdx",sourceDirName:"react-native/style",slug:"/react-native/style/styled-component",permalink:"/en/docs/current/react-native/style/styled-component",draft:!1,unlisted:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/style/styled-component.mdx",tags:[],version:"current",frontMatter:{id:"styled-component",title:"Styled Components",sidebar_label:"Styled Components"},sidebar:"react-native",previous:{title:"Built-in Styling",permalink:"/en/docs/current/react-native/style/built-in"},next:{title:"Component",permalink:"/en/docs/current/category/component"}},c={},d=[{value:"CSS-in-JS",id:"css-in-js",level:2},{value:"Styled Components",id:"styled-components",level:2},{value:"Emotion \ud83c\udfc6",id:"emotion-",level:2},{value:"Installation",id:"installation",level:3},{value:"Usage Examples",id:"usage-examples",level:3},{value:"1. Styled Components",id:"1-styled-components",level:4},{value:"2. <code>css</code> prop (inline style) example",id:"2-css-prop-inline-style-example",level:4}];function p(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,s.ah)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["React Native inherently comes with an API named ",(0,i.jsx)(n.a,{href:"./built-in",children:"StyleSheet"})," for styling.\nHowever, many developers prefer the CSS-in-JS style of styling. For this, they utilize external libraries like ",(0,i.jsx)(n.a,{href:"https://styled-components.com",children:"styled-components"})," or ",(0,i.jsx)(n.a,{href:"https://emotion.sh/docs/@emotion/native",children:"@emotion/native"}),", allowing them to write style code in React Native in the same manner as the styled-components method found in web development."]}),"\n",(0,i.jsx)(n.p,{children:"In other words, when developing a React Native app, besides the default styling method provided, there are several external libraries available that assist in importing the web styling experience directly."}),"\n",(0,i.jsx)(r.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile"}),"\n",(0,i.jsx)(n.h2,{id:"css-in-js",children:"CSS-in-JS"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://cssinjs.org/?v=v10.10.0",children:"CSS-in-JS"})," is a paradigm in web development, offering a methodology for writing CSS styles directly within JavaScript code. The main advantages and features of CSS-in-JS include:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Component-based"}),": CSS-in-JS meshes well with component-based frameworks like React. Styles for each component are encapsulated within its respective file, enhancing component independence and reusability."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Dynamic Styling"}),": It leverages JavaScript variables and functions to dynamically generate styles. This is particularly useful when wanting to alter styles based on user interactions or state changes."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Scoping Solutions"}),": Traditional CSS can experience style clashes due to its global scoping issues. CSS-in-JS resolves this, reducing the risk of style conflicts."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Convenient Features"}),": Many CSS-in-JS libraries offer automated vendor prefixing, support for server-side rendering, theming, among other functionalities."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Build Optimization"}),": Unused styles can be stripped away, reducing the final bundle size."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Prominent CSS-in-JS libraries include ",(0,i.jsx)(n.code,{children:"styled-components"}),", ",(0,i.jsx)(n.code,{children:"@emotion/core"}),", ",(0,i.jsx)(n.code,{children:"styled-jsx"}),", and ",(0,i.jsx)(n.code,{children:"jss"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"However, there are several downsides to CSS-in-JS:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Learning Curve"}),": The approach deviates from conventional CSS or SCSS, potentially necessitating some time for acclimatization."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Runtime Overhead"}),": Calculating and applying styles through JavaScript can introduce minor performance overheads."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Tooling Support"}),": Some development tools or editors might not be fully optimized for the CSS-in-JS syntax."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Ultimately, the decision to use CSS-in-JS or another styling methodology hinges on a project's requirements and the development team's preferences."}),"\n",(0,i.jsx)(n.h2,{id:"styled-components",children:"Styled Components"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://styled-components.com",children:"styled-components"})," stands as one of the most popular libraries within the CSS-in-JS methodology. Designed for component-based libraries or frameworks like React (and React Native), ",(0,i.jsx)(n.code,{children:"styled-components"})," facilitates styling directly within JavaScript files."]}),"\n",(0,i.jsxs)(n.p,{children:["Key features and advantages of ",(0,i.jsx)(n.code,{children:"styled-components"})," include:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Explicit Component Styling"}),": It allows for defining styles for each component right where the component code resides."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"const Button = styled.button`\n  background: palevioletred;\n  color: white;\n  border-radius: 3px;\n`;\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Dynamic Styling"}),": Styles can be dynamically altered through props."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'const Button = styled.button`\n  background: ${(props) => (props.primary ? "palevioletred" : "white")};\n  color: ${(props) => (props.primary ? "white" : "palevioletred")};\n`;\n'})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Theming Capabilities"}),": ",(0,i.jsx)(n.code,{children:"styled-components"})," supports easy theming via ",(0,i.jsx)(n.code,{children:"ThemeProvider"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'const theme = {\n  primaryColor: "palevioletred",\n  secondaryColor: "white",\n};\n\n<ThemeProvider theme={theme}>\n  <Button primary>Click Me</Button>\n</ThemeProvider>;\n'})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Support for Server-Side Rendering"}),": It caters to SEO and initial load performance by supporting server-side rendering."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Automatic Vendor Prefixing"}),": Vendor prefixes are automatically added to ensure cross-browser compatibility."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Global Styling"}),": ",(0,i.jsx)(n.code,{children:"createGlobalStyle"})," can be utilized to define global styles."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Beyond these, ",(0,i.jsx)(n.code,{children:"styled-components"})," provides numerous other conveniences and extensibilities. Its active community backing further underscores its position as a favored styling library among many projects and development teams."]}),"\n",(0,i.jsx)(r.Z,{unit:"DAN-xs0r56ZGEL2yMihi",className:"adfit-middle-mobile"}),"\n",(0,i.jsx)(n.h2,{id:"emotion-",children:"Emotion \ud83c\udfc6"}),"\n",(0,i.jsx)(n.p,{children:"Certainly! Here's the provided content translated into English:"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://emotion.sh/docs/introduction",children:"Emotion"})," is one of the CSS-in-JS libraries, similar to ",(0,i.jsx)(n.code,{children:"styled-components"}),", but offers its own unique features and benefits. It's popular as a convenient styling tool in web development."]}),"\n",(0,i.jsxs)(n.p,{children:["The main features and benefits of ",(0,i.jsx)(n.code,{children:"Emotion"})," include:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"High Performance"}),": Emotion emphasizes performance optimization. The difference in performance becomes more noticeable, especially in larger applications."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Flexibility in Writing Styles"}),": Emotion allows for multiple ways to write styles, including the ",(0,i.jsx)(n.code,{children:"styled"})," API for tagged styling and the ",(0,i.jsx)(n.code,{children:"css"})," prop for inline styling."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"// Example using the styled API\nconst Button = styled.Text`\n  color: hotpink;\n`;\n\n// Example using the css prop\n<Text\n  css={`\n    color: hotpink;\n  `}\n>\n  Hello\n</Text>;\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Theme Setting"}),": With the ",(0,i.jsx)(n.code,{children:"ThemeProvider"}),", you can set and use themes across the entire application."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Composition"}),": You can easily combine and reuse styles."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Server-Side Rendering Support"}),": For improved initial load performance and SEO, Emotion provides seamless server-side rendering support."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Developer Experience"}),": Features like source maps, labeling, and handy debugging tools are included to enhance the developer experience."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Babel Plugin"}),": Emotion provides a Babel plugin to offer optimized CSS code generation and useful labeling during development."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["While ",(0,i.jsx)(n.code,{children:"Emotion"})," and ",(0,i.jsx)(n.code,{children:"styled-components"})," provide similar functionalities, they differ in their internal implementation, optimization strategies, and API design. Therefore, it's essential to choose the right library based on the project's requirements, team preferences, and specific feature needs."]}),"\n",(0,i.jsxs)(n.p,{children:["In our community, after sticking with built-in styles, ",(0,i.jsx)(n.a,{href:"https://github.com/dooboolab-community/hackatalk/blob/3fe58877c074766b0c25ac9a66492548431be839/package.json#L62",children:"we've used styled-components for a long time"}),". However, since April 2021, due to better performance and type safety experiences, we've been using ",(0,i.jsx)(n.code,{children:"emotion"}),". - ",(0,i.jsx)(n.a,{href:"https://github.com/dooboolab-community/hackatalk/pull/374",children:"Related PR"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["Moreover, the popular React UI library, ",(0,i.jsx)(n.a,{href:"https://material-ui.com",children:"Material UI"}),", has been ",(0,i.jsx)(n.a,{href:"https://github.com/mui/material-ui/issues/22342",children:"using emotion since v5"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["Additionally, the Expo UI framework developed by our community, ",(0,i.jsx)(n.a,{href:"https://github.com/dooboolab-community/dooboo-ui",children:"dooboo-ui"}),", also utilizes ",(0,i.jsx)(n.code,{children:"emotion"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"installation",children:"Installation"}),"\n",(0,i.jsxs)(n.p,{children:["Understood! Using ",(0,i.jsx)(n.code,{children:"emotion"})," in React Native requires a slightly different approach."]}),"\n",(0,i.jsx)(n.p,{children:"First, you need to install the necessary packages:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm install @emotion/react @emotion/native\n"})}),"\n",(0,i.jsx)(n.h3,{id:"usage-examples",children:"Usage Examples"}),"\n",(0,i.jsx)(n.h4,{id:"1-styled-components",children:"1. Styled Components"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"import styled from '@emotion/native';\n\nconst StyledButton = styled.TouchableOpacity`\n  background-color: hotpink;\n  padding: 10px 20px;\n  border-radius: 8px;\n`;\n\nconst App = () => {\n  return (\n    <StyledButton onPress={() => alert('Clicked!')}>\n      <Text style={{ color: 'white' }}>Click me</Text>\n    </StyledButton>\n  );\n};\n\nexport default App;\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"2-css-prop-inline-style-example",children:["2. ",(0,i.jsx)(n.code,{children:"css"})," prop (inline style) example"]}),"\n",(0,i.jsxs)(n.p,{children:["First, you need to add the ",(0,i.jsx)(n.code,{children:"@emotion/babel-plugin"})," to your Babel setup to use the ",(0,i.jsx)(n.code,{children:"css"})," prop."]}),"\n",(0,i.jsxs)(n.p,{children:["Add the plugin to your Babel configuration (",(0,i.jsx)(n.code,{children:"babel.config.js"})," or ",(0,i.jsx)(n.code,{children:".babelrc"}),"):"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "plugins": ["@emotion"]\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Then, an example using the ",(0,i.jsx)(n.code,{children:"css"})," prop:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"import { css } from '@emotion/native';\n\nconst App = () => {\n  return (\n    <TouchableOpacity\n      onPress={() => alert('Clicked!')}\n      css={css`\n        background-color: hotpink;\n        padding: 10px 20px;\n        border-radius: 8px;\n      `}\n    >\n      <Text style={{ color: 'white' }}>Click me</Text>\n    </TouchableOpacity>\n  );\n};\n\nexport default App;\n"})}),"\n",(0,i.jsxs)(n.p,{children:["With ",(0,i.jsx)(n.code,{children:"@emotion/native"}),", you can utilize Emotion's styling methods in React Native."]}),"\n",(0,i.jsx)(r.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile"})]})}function h(e={}){const{wrapper:n}={...(0,s.ah)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},3905:function(e,n,t){t.d(n,{ah:function(){return c}});var i=t(7294);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,i,s=function(e,n){if(null==e)return{};var t,i,s={},r=Object.keys(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var a=i.createContext({}),c=function(e){var n=i.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},d={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},p=i.forwardRef((function(e,n){var t=e.components,s=e.mdxType,r=e.originalType,a=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),h=c(t),m=s,u=h["".concat(a,".").concat(m)]||h[m]||d[m]||r;return t?i.createElement(u,o(o({ref:n},p),{},{components:t})):i.createElement(u,o({ref:n},p))}));p.displayName="MDXCreateElement"},7859:function(e,n,t){t.d(n,{Z:function(){return r}});var i=t(7294),s=t(5893);function r(e){var n=e.className,t=void 0===n?"adfit":n,r=e.style,o=e.unit,l=e.height,a=e.width;return(0,i.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),n=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",n.async="true",n.type="text/javascript",n.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",a.toString()),e.setAttribute("data-ad-height",l.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+t).appendChild(e),document.querySelector("."+t).appendChild(n)}),100);return function(){clearTimeout(e)}}),[]),(0,s.jsx)("div",{style:r,children:(0,s.jsx)("div",{className:t})})}},9388:function(e,n,t){t.d(n,{Z:function(){return r}});t(7294);var i=t(7859),s=t(5893);function r(e){var n=e.unit,t=e.className,r=e.height,o=void 0===r?100:r,l=e.width,a=void 0===l?320:l,c=e.style;return(0,s.jsx)(i.Z,{unit:n,height:o,width:a,className:t,style:Object.assign({flex:1,marginTop:24,marginBottom:24},c)})}}}]);