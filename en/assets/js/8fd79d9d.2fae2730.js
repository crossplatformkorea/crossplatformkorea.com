"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[8482],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return y}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},m=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),c=p(n),u=i,y=c["".concat(s,".").concat(u)]||c[u]||d[u]||o;return n?a.createElement(y,r(r({ref:t},m),{},{components:n})):a.createElement(y,r({ref:t},m))}));function y(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:i,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(7294);function i(e){var t=e.className,n=void 0===t?"adfit":t,i=e.style,o=e.unit,r=e.height,l=e.width;return(0,a.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",l.toString()),e.setAttribute("data-ad-height",r.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),a.createElement("div",{style:i},a.createElement("div",{className:n}))}},9388:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294),i=n(7859);function o(e){var t=e.unit,n=e.className,o=e.height,r=void 0===o?100:o,l=e.width,s=void 0===l?320:l,p=e.style;return a.createElement(i.Z,{unit:t,height:r,width:s,className:n,style:Object.assign({flex:1,marginTop:24,marginBottom:24},p)})}},1103:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return p},default:function(){return k},frontMatter:function(){return s},metadata:function(){return m},toc:function(){return d}});var a=n(7462),i=n(3366),o=(n(7294),n(3905)),r=n(9388),l=["components"],s={id:"styled-component",title:"\uc2a4\ud0c0\uc77c \ucef4\ud3ec\ub10c\ud2b8",sidebar_label:"\uc2a4\ud0c0\uc77c \ucef4\ud3ec\ub10c\ud2b8"},p=void 0,m={unversionedId:"react-native/style/styled-component",id:"react-native/style/styled-component",title:"\uc2a4\ud0c0\uc77c \ucef4\ud3ec\ub10c\ud2b8",description:"React Native inherently comes with an API named StyleSheet for styling.",source:"@site/docs/react-native/style/styled-component.mdx",sourceDirName:"react-native/style",slug:"/react-native/style/styled-component",permalink:"/en/docs/current/react-native/style/styled-component",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/docs/react-native/style/styled-component.mdx",tags:[],version:"current",frontMatter:{id:"styled-component",title:"\uc2a4\ud0c0\uc77c \ucef4\ud3ec\ub10c\ud2b8",sidebar_label:"\uc2a4\ud0c0\uc77c \ucef4\ud3ec\ub10c\ud2b8"},sidebar:"react-native",previous:{title:"Built-in Styling",permalink:"/en/docs/current/react-native/style/built-in"},next:{title:"Component",permalink:"/en/docs/current/category/component"}},c={},d=[{value:"CSS-in-JS",id:"css-in-js",level:2},{value:"Styled Components",id:"styled-components",level:2},{value:"Emotion \ud83c\udfc6",id:"emotion-",level:2},{value:"Installation",id:"installation",level:3},{value:"Usage Examples",id:"usage-examples",level:3},{value:"1. Styled Components",id:"1-styled-components",level:4},{value:"2. <code>css</code> prop (inline style) example",id:"2-css-prop-inline-style-example",level:4}],u={toc:d},y="wrapper";function k(e){var t=e.components,n=(0,i.Z)(e,l);return(0,o.kt)(y,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"React Native inherently comes with an API named ",(0,o.kt)("a",{parentName:"p",href:"./built-in"},"StyleSheet")," for styling.\nHowever, many developers prefer the CSS-in-JS style of styling. For this, they utilize external libraries like styled-components or @emotion/native, allowing them to write style code in React Native in the same manner as the styled-components method found in web development."),(0,o.kt)("p",null,"In other words, when developing a React Native app, besides the default styling method provided, there are several external libraries available that assist in importing the web styling experience directly."),(0,o.kt)(r.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile",mdxType:"AdFitMobileBanner"}),(0,o.kt)("h2",{id:"css-in-js"},"CSS-in-JS"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://cssinjs.org/?v=v10.10.0"},"CSS-in-JS")," is a paradigm in web development, offering a methodology for writing CSS styles directly within JavaScript code. The main advantages and features of CSS-in-JS include:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Component-based"),": CSS-in-JS meshes well with component-based frameworks like React. Styles for each component are encapsulated within its respective file, enhancing component independence and reusability.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Dynamic Styling"),": It leverages JavaScript variables and functions to dynamically generate styles. This is particularly useful when wanting to alter styles based on user interactions or state changes.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Scoping Solutions"),": Traditional CSS can experience style clashes due to its global scoping issues. CSS-in-JS resolves this, reducing the risk of style conflicts.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Convenient Features"),": Many CSS-in-JS libraries offer automated vendor prefixing, support for server-side rendering, theming, among other functionalities.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Build Optimization"),": Unused styles can be stripped away, reducing the final bundle size."))),(0,o.kt)("p",null,"Prominent CSS-in-JS libraries include ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"@emotion/core"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-jsx"),", and ",(0,o.kt)("inlineCode",{parentName:"p"},"jss"),"."),(0,o.kt)("p",null,"However, there are several downsides to CSS-in-JS:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"Learning Curve"),": The approach deviates from conventional CSS or SCSS, potentially necessitating some time for acclimatization."),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"Runtime Overhead"),": Calculating and applying styles through JavaScript can introduce minor performance overheads."),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"Tooling Support"),": Some development tools or editors might not be fully optimized for the CSS-in-JS syntax.")),(0,o.kt)("p",null,"Ultimately, the decision to use CSS-in-JS or another styling methodology hinges on a project's requirements and the development team's preferences."),(0,o.kt)("h2",{id:"styled-components"},"Styled Components"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://styled-components.com"},"styled-components")," stands as one of the most popular libraries within the CSS-in-JS methodology. Designed for component-based libraries or frameworks like React (and React Native), ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," facilitates styling directly within JavaScript files."),(0,o.kt)("p",null,"Key features and advantages of ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," include:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Explicit Component Styling"),": It allows for defining styles for each component right where the component code resides."),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const Button = styled.button`\n  background: palevioletred;\n  color: white;\n  border-radius: 3px;\n`;\n"))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Dynamic Styling"),": Styles can be dynamically altered through props."),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'const Button = styled.button`\n  background: ${(props) => (props.primary ? "palevioletred" : "white")};\n  color: ${(props) => (props.primary ? "white" : "palevioletred")};\n`;\n'))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Theming Capabilities"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," supports easy theming via ",(0,o.kt)("inlineCode",{parentName:"p"},"ThemeProvider"),"."),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'const theme = {\n  primaryColor: "palevioletred",\n  secondaryColor: "white",\n};\n\n<ThemeProvider theme={theme}>\n  <Button primary>Click Me</Button>\n</ThemeProvider>;\n'))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Support for Server-Side Rendering"),": It caters to SEO and initial load performance by supporting server-side rendering.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Automatic Vendor Prefixing"),": Vendor prefixes are automatically added to ensure cross-browser compatibility.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Global Styling"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"createGlobalStyle")," can be utilized to define global styles."))),(0,o.kt)("p",null,"Beyond these, ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," provides numerous other conveniences and extensibilities. Its active community backing further underscores its position as a favored styling library among many projects and development teams."),(0,o.kt)(r.Z,{unit:"DAN-xs0r56ZGEL2yMihi",className:"adfit-middle-mobile",mdxType:"AdFitMobileBanner"}),(0,o.kt)("h2",{id:"emotion-"},"Emotion \ud83c\udfc6"),(0,o.kt)("p",null,"Certainly! Here's the provided content translated into English:"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://emotion.sh/docs/introduction"},"Emotion")," is one of the CSS-in-JS libraries, similar to ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components"),", but offers its own unique features and benefits. It's popular as a convenient styling tool in web development."),(0,o.kt)("p",null,"The main features and benefits of ",(0,o.kt)("inlineCode",{parentName:"p"},"Emotion")," include:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"High Performance"),": Emotion emphasizes performance optimization. The difference in performance becomes more noticeable, especially in larger applications.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Flexibility in Writing Styles"),": Emotion allows for multiple ways to write styles, including the ",(0,o.kt)("inlineCode",{parentName:"p"},"styled")," API for tagged styling and the ",(0,o.kt)("inlineCode",{parentName:"p"},"css")," prop for inline styling."),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"// Example using the styled API\nconst Button = styled.Text`\n  color: hotpink;\n`;\n\n// Example using the css prop\n<Text\n  css={`\n    color: hotpink;\n  `}\n>\n  Hello\n</Text>;\n"))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Theme Setting"),": With the ",(0,o.kt)("inlineCode",{parentName:"p"},"ThemeProvider"),", you can set and use themes across the entire application.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Composition"),": You can easily combine and reuse styles.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Server-Side Rendering Support"),": For improved initial load performance and SEO, Emotion provides seamless server-side rendering support.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Developer Experience"),": Features like source maps, labeling, and handy debugging tools are included to enhance the developer experience.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Babel Plugin"),": Emotion provides a Babel plugin to offer optimized CSS code generation and useful labeling during development."))),(0,o.kt)("p",null,"While ",(0,o.kt)("inlineCode",{parentName:"p"},"Emotion")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"styled-components")," provide similar functionalities, they differ in their internal implementation, optimization strategies, and API design. Therefore, it's essential to choose the right library based on the project's requirements, team preferences, and specific feature needs."),(0,o.kt)("p",null,"In our community, after sticking with built-in styles, ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/dooboolab-community/hackatalk/blob/3fe58877c074766b0c25ac9a66492548431be839/package.json#L62"},"we've used styled-components for a long time"),". However, since April 2021, due to better performance and type safety experiences, we've been using ",(0,o.kt)("inlineCode",{parentName:"p"},"emotion"),". - ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/dooboolab-community/hackatalk/pull/374"},"Related PR"),"."),(0,o.kt)("p",null,"Moreover, the popular React UI library, ",(0,o.kt)("a",{parentName:"p",href:"https://material-ui.com"},"Material UI"),", has been ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/mui/material-ui/issues/22342"},"using emotion since v5"),"."),(0,o.kt)("p",null,"Additionally, the Expo UI framework developed by our community, ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/dooboolab-community/dooboo-ui"},"dooboo-ui"),", also utilizes ",(0,o.kt)("inlineCode",{parentName:"p"},"emotion"),"."),(0,o.kt)("h3",{id:"installation"},"Installation"),(0,o.kt)("p",null,"Understood! Using ",(0,o.kt)("inlineCode",{parentName:"p"},"emotion")," in React Native requires a slightly different approach."),(0,o.kt)("p",null,"First, you need to install the necessary packages:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @emotion/react @emotion/native\n")),(0,o.kt)("h3",{id:"usage-examples"},"Usage Examples"),(0,o.kt)("h4",{id:"1-styled-components"},"1. Styled Components"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import styled from '@emotion/native';\n\nconst StyledButton = styled.TouchableOpacity`\n  background-color: hotpink;\n  padding: 10px 20px;\n  border-radius: 8px;\n`;\n\nconst App = () => {\n  return (\n    <StyledButton onPress={() => alert('Clicked!')}>\n      <Text style={{ color: 'white' }}>Click me</Text>\n    </StyledButton>\n  );\n};\n\nexport default App;\n")),(0,o.kt)("h4",{id:"2-css-prop-inline-style-example"},"2. ",(0,o.kt)("inlineCode",{parentName:"h4"},"css")," prop (inline style) example"),(0,o.kt)("p",null,"First, you need to add the ",(0,o.kt)("inlineCode",{parentName:"p"},"@emotion/babel-plugin")," to your Babel setup to use the ",(0,o.kt)("inlineCode",{parentName:"p"},"css")," prop."),(0,o.kt)("p",null,"Add the plugin to your Babel configuration (",(0,o.kt)("inlineCode",{parentName:"p"},"babel.config.js")," or ",(0,o.kt)("inlineCode",{parentName:"p"},".babelrc"),"):"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "plugins": ["@emotion"]\n}\n')),(0,o.kt)("p",null,"Then, an example using the ",(0,o.kt)("inlineCode",{parentName:"p"},"css")," prop:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import { css } from '@emotion/native';\n\nconst App = () => {\n  return (\n    <TouchableOpacity\n      onPress={() => alert('Clicked!')}\n      css={css`\n        background-color: hotpink;\n        padding: 10px 20px;\n        border-radius: 8px;\n      `}\n    >\n      <Text style={{ color: 'white' }}>Click me</Text>\n    </TouchableOpacity>\n  );\n};\n\nexport default App;\n")),(0,o.kt)("p",null,"With ",(0,o.kt)("inlineCode",{parentName:"p"},"@emotion/native"),", you can utilize Emotion's styling methods in React Native."),(0,o.kt)(r.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile",mdxType:"AdFitMobileBanner"}))}k.isMDXComponent=!0}}]);