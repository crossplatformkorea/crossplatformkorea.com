!function(){"use strict";var e,f,a,c,b,d={},t={};function r(e){var f=t[e];if(void 0!==f)return f.exports;var a=t[e]={id:e,loaded:!1,exports:{}};return d[e].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}r.m=d,r.c=t,e=[],r.O=function(f,a,c,b){if(!a){var d=1/0;for(u=0;u<e.length;u++){a=e[u][0],c=e[u][1],b=e[u][2];for(var t=!0,n=0;n<a.length;n++)(!1&b||d>=b)&&Object.keys(r.O).every((function(e){return r.O[e](a[n])}))?a.splice(n--,1):(t=!1,b<d&&(d=b));if(t){e.splice(u--,1);var o=c();void 0!==o&&(f=o)}}return f}b=b||0;for(var u=e.length;u>0&&e[u-1][2]>b;u--)e[u]=e[u-1];e[u]=[a,c,b]},r.n=function(e){var f=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(f,{a:f}),f},a=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},r.t=function(e,c){if(1&c&&(e=this(e)),8&c)return e;if("object"==typeof e&&e){if(4&c&&e.__esModule)return e;if(16&c&&"function"==typeof e.then)return e}var b=Object.create(null);r.r(b);var d={};f=f||[null,a({}),a([]),a(a)];for(var t=2&c&&e;"object"==typeof t&&!~f.indexOf(t);t=a(t))Object.getOwnPropertyNames(t).forEach((function(f){d[f]=function(){return e[f]}}));return d.default=function(){return e},r.d(b,d),b},r.d=function(e,f){for(var a in f)r.o(f,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:f[a]})},r.f={},r.e=function(e){return Promise.all(Object.keys(r.f).reduce((function(f,a){return r.f[a](e,f),f}),[]))},r.u=function(e){return"assets/js/"+({16:"772ff195",53:"935f2afb",95:"e9c6db5b",185:"fc5bea0d",240:"8fc4fb5d",286:"64d7fb55",291:"ab1f6517",446:"9c0f5533",469:"1dcc9eae",520:"ced71a92",853:"21eec892",893:"eb3d6944",1028:"6624c415",1087:"0fafd334",1202:"77aefdeb",1563:"e2e4b395",1714:"87e9720e",1772:"7837411c",1838:"8bd177fb",2105:"473e17f4",2202:"306902d2",2253:"9bdd22eb",2460:"8e51f6db",2506:"01bbb476",2535:"814f3328",2578:"4fa150ba",2595:"2749ab7f",2659:"42a9cadc",2729:"6a0acca1",2929:"0c604655",3089:"a6aa9e1f",3237:"1df93b7f",3273:"4f4261b9",3351:"fbe8f93e",3539:"01f7b5dc",3608:"9e4087bc",3682:"0c6dd2b2",3836:"f6cbeee1",4013:"01a85c17",4019:"8b44f308",4128:"a09c2993",4204:"62da6f64",4286:"aaea83d9",4364:"fba6c282",4390:"260e3209",4452:"f6464a85",4584:"29b22a39",4939:"307634b3",4946:"610971b7",5042:"a4c66281",5238:"b54953d8",5290:"5afd0f0f",5502:"a7f2198b",5595:"f0ae180c",5766:"ebffcbea",5805:"91cf1ae7",6008:"b6431abd",6103:"ccc49370",6237:"b1aea0ec",6408:"a24ac475",6424:"bdf8e2fd",6436:"c288b54d",6566:"868193b5",6649:"7be3b45c",6920:"d87440d1",7025:"79fc5d5f",7087:"e7b91a66",7111:"50802a01",7382:"10b839ea",7480:"84dffdec",7615:"b7122944",7804:"259e8b88",7818:"b06f29a9",7896:"986f5ec4",7918:"17896441",7961:"6c3e996d",7978:"20ba1d7e",8166:"c423656e",8244:"f0cec97f",8253:"0c21e038",8529:"aa13d249",8610:"6875c492",8988:"bb41fd0d",9099:"15d80467",9109:"b9a755e2",9180:"a056ecf3",9235:"f748f046",9328:"de9abe9b",9478:"bbb4c8dc",9514:"1be78505",9563:"1a802fe7",9676:"080ad265",9791:"f6856616",9817:"14eb3368",9871:"067cdaea",9880:"5ef0e9d6",9965:"e71ee2a0"}[e]||e)+"."+{16:"3217f5a0",53:"cc753648",95:"14826c2b",185:"2952d0b5",240:"064722be",286:"3cbe9091",291:"6450b789",446:"5cce8dd3",469:"ca5c611d",520:"7ffc3ba1",853:"a03d9a26",893:"ce6abc22",1028:"766c8330",1087:"0c6ae0a0",1202:"f1f057af",1563:"3e3cdfce",1714:"3518c3a9",1772:"eeb79cc3",1838:"638857f7",2105:"24c359b3",2202:"f7ef1e15",2253:"8871f239",2460:"ad2709bd",2506:"6d2b6eef",2535:"f6b9c234",2578:"ca778de9",2595:"5dc63cd6",2659:"0232d166",2729:"66204b7d",2929:"f969dd8b",3089:"04c383d3",3237:"fd47cae6",3273:"3a0690ed",3351:"d90fec8d",3539:"149f6cc1",3608:"effa806b",3682:"8851fd6f",3836:"7b522083",4013:"6b458eab",4019:"9d92b9e9",4128:"519106c1",4204:"e2a863d2",4286:"56312a37",4364:"f6b61b7d",4390:"f6ab4cd1",4452:"6672deeb",4584:"f70d91a8",4939:"b6042a72",4946:"66dcb634",4972:"a0c9bf13",5042:"e017a8e9",5238:"56cfcba4",5290:"2383566e",5502:"4908b678",5595:"088f92f9",5766:"6449b71f",5805:"794d36b2",6008:"904d52e9",6048:"fcf6c146",6103:"6558e14e",6237:"c66f91e8",6408:"96522171",6424:"1f37b909",6436:"0b74d3e8",6566:"7a02cbce",6649:"d2fe5a75",6920:"c6f39ffa",7025:"95775fff",7087:"d4a60609",7111:"0b39b5a8",7382:"5db816fb",7480:"a413a233",7615:"5fc49627",7804:"6af7f61e",7818:"433191f0",7896:"9139c81c",7918:"c9122687",7961:"b913240e",7978:"e64ef1ab",8166:"cd5616ce",8244:"9cb243a7",8253:"48b6ba5a",8529:"e640d3df",8610:"48ed5f5f",8988:"9ae96df8",9099:"2262c73e",9109:"b4598058",9180:"ebc8ea73",9235:"5301d53b",9328:"a64dd951",9478:"dba3aa3f",9514:"62998506",9563:"0c836bdb",9676:"20f2bf4c",9785:"f1cba36b",9791:"5ea0ec15",9817:"e071d66f",9871:"b478bfec",9880:"cc49fca7",9965:"c96c74dd"}[e]+".js"},r.miniCssF=function(e){},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=function(e,f){return Object.prototype.hasOwnProperty.call(e,f)},c={},b="crossplatformkorea.com:",r.l=function(e,f,a,d){if(c[e])c[e].push(f);else{var t,n;if(void 0!==a)for(var o=document.getElementsByTagName("script"),u=0;u<o.length;u++){var i=o[u];if(i.getAttribute("src")==e||i.getAttribute("data-webpack")==b+a){t=i;break}}t||(n=!0,(t=document.createElement("script")).charset="utf-8",t.timeout=120,r.nc&&t.setAttribute("nonce",r.nc),t.setAttribute("data-webpack",b+a),t.src=e),c[e]=[f];var l=function(f,a){t.onerror=t.onload=null,clearTimeout(s);var b=c[e];if(delete c[e],t.parentNode&&t.parentNode.removeChild(t),b&&b.forEach((function(e){return e(a)})),f)return f(a)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:t}),12e4);t.onerror=l.bind(null,t.onerror),t.onload=l.bind(null,t.onload),n&&document.head.appendChild(t)}},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="/en/",r.gca=function(e){return e={17896441:"7918","772ff195":"16","935f2afb":"53",e9c6db5b:"95",fc5bea0d:"185","8fc4fb5d":"240","64d7fb55":"286",ab1f6517:"291","9c0f5533":"446","1dcc9eae":"469",ced71a92:"520","21eec892":"853",eb3d6944:"893","6624c415":"1028","0fafd334":"1087","77aefdeb":"1202",e2e4b395:"1563","87e9720e":"1714","7837411c":"1772","8bd177fb":"1838","473e17f4":"2105","306902d2":"2202","9bdd22eb":"2253","8e51f6db":"2460","01bbb476":"2506","814f3328":"2535","4fa150ba":"2578","2749ab7f":"2595","42a9cadc":"2659","6a0acca1":"2729","0c604655":"2929",a6aa9e1f:"3089","1df93b7f":"3237","4f4261b9":"3273",fbe8f93e:"3351","01f7b5dc":"3539","9e4087bc":"3608","0c6dd2b2":"3682",f6cbeee1:"3836","01a85c17":"4013","8b44f308":"4019",a09c2993:"4128","62da6f64":"4204",aaea83d9:"4286",fba6c282:"4364","260e3209":"4390",f6464a85:"4452","29b22a39":"4584","307634b3":"4939","610971b7":"4946",a4c66281:"5042",b54953d8:"5238","5afd0f0f":"5290",a7f2198b:"5502",f0ae180c:"5595",ebffcbea:"5766","91cf1ae7":"5805",b6431abd:"6008",ccc49370:"6103",b1aea0ec:"6237",a24ac475:"6408",bdf8e2fd:"6424",c288b54d:"6436","868193b5":"6566","7be3b45c":"6649",d87440d1:"6920","79fc5d5f":"7025",e7b91a66:"7087","50802a01":"7111","10b839ea":"7382","84dffdec":"7480",b7122944:"7615","259e8b88":"7804",b06f29a9:"7818","986f5ec4":"7896","6c3e996d":"7961","20ba1d7e":"7978",c423656e:"8166",f0cec97f:"8244","0c21e038":"8253",aa13d249:"8529","6875c492":"8610",bb41fd0d:"8988","15d80467":"9099",b9a755e2:"9109",a056ecf3:"9180",f748f046:"9235",de9abe9b:"9328",bbb4c8dc:"9478","1be78505":"9514","1a802fe7":"9563","080ad265":"9676",f6856616:"9791","14eb3368":"9817","067cdaea":"9871","5ef0e9d6":"9880",e71ee2a0:"9965"}[e]||e,r.p+r.u(e)},function(){var e={1303:0,532:0};r.f.j=function(f,a){var c=r.o(e,f)?e[f]:void 0;if(0!==c)if(c)a.push(c[2]);else if(/^(1303|532)$/.test(f))e[f]=0;else{var b=new Promise((function(a,b){c=e[f]=[a,b]}));a.push(c[2]=b);var d=r.p+r.u(f),t=new Error;r.l(d,(function(a){if(r.o(e,f)&&(0!==(c=e[f])&&(e[f]=void 0),c)){var b=a&&("load"===a.type?"missing":a.type),d=a&&a.target&&a.target.src;t.message="Loading chunk "+f+" failed.\n("+b+": "+d+")",t.name="ChunkLoadError",t.type=b,t.request=d,c[1](t)}}),"chunk-"+f,f)}},r.O.j=function(f){return 0===e[f]};var f=function(f,a){var c,b,d=a[0],t=a[1],n=a[2],o=0;if(d.some((function(f){return 0!==e[f]}))){for(c in t)r.o(t,c)&&(r.m[c]=t[c]);if(n)var u=n(r)}for(f&&f(a);o<d.length;o++)b=d[o],r.o(e,b)&&e[b]&&e[b][0](),e[b]=0;return r.O(u)},a=self.webpackChunkcrossplatformkorea_com=self.webpackChunkcrossplatformkorea_com||[];a.forEach(f.bind(null,0)),a.push=f.bind(null,a.push.bind(a))}()}();