"use strict";(self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[]).push([[5496],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),p=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(u,".").concat(d)]||m[d]||s[d]||o;return n?r.createElement(f,i(i({ref:t},l),{},{components:n})):r.createElement(f,i({ref:t},l))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7859:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294);function a(e){var t=e.className,n=void 0===t?"adfit":t,a=e.style,o=e.unit,i=e.height,c=e.width;return(0,r.useEffect)((function(){var e=setTimeout((function(){var e=document.createElement("ins"),t=document.createElement("script");e.className="kakao_ad_area",e.style="display:none; width:100%;",t.async="true",t.type="text/javascript",t.src="//t1.daumcdn.net/kas/static/ba.min.js",e.setAttribute("data-ad-width",c.toString()),e.setAttribute("data-ad-height",i.toString()),e.setAttribute("data-ad-unit",o.toString()),document.querySelector("."+n).appendChild(e),document.querySelector("."+n).appendChild(t)}),100);return function(){clearTimeout(e)}}),[]),r.createElement("div",{style:a},r.createElement("div",{className:n}))}},9388:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294),a=n(7859);function o(e){var t=e.unit,n=e.className;return r.createElement(a.Z,{unit:t,height:100,width:320,className:n,style:{flex:1,marginTop:24,marginBottom:24}})}},2028:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return u},metadata:function(){return l},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=n(9388),c=["components"],u={id:"routers",title:"\ub77c\uc6b0\ud130",sidebar_label:"\ub77c\uc6b0\ud130"},p=void 0,l={unversionedId:"react-native/routers",id:"react-native/routers",title:"\ub77c\uc6b0\ud130",description:"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c\uc5d0\ub294 react-navigation, react-native-navigation \ub4f1 \uac01\uc885 \ub77c\uc6b0\ud130\ub4e4\uc774 \uc788\uc9c0\ub9cc \uc800\ud76c \ucee4\ubba4\ub2c8\ud2f0\uc5d0\uc11c\ub294 expo-router\ub97c \ucd94\ucc9c\ud569\ub2c8\ub2e4.",source:"@site/i18n/ko/docusaurus-plugin-content-docs/current/react-native/4-1-routers.mdx",sourceDirName:"react-native",slug:"/react-native/routers",permalink:"/docs/current/react-native/routers",draft:!1,editUrl:"https://github.com/crossplatformkorea/crossplatformkorea.com/tree/main/ko",tags:[],version:"current",frontMatter:{id:"routers",title:"\ub77c\uc6b0\ud130",sidebar_label:"\ub77c\uc6b0\ud130"},sidebar:"react-native",previous:{title:"\ucef4\ud3ec\ub10c\ud2b8",permalink:"/docs/current/react-native/components"}},s={},m=[{value:"Expo Router",id:"expo-router",level:2}],d={toc:m};function f(e){var t=e.components,n=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\ub9ac\uc561\ud2b8\ub124\uc774\ud2f0\ube0c\uc5d0\ub294 ",(0,o.kt)("a",{parentName:"p",href:"https://reactnavigation.org"},"react-navigation"),", ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/wix/react-native-navigation"},"react-native-navigation")," \ub4f1 \uac01\uc885 \ub77c\uc6b0\ud130\ub4e4\uc774 \uc788\uc9c0\ub9cc \uc800\ud76c \ucee4\ubba4\ub2c8\ud2f0\uc5d0\uc11c\ub294 ",(0,o.kt)("a",{parentName:"p",href:"https://docs.expo.dev/routing/introduction"},"expo-router"),"\ub97c \ucd94\ucc9c\ud569\ub2c8\ub2e4.\n\uc774\ub294 \ub2e8\uc21c\ud788 \ucd5c\uc2e0\uc5d0 \ub098\uc628 \ub77c\uc6b0\ud130\ub77c\uc11c \uadf8\ub7f0 \uac83\uc740 \uc544\ub2c8\uace0 \ud30c\uc77c \uae30\ubc18 \ub77c\uc6b0\ud130\ub77c\uc11c \ubd88\ud544\uc694\ud55c \ucf54\ub4dc\ub97c \uc81c\uac70\ud574\uc904 \ubfd0\ub9cc\uc544\ub2c8\ub77c \ucf54\ub4dc \uc790\uccb4\ub3c4 \uac04\uacb0\ud574\uc9c0\uace0 \uc9c1\uad00\uc801\uc774\uae30 \ub54c\ubb38\uc785\ub2c8\ub2e4."),(0,o.kt)(i.Z,{unit:"DAN-YpcHf9p49U5ykXi8",className:"adfit-top-mobile",mdxType:"AdFitMobileBanner"}),(0,o.kt)("h2",{id:"expo-router"},"Expo Router"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Expo Router"),"\uc740 ",(0,o.kt)("strong",{parentName:"p"},"Expo"),"\ub85c \ub9cc\ub4e4\uc5b4\uc9c4 ",(0,o.kt)("strong",{parentName:"p"},"Universal React Native")," \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc744 \uc704\ud55c \ud30c\uc77c \uae30\ubc18 \ub77c\uc6b0\ud130\uc785\ub2c8\ub2e4.\n\uc774 \ub77c\uc6b0\ud130\ub294 ",(0,o.kt)("strong",{parentName:"p"},"React Native")," \ubc0f \uc6f9 \uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0\uc11c \ud654\uba74 \uac04 \uc774\ub3d9\uc744 \uad00\ub9ac\ud560 \uc218 \uc788\uac8c \ud574\uc8fc\uba70, \uc0ac\uc6a9\uc790\uac00 \uc571\uc758 UI\uc758 \ub2e4\ub978 \ubd80\ubd84\uc73c\ub85c \uc6d0\ud65c\ud558\uac8c \uc774\ub3d9\ud560 \uc218 \uc788\ub3c4\ub85d \ud569\ub2c8\ub2e4.\n\uc774\ub97c \ud1b5\ud574 \uc5ec\ub7ec \ud50c\ub7ab\ud3fc(Android, iOS \ubc0f \uc6f9)\uc5d0\uc11c \ub3d9\uc77c\ud55c \uad6c\uc131 \uc694\uc18c\ub97c \uc0ac\uc6a9\ud558\uc5ec \uc571\uc758 \ud654\uba74 \uac04 \uc774\ub3d9\uc744 \uad00\ub9ac\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,o.kt)("p",null,"Expo Router\ub97c \uc0ac\uc6a9\ud558\ub294 \ubc29\ubc95\uc5d0 \ub300\ud55c \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 ",(0,o.kt)("a",{parentName:"p",href:"https://docs.expo.dev/routing/introduction"},"\uc5ec\uae30"),"\uc5d0\uc11c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.\n\uc774 \ubb38\uc11c\uc5d0\uc11c\ub294 Expo Router\ub97c \uc0ac\uc6a9\ud558\uc5ec \ud654\uba74 \uac04 \uc774\ub3d9\uc744 \uad00\ub9ac\ud558\ub294 \ubc29\ubc95\uc5d0 \ub300\ud574 \uc124\uba85\ud569\ub2c8\ub2e4.\n\uc608\ub97c \ub4e4\uc5b4, \ub2e4\uc74c \ucf54\ub4dc\ub294 ",(0,o.kt)("inlineCode",{parentName:"p"},"HomeScreen"),"\uacfc ",(0,o.kt)("inlineCode",{parentName:"p"},"ProfileScreen")," \uc0ac\uc774\ub97c \uc774\ub3d9\ud558\ub294 \ubc29\ubc95\uc744 \ubcf4\uc5ec\uc90d\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { useNavigation } from '@react-navigation/native';\nimport { Button } from 'react-native';\n\nfunction HomeScreen() {\n  const navigation = useNavigation();\n\n  return (\n    <Button\n      title=\"Go to Profile\"\n      onPress={() => {\n        navigation.navigate('Profile', { name: 'Jane' });\n      }}\n    />\n  );\n}\n\nfunction ProfileScreen({ route }) {\n  return <Text>This is {route.params.name}'s profile</Text>;\n}\n")),(0,o.kt)("p",null,"\uc704 \ucf54\ub4dc\uc5d0\uc11c ",(0,o.kt)("inlineCode",{parentName:"p"},"useNavigation")," \ud6c5\uc744 \uc0ac\uc6a9\ud558\uc5ec ",(0,o.kt)("inlineCode",{parentName:"p"},"navigation")," \uac1d\uccb4\ub97c \uac00\uc838\uc628 \ub2e4\uc74c, ",(0,o.kt)("inlineCode",{parentName:"p"},"Button")," \ucef4\ud3ec\ub10c\ud2b8\ub97c \ub80c\ub354\ub9c1\ud569\ub2c8\ub2e4.\n",(0,o.kt)("inlineCode",{parentName:"p"},"onPress")," \ud578\ub4e4\ub7ec\uc5d0\uc11c ",(0,o.kt)("inlineCode",{parentName:"p"},"navigation.navigate")," \uba54\uc11c\ub4dc\ub97c \ud638\ucd9c\ud558\uc5ec ",(0,o.kt)("inlineCode",{parentName:"p"},"ProfileScreen"),"\uc73c\ub85c \uc774\ub3d9\ud569\ub2c8\ub2e4.\n\uc774 \ub54c, ",(0,o.kt)("inlineCode",{parentName:"p"},"name")," \ub9e4\uac1c\ubcc0\uc218\ub97c \uc804\ub2ec\ud569\ub2c8\ub2e4. ",(0,o.kt)("inlineCode",{parentName:"p"},"ProfileScreen"),"\uc5d0\uc11c\ub294 ",(0,o.kt)("inlineCode",{parentName:"p"},"route.params.name"),"\uc744 \uc0ac\uc6a9\ud558\uc5ec ",(0,o.kt)("inlineCode",{parentName:"p"},"name")," \ub9e4\uac1c\ubcc0\uc218\ub97c \uac00\uc838\uc635\ub2c8\ub2e4."),(0,o.kt)(i.Z,{unit:"DAN-weLLBNA8C31gpo1t",className:"adfit-bottom-mobile",mdxType:"AdFitMobileBanner"}))}f.isMDXComponent=!0}}]);