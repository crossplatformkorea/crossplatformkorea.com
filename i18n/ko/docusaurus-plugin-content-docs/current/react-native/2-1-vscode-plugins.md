---
id: vscode-plugins
title: VSCode 플러그인
sidebar_label: VSCode 플러그인
---

이번 섹션에서는 [Visual Studio Code](https://code.visualstudio.com)에서 개발을 하기 위해 필수로 필요한 플러그인에 대해 알아봅니다.

만약 프로젝트를 [dooboo-cli](https://github.com/dooboolab-community/dooboo-cli)로 시작했다면 프로젝트 경로에서 `vscode`를 열 때 오른쪽 하단에 추천 플러그인을 설치할 거냐고 물어봅니다. 여기서 만약 설치를 하면 아래 8가지 플러그인들이 자동으로 설치되니 참고해주세요.

쉬운 플러그인 순으로 보겠습니다.

## 1. Auto Rename Tag

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=38" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)는 [html](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Getting_started)이나 [리액트](https://react.dev) 같은 태그 문법에서 굉장히 유용한 플러그인입니다. 보통 태그를 열고 닫을 때 같은 이름을 두번씩 써줘야 하는데 해당 플러그인을 그 공수를 줄여줍니다. 이는 특히 수정을 할 때 굉장히 유용합니다.

예시로 아래와 같은 상황을 보겠습니다.

```tsx
<View>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
  <Text>HELLO</Text>
</View>
```

`View` 태그 이름을 `ScrollView`로 변경하려면 일반적으로 시작 태그와 종료 태그 모두를 수정해야 합니다. 그러나 `Auto Rename Tag` 플러그인을 사용하면 시작 태그만 수정해도 종료 태그가 자동으로 변경됩니다.

> 단, `autocomplete` 기능을 사용해 태그를 자동완성할 경우, 종료 태그가 자동으로 수정되지 않을 수 있습니다. 자세한 내용은 위의 영상을 참고하세요.

## 2. Better Comments

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=38" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)는 개발자가 코드에 주석을 더욱 명확하고 읽기 쉽게 표현할 수 있도록 도와줍니다. 이 플러그인은 개발자들이 코드 내 주석을 더욱 명확하고 읽기 쉽게 만들 수 있도록 도와줍니다. 주석을 다양한 색상으로 구분하게 해서 각 주석의 목적과 중요성을 한 눈에 파악할 수 있게 해줍니다.

## 3. vscode-icons

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=108" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)는 코드 내용을 빠르게 스캔하거나 프로젝트 구조를 파악할 때 매우 유용하게 사용됩니다.

<img src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/images/screenshot.gif" />

## 4. Code Spell Checker

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=133" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)는 영어가 모국어가 아닌 사람이거나 영타가 미숙한 사람들에게 꼭 추천드리는 플러그인입니다. 이 툴의 주요 장점은 코드의 전문성을 유지하고 실수로 인한 버그나 오해를 예방하는 데 큰 도움을 제공한다는 것입니다. 특히, 변수명, 함수명, 주석, 문자열 등에서 발생할 수 있는 철자 오류를 효과적으로 찾아낼 수 있습니다. 또한, 다양한 프로그래밍 언어와 자연어에 대한 지원을 포함하며, 사용자 정의 사전을 통해 특정 단어나 용어를 추가하는 것도 가능하므로, 팀이나 프로젝트의 도메인 특화 용어에 대한 철자 검사도 손쉽게 진행할 수 있습니다. 이러한 기능들로 인해 개발자는 코드의 가독성과 품질을 향상시키며, 불필요한 리뷰 시간을 줄일 수 있습니다.

생각보다 코드 리뷰 과정에서 오타를 자주 발견하게 되며, 이런 오타로 인해 한 번쯤 큰 어려움을 많은 개발자분들이 겪어 보셨습니다.

## 5. Import Cost

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=167" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)는 Visual Studio Code의 확장 기능으로, 개발자가 코드에 모듈이나 라이브러리를 임포트할 때 해당 모듈이나 라이브러리의 크기를 실시간으로 표시해줍니다. 이로 인해 개발자는 번들 사이즈가 과도하게 커지는 것을 미리 인지하고, 필요한 경우 더 경량화된 대안을 찾을 수 있게 도와줍니다. 이는 웹 애플리케이션의 로딩 시간과 성능 최적화에 큰 도움을 제공합니다.

## 6. vscode-styled-components

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=188" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)는 [emotion.js](https://emotion.sh/docs/introduction)와 같은 `styled-components` 라이브러리를 사용하여 스타일링된 React 컴포넌트를 개발할 때 도움을 줍니다.

주요 특징과 장점은 다음과 같습니다.

1. **구문 강조**: `styled-components`의 템플릿 리터럴 내에서 CSS 구문을 강조하여 코드의 가독성을 향상시킵니다.
2. **자동 완성**: CSS 속성과 값에 대한 자동 완성을 제공하여 빠르고 정확한 코드 작성을 돕습니다.
3. **포함된 에러 표시**: 잘못된 CSS 속성 또는 값이 사용될 때 오류를 실시간으로 표시합니다.
4. **Go to Definition 및 Peek 기능**: CSS 규칙과 관련된 스타일링 부분으로 쉽게 이동하거나 미리보기를 제공합니다.

## 7. ESLint

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=215" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[ESLint](https://eslint.org)는 코드 품질과 코딩 스타일 문제를 식별하는 데 사용되는 자바스크립트 린터입니다. [Visual Studio Code용 ESLint 플러그인](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)은 코드를 작성하는 동안 자바스크립트와 TypeScript 코드의 문제점을 실시간으로 감지하고 표시해줍니다. 이 플러그인은 팀 전체의 코딩 표준을 일관되게 유지하는 데 도움을 주며, 잠재적인 오류나 안티 패턴을 피할 수 있게 합니다. 사용자 정의 규칙과 확장 기능을 통해 프로젝트의 특정 필요에 맞게 린팅 과정을 맞춤 설정할 수도 있습니다. 결론적으로, `ESLint` 플러그인은 코드의 품질을 향상시키고, 개발자 간의 코드 일관성을 유지하며, 오류를 최소화하는 데 큰 도움을 제공합니다.

## 8. Prettier

<div class="video-container" style={{marginBottom: 8}}>
<iframe width="560" height="315" src="https://youtu.be/5ivLyHDNR04?t=256" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

[Prettier](https://prettier.io)는 자동 코드 포매터로, 지원하는 여러 프로그래밍 언어와 마크업 언어의 코드를 일관된 스타일로 자동으로 정렬해주는 도구입니다. [Visual Studio Code용 Prettier 플러그인](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)은 코드를 저장할 때 자동으로 코드 스타일을 최적화하며, 개발자가 수동으로 코드 스타일을 맞추는 수고를 덜어줍니다. 이 플러그인은 코드의 가독성을 향상시키고, 코드 리뷰 과정에서 스타일 관련된 논의를 최소화하여 개발자들이 실질적인 로직에 집중할 수 있게 도와줍니다. 사용자는 `Prettier`의 설정을 통해 원하는 코드 스타일을 지정할 수 있으며, 이 툴은 프로젝트 전체에서 일관된 코드 스타일을 유지하는 데 매우 유용합니다.