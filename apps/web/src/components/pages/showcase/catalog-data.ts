// CPK editorial examples, independent of member-owned Convex submissions.
// Maintenance and evidence policy: docs/curated-showcase.md
import type { CuratedApp } from './catalog';

export const curatedApps: CuratedApp[] = [
  {
    id: 'toss',
    name: '토스 · Toss',
    publisher: 'Viva Republica',
    technology: 'react-native',
    category: 'finance',
    scope: 'features',
    description: {
      ko: '송금부터 자산 관리까지 일상 속 금융을 한곳에서 다루는 국내 서비스입니다.',
      en: 'A Korean financial service bringing everyday payments and money management together.',
    },
    adoption: {
      ko: '네이티브 앱 안에 React Native 서비스를 통합한 사례입니다. 앱 전체를 RN으로 단정하지 않습니다.',
      en: 'React Native services are integrated into the native app; this is not a claim that every screen uses RN.',
    },
    source: {
      title: '토스가 꿈꾸는 React Native 기술의 미래',
      url: 'https://toss.tech/article/react-native-2024',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://toss.im/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6e/ef/88/6eef887a-9ea8-8f67-2422-d18db842945d/AppIcon-0-0-1x_U007ephone-0-1-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/kr/app/%ED%86%A0%EC%8A%A4/id839333328?uo=4',
  },
  {
    id: 'my-bmw',
    name: 'My BMW',
    publisher: 'BMW Group',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '차량 상태를 확인하고 자동차와 스마트폰을 연결하는 BMW의 동반 앱입니다.',
      en: "BMW's companion app connects a driver with their vehicle and its status.",
    },
    adoption: {
      ko: 'BMW·MINI의 국가별 앱 변형을 Flutter 공통 코드베이스로 구축한 사례입니다.',
      en: 'BMW and MINI built their regional app variants on a shared Flutter codebase.',
    },
    source: {
      title: 'BMW',
      url: 'https://flutter.dev/showcase/bmw',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.bmw.com/en/innovation/my-bmw-app.html',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/23/03/67/2303670b-651b-6ae6-761f-3e0a7c6e8334/bmwappstore-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/my-bmw/id1519457734?uo=4',
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    publisher: 'Duolingo',
    technology: 'kmp',
    category: 'education',
    scope: 'shared-logic',
    description: {
      ko: '짧은 수업과 반복 연습으로 외국어를 배우는 학습 앱입니다.',
      en: 'A language-learning app built around short lessons and regular practice.',
    },
    adoption: {
      ko: '내부 공통 로직에 KMP 활용.',
      en: 'KMP adoption in internal shared logic.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.duolingo.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b7/b8/6b/b7b86b67-18ad-44c9-8909-f1da80444946/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/duolingo-language-lessons/id570060128?uo=4',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    publisher: 'Meta',
    technology: 'react-native',
    category: 'social',
    scope: 'features',
    description: {
      ko: '친구의 소식, 관심사 커뮤니티와 지역 거래를 연결하는 소셜 서비스입니다.',
      en: 'A social platform connecting personal updates, interest groups and local communities.',
    },
    adoption: {
      ko: 'Marketplace 등 제품 생태계 일부에 RN을 활용합니다.',
      en: 'RN is used in parts of the ecosystem, including Marketplace.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.facebook.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e4/86/b0/e486b05a-e507-5865-bf0b-5eb1ac65da49/Icon-Production-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/facebook/id284882215?uo=4',
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    publisher: 'Google',
    technology: 'flutter',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '자료를 바탕으로 내용을 정리하고 학습을 돕는 Google의 AI 노트 도구입니다.',
      en: "Google's AI notebook helps people explore and organize the sources they provide.",
    },
    adoption: {
      ko: 'Flutter 공식 사례는 NotebookLM 모바일 앱의 개발을 소개합니다.',
      en: 'The official Flutter case covers development of the NotebookLM mobile app.',
    },
    source: {
      title: 'NotebookLM',
      url: 'https://flutter.dev/showcase/notebooklm',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://notebooklm.google/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/15/51/22/15512226-1bca-edda-7883-743a82041103/gemini_notebook_ios-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/gemini-notebook/id6737527615?uo=4',
  },
  {
    id: 'sony-headphones',
    name: 'Sony headphone companion',
    publisher: 'Sony',
    technology: 'kmp',
    category: 'utilities',
    scope: 'app',
    description: {
      ko: '헤드폰과 스마트폰을 연결해 기기 기능을 사용하는 동반 앱 사례입니다.',
      en: 'A companion-app case connecting Sony headphones with smartphone features.',
    },
    adoption: {
      ko: '헤드폰 동반 앱에 KMP·Compose 적용.',
      en: 'KMP and Compose in a headphone companion.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/2e/aa/ed/2eaaeda4-1c7a-0501-ed68-874a7ae58f5e/AppIcon-0-0-1x_U007emarketing-0-3-0-GLES2_U002c0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/sony-sound-connect/id1168502924?uo=4',
  },
  {
    id: 'instagram-quest',
    name: 'Instagram for Meta Quest',
    publisher: 'Meta',
    technology: 'react-native',
    category: 'social',
    scope: 'listed',
    description: {
      ko: '사진과 영상으로 소통하는 Instagram을 Meta Quest에서 이용하는 앱입니다.',
      en: 'The Meta Quest experience for sharing and discovering Instagram photos and videos.',
    },
    adoption: {
      ko: '공식 RN 쇼케이스에 연결된 Meta Quest 버전입니다.',
      en: 'The Meta Quest edition is listed in the official RN showcase.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.meta.com/experiences/instagram/6894135610696226/',
    imageUrl: 'https://reactnative.dev/img/showcase/instagram.png',
    imageSourceUrl: 'https://reactnative.dev/showcase',
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    publisher: 'Google',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '결제와 송금 등 금융 활동을 지원하는 Google의 서비스입니다.',
      en: "Google's service for payments and other everyday financial activities.",
    },
    adoption: {
      ko: '공개 사례는 Flutter로 재구축한 Google Pay입니다. 모든 지역의 Google Wallet을 의미하지 않습니다.',
      en: 'The case covers the Flutter rebuild of Google Pay, not every regional Google Wallet application.',
    },
    source: {
      title: 'Google Pay',
      url: 'https://flutter.dev/showcase/google-pay',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://pay.google.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/72/80/41/7280412d-8a61-b5e6-e0f5-9eb2ba644dcc/GPayAppIcon-0-0-1x_U007ephone-0-0-0-1-0-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/in/app/google-pay-save-pay-manage/id1193357041',
  },
  {
    id: 'booking-com',
    name: 'Booking.com',
    publisher: 'Booking.com',
    technology: 'kmp',
    category: 'travel',
    scope: 'shared-logic',
    description: {
      ko: '숙소를 찾고 예약하며 여행 일정을 준비하는 글로벌 서비스입니다.',
      en: 'A global service for finding accommodation and arranging travel.',
    },
    adoption: {
      ko: '모바일 실험 배정·평가 로직을 공유합니다. Compose 사례는 별도 웹 UI 미리보기 도구입니다.',
      en: 'Shares mobile experiment assignment and evaluation logic; its Compose example is a separate web UI preview tool.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/10/01/f6/1001f6e4-136d-61bb-4988-1bccb6b331de/AppIcon-0-0-1x_U007epad-0-9-0-85-220.jpeg/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/booking-com-hotels-travel/id367003839?uo=4',
  },
  {
    id: 'meta-ads-manager',
    name: 'Meta Ads Manager',
    publisher: 'Meta',
    technology: 'react-native',
    category: 'productivity',
    scope: 'listed',
    description: {
      ko: '광고 캠페인의 성과와 예산을 모바일에서 확인하고 관리하는 도구입니다.',
      en: 'A mobile tool for managing advertising campaigns, budgets and performance.',
    },
    adoption: {
      ko: 'Facebook Ads Manager라는 이름으로 RN 공식 사례에 소개됐습니다.',
      en: 'Listed by the RN team under its Facebook Ads Manager name.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.facebook.com/business/tools/ads-manager',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/53/87/5f/53875fad-f3f6-e3d9-1e00-2d7cb39fadda/AppIcon-MetaBrand-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/meta-ads-manager/id964397083?uo=4',
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    publisher: 'Google',
    technology: 'flutter',
    category: 'education',
    scope: 'app',
    description: {
      ko: '교사와 학생이 과제와 수업 자료를 주고받는 학습 플랫폼입니다.',
      en: 'A learning platform where teachers and students exchange assignments and course materials.',
    },
    adoption: {
      ko: 'iOS 앱을 Flutter로 다시 만들고 Android로 확대한 전환 사례입니다.',
      en: 'The team rebuilt iOS in Flutter and subsequently brought the implementation to Android.',
    },
    source: {
      title: 'Google Classroom',
      url: 'https://flutter.dev/showcase/google-classroom',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://classroom.google.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/90/63/77/906377b3-8285-9e25-b0d6-364fc8a2fe83/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/google-classroom/id924620788?uo=4',
  },
  {
    id: 'philo',
    name: 'Philo',
    publisher: 'Philo',
    technology: 'kmp',
    category: 'entertainment',
    scope: 'shared-logic',
    description: {
      ko: '실시간 TV와 영상 콘텐츠를 여러 기기에서 시청하는 스트리밍 서비스입니다.',
      en: 'A streaming service for watching live television and video across devices.',
    },
    adoption: {
      ko: '모바일·TV·웹 클라이언트에서 비즈니스 로직을 KMP로 공유한 운영 경험을 공개했습니다.',
      en: 'Documented sharing business logic across mobile, TV and web clients with KMP.',
    },
    source: {
      title: 'Kotlin Multiplatform at Philo – 3 Years Later - Philo Blog',
      url: 'https://www.philo.com/blog/kotlin-multiplatform-at-philo-3-years-later',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.philo.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8c/db/25/8cdb255b-2943-1c91-e179-69b3fbfc5ed5/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/philo-shows-movies-live-tv/id1248646044?uo=4',
  },
  {
    id: 'meta-horizon',
    name: 'Meta Horizon',
    publisher: 'Meta',
    technology: 'react-native',
    category: 'entertainment',
    scope: 'listed',
    description: {
      ko: 'Meta의 가상 공간과 콘텐츠를 탐색하고 사람들과 연결되는 서비스입니다.',
      en: "A companion to Meta's virtual worlds, experiences and social connections.",
    },
    adoption: {
      ko: 'RN 공식 쇼케이스에 모바일 앱이 등재되어 있습니다.',
      en: 'Its mobile apps appear in the official RN showcase.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.meta.com/experiences/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/4f/51/2a/4f512a9e-6500-38a9-58a7-8cb7f0d93e84/AppIcon-MetaHorizon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/meta-horizon/id1366478176?uo=4',
  },
  {
    id: 'google-crowdsource',
    name: 'Crowdsource by Google',
    publisher: 'Google',
    technology: 'flutter',
    category: 'education',
    scope: 'app',
    description: {
      ko: '언어와 이미지 등의 작은 기여로 AI 학습을 돕는 참여형 서비스입니다.',
      en: 'A contribution app where people help improve AI through language and image tasks.',
    },
    adoption: {
      ko: 'Smart Camera 기능 도입 후 Android 앱의 Flutter 재구축으로 확장했습니다.',
      en: 'Flutter adoption grew from Smart Camera into rebuilding the Android application.',
    },
    source: {
      title: 'Crowdsource',
      url: 'https://flutter.dev/showcase/crowdsource',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://crowdsource.google.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/XWXaPrToMlugwEIOfd75YzA4-tMfLxOEGilanak4xjHIhRWzbS64MJ4taaiYoOeRjIkCPew_Z_2cFBrR_FRe4A',
    imageSourceUrl:
      'https://play.google.com/store/apps/details?id=com.google.android.apps.village.boond',
  },
  {
    id: 'hm',
    name: 'H&M',
    publisher: 'H&M',
    technology: 'kmp',
    category: 'commerce',
    scope: 'shared-logic',
    description: {
      ko: '패션 상품을 탐색하고 구매하는 글로벌 리테일 앱입니다.',
      en: 'A global retail app for browsing and shopping for fashion.',
    },
    adoption: {
      ko: '기능 플래그·실험 로직 공유.',
      en: 'Shared feature-toggle and experimentation logic.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c0/6a/c4/c06ac477-3218-1726-fd1f-5901b59f177d/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/h-m/id834465911?uo=4',
  },
  {
    id: 'microsoft-office',
    name: 'Microsoft 365 (Office)',
    publisher: 'Microsoft',
    technology: 'react-native',
    category: 'productivity',
    scope: 'listed',
    description: {
      ko: '문서·스프레드시트·프레젠테이션 작업을 지원하는 Microsoft의 생산성 제품군입니다.',
      en: "Microsoft's productivity suite for documents, spreadsheets and presentations.",
    },
    adoption: {
      ko: '공식 사례의 제품명은 Microsoft Office이며 전체 구현 비율은 공개되지 않았습니다.',
      en: 'The showcase names Microsoft Office; it does not specify a full-app implementation ratio.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.microsoft.com/microsoft-365',
    imageUrl: 'https://reactnative.dev/img/showcase/officemobile.png',
    imageSourceUrl: 'https://reactnative.dev/showcase',
  },
  {
    id: 'knowunity',
    name: 'Knowunity',
    publisher: 'Knowunity',
    technology: 'flutter',
    category: 'education',
    scope: 'app',
    description: {
      ko: '학교 공부와 시험 준비를 돕는 AI 학습 동반 앱입니다.',
      en: 'An AI study companion for schoolwork, homework and exam preparation.',
    },
    adoption: {
      ko: 'Flutter 공통 코드와 애니메이션을 활용해 여러 국가의 학습 경험을 제공합니다.',
      en: 'Uses a shared Flutter codebase and animations for its learning experience across markets.',
    },
    source: {
      title: 'Knowunity',
      url: 'https://flutter.dev/showcase/knowunity',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://knowunity.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f0/e2/52/f0e25276-9539-e6c1-2f04-bf97dcc1ed8b/AppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/knowunity-ai-study-homework/id1484296272?uo=4',
  },
  {
    id: 'bitkey',
    name: 'Bitkey',
    publisher: 'Block',
    technology: 'kmp',
    category: 'finance',
    scope: 'shared-logic',
    description: {
      ko: '하드웨어와 모바일 앱을 함께 사용하는 비트코인 지갑 제품입니다.',
      en: 'A Bitcoin wallet product combining a mobile application with hardware.',
    },
    adoption: {
      ko: 'KMP로 핵심 로직을 공유하고, 네이티브 UI에서 Compose Multiplatform으로 확대한 사례입니다.',
      en: 'Shares core logic with KMP and describes expanding from native UI to Compose Multiplatform.',
    },
    source: {
      title: 'How Bitkey Uses Cross-Platform Development | Block Engineering Blog',
      url: 'https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://bitkey.world/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/78/3d/88/783d8892-f7c2-2ac4-1129-a076e503033d/AppIconRelease-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/bitkey-bitcoin-wallet/id6476990471?uo=4',
  },
  {
    id: 'microsoft-outlook',
    name: 'Microsoft Outlook',
    publisher: 'Microsoft',
    technology: 'react-native',
    category: 'productivity',
    scope: 'listed',
    description: {
      ko: '이메일과 일정을 함께 관리하며 업무와 개인 약속을 정리하는 앱입니다.',
      en: 'An email and calendar app for organizing work and personal commitments.',
    },
    adoption: {
      ko: 'Microsoft의 RN 활용 앱으로 공식 소개되어 있습니다.',
      en: "Listed among Microsoft's RN applications.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl:
      'https://www.microsoft.com/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c2/c5/d8/c2c5d8ba-1bd8-b3ac-8cae-732f19764c52/AppIcon-outlook.prod-0-0-1x_U007epad-0-1-0-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/microsoft-outlook/id951937596?uo=4',
  },
  {
    id: 'sofi',
    name: 'SoFi',
    publisher: 'SoFi',
    technology: 'flutter',
    category: 'finance',
    scope: 'features',
    description: {
      ko: '뱅킹, 투자와 대출 관련 기능을 모은 금융 서비스입니다.',
      en: 'A financial service bringing banking, investing and lending features together.',
    },
    adoption: {
      ko: '기존 네이티브 앱에 Flutter를 넣고 기능별로 옮기는 단계적 전환을 공개했습니다.',
      en: 'Documented an incremental migration, embedding Flutter and moving native features individually.',
    },
    source: {
      title: 'SoFi',
      url: 'https://flutter.dev/showcase/sofi',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/09/31/37/09313724-19bf-5fa0-a1c3-17de8598ccb4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/sofi-bank-invest-crypto/id1191985736?uo=4',
  },
  {
    id: 'markaz',
    name: 'Markaz',
    publisher: 'Markaz',
    technology: 'kmp',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '상품을 찾아 소셜 판매를 시작하도록 돕는 파키스탄의 커머스 앱입니다.',
      en: 'A Pakistani commerce app helping people discover products for social selling.',
    },
    adoption: {
      ko: 'Compose Multiplatform으로 UI 공유.',
      en: 'UI shared with Compose Multiplatform.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.markaz.app/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/9e/e5/c9/9ee5c9be-8ad1-2c29-11d2-83793dbfb101/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/pk/app/markaz-online-shopping/id6470020517?uo=4',
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    publisher: 'Microsoft',
    technology: 'react-native',
    category: 'productivity',
    scope: 'listed',
    description: {
      ko: '팀 채팅, 회의와 협업을 한곳에서 이어가는 커뮤니케이션 도구입니다.',
      en: 'A communication tool combining team chat, meetings and collaboration.',
    },
    adoption: {
      ko: '공식 RN 사례이며 모든 클라이언트가 같은 구현이라는 의미는 아닙니다.',
      en: 'An official RN example, without implying identical implementations across every client.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.microsoft.com/microsoft-teams/group-chat-software',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d9/d0/fe/d9d0fe80-f987-c8eb-e729-031ff11fe152/AppIcon-0-0-1x_U007epad-0-1-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/microsoft-teams/id1113153706?uo=4',
  },
  {
    id: 'kqed',
    name: 'KQED',
    publisher: 'KQED',
    technology: 'flutter',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '지역 뉴스, 라디오와 팟캐스트를 전하는 미국 공영 미디어 앱입니다.',
      en: 'A public-media app offering local reporting, radio and podcasts.',
    },
    adoption: {
      ko: 'Flutter로 모바일 앱을 재구축하고 CarPlay·Android Auto 연결도 구현했습니다.',
      en: 'Rebuilt the mobile application with Flutter, including CarPlay and Android Auto integrations.',
    },
    source: {
      title: 'KQED',
      url: 'https://flutter.dev/showcase/kqed',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.kqed.org/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/02/87/c5/0287c5fc-7455-7683-ca6c-e7649bf43e75/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/kqed-bay-area-culture-news/id466558955?uo=4',
  },
  {
    id: 'opensooq',
    name: 'OpenSooq',
    publisher: 'OpenSooq',
    technology: 'kmp',
    category: 'commerce',
    scope: 'shared-logic',
    description: {
      ko: '중동 지역에서 상품과 생활 서비스를 거래하는 온라인 마켓플레이스입니다.',
      en: 'An online marketplace for goods and local services in the Middle East.',
    },
    adoption: {
      ko: '주요 모바일 모듈에 KMP 적용.',
      en: 'KMP in core mobile modules.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.opensooq.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/27/dd/c3/27ddc3db-a23c-3543-3390-39ee971b8966/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl:
      'https://apps.apple.com/us/app/%D8%A7%D9%84%D8%B3%D9%88%D9%82-%D8%A7%D9%84%D9%85%D9%81%D8%AA%D9%88%D8%AD-opensooq/id654456967?uo=4',
  },
  {
    id: 'amazon-shopping',
    name: 'Amazon Shopping',
    publisher: 'Amazon',
    technology: 'react-native',
    category: 'commerce',
    scope: 'features',
    description: {
      ko: '상품 탐색부터 주문과 배송 조회까지 제공하는 쇼핑 앱입니다.',
      en: 'A shopping app for discovering products, placing orders and tracking deliveries.',
    },
    adoption: {
      ko: 'Amazon의 기존 앱에 RN 기반 기능을 도입한 사례입니다.',
      en: "An example of adding RN features to Amazon's existing applications.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5d/79/b8/5d79b865-9ad4-f905-696c-0e07bac67986/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/amazon-shopping/id297606951?uo=4',
  },
  {
    id: 'talabat',
    name: 'talabat',
    publisher: 'talabat',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '음식과 장보기 상품을 주문하는 중동·북아프리카 지역 배달 서비스입니다.',
      en: 'A food and grocery delivery service operating across the Middle East and North Africa.',
    },
    adoption: {
      ko: '식당 메뉴 화면 등으로 시작해 Flutter로 단계적으로 전환한 사례입니다.',
      en: 'Incrementally migrated to Flutter, including critical restaurant-menu screens.',
    },
    source: {
      title: 'talabat',
      url: 'https://flutter.dev/showcase/talabat',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.talabat.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/30/61/ab/3061ab29-2151-2a6d-21bf-5dbc5282e437/AppIcon-0-1x_U007ephone-0-1-85-220-0.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/talabat-food-grocery-more/id451001072?uo=4',
  },
  {
    id: 'workspace-one',
    name: 'Workspace ONE apps',
    publisher: 'Omnissa',
    technology: 'kmp',
    category: 'productivity',
    scope: 'shared-logic',
    description: {
      ko: '조직 구성원의 모바일 업무를 지원하는 기업용 생산성 앱 제품군입니다.',
      en: "Enterprise productivity applications supporting employees' mobile workflows.",
    },
    adoption: {
      ko: 'VMware 당시 공개된 공통 모듈 사례.',
      en: 'Shared-module case published during the VMware era.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/69/d6/fc/69d6fc8a-a603-d6a8-a226-d02f82172e44/AppIcon-0-1x_U007epad-0-11-0-0-0-GLES2_U002c0-85-220-0.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/intelligent-hub/id338761996?uo=4',
  },
  {
    id: 'amazon-alexa',
    name: 'Amazon Alexa',
    publisher: 'Amazon',
    technology: 'react-native',
    category: 'utilities',
    scope: 'listed',
    description: {
      ko: 'Alexa 지원 기기와 스마트홈 환경을 설정하고 관리하는 앱입니다.',
      en: 'A companion app for setting up Alexa devices and managing a smart home.',
    },
    adoption: {
      ko: 'Amazon의 RN 활용 앱으로 공식 쇼케이스에 소개됩니다.',
      en: "Listed in the RN showcase among Amazon's applications.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/05/36/c0/0536c016-95b2-cad3-827b-7e1b052378ab/AppIconRelease-0-1x_U007epad-0-0-0-10-0-0-0-85-220-0.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/amazon-alexa/id944011620?uo=4',
  },
  {
    id: 'zoho-tables',
    name: 'Zoho Tables',
    publisher: 'Zoho',
    technology: 'flutter',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '스프레드시트의 친숙함과 데이터베이스의 구조를 결합한 업무 도구입니다.',
      en: 'A work tool combining the familiarity of spreadsheets with structured databases.',
    },
    adoption: {
      ko: 'Flutter로 모바일 앱의 대형 캔버스와 스크롤, 펜 입력 연동을 구현했습니다.',
      en: "Uses Flutter for the mobile app's large canvas, scrolling and native pen integrations.",
    },
    source: {
      title: 'Zoho Tables',
      url: 'https://flutter.dev/showcase/zoho-tables',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.zoho.com/tables/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b5/e0/0a/b5e00aec-a15c-151c-4c81-a8a1c433f79c/zt_app_icon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/zoho-tables-organize-work/id1569639592?uo=4',
  },
  {
    id: 'netflix-studio',
    name: 'Netflix Studio apps',
    publisher: 'Netflix',
    technology: 'kmp',
    category: 'productivity',
    scope: 'shared-logic',
    description: {
      ko: '영상 제작 업무를 지원하는 Netflix의 내부 모바일 앱 사례입니다.',
      en: "Netflix's internal mobile applications supporting studio production workflows.",
    },
    adoption: {
      ko: 'KMP로 제작진용 앱의 공통 로직을 공유합니다. 소비자용 스트리밍 앱 전체에 대한 사례는 아닙니다.',
      en: 'Shares logic in studio applications; this is not a case about the entire consumer streaming app.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl: 'https://i.iinfo.cz/s/product-icons/itunes/77/65/prodicle.png',
    imageSourceUrl: 'https://www.slunecnice.cz/ios/sw/prodicle/',
  },
  {
    id: 'amazon-photos',
    name: 'Amazon Photos',
    publisher: 'Amazon',
    technology: 'react-native',
    category: 'utilities',
    scope: 'listed',
    description: {
      ko: '사진과 영상을 저장하고 여러 기기에서 다시 찾아보는 서비스입니다.',
      en: 'A service for storing photos and videos and accessing them across devices.',
    },
    adoption: {
      ko: 'RN 공식 사례에 등재되어 있으며 화면별 범위는 명시되지 않았습니다.',
      en: 'Officially listed; the showcase does not enumerate individual RN screens.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/63/83/ba638370-d9ba-5ac6-aa2b-eab1a8957841/AppIconRelease-0-1x_U007emarketing-0-8-0-85-220-0.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/amazon-photos-photo-video/id621574163?uo=4',
  },
  {
    id: 'karaca',
    name: 'Karaca',
    publisher: 'Karaca',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '주방용품과 생활용품을 둘러보고 구매하는 리테일 앱입니다.',
      en: 'A retail app for browsing and buying kitchenware and home products.',
    },
    adoption: {
      ko: '플랫폼별 구현을 Flutter 공통 코드로 옮겨 제품 경험을 일관되게 만든 사례입니다.',
      en: 'Moved platform-specific development toward a common Flutter product experience.',
    },
    source: {
      title: 'Karaca',
      url: 'https://flutter.dev/showcase/karaca',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.karaca.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/42/63/e7/4263e7b0-45ac-120f-b47b-4ea2fc4c7348/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.webp',
    imageSourceUrl:
      'https://apps.apple.com/us/app/karaca-ev-ya%C5%9Fam-al%C4%B1%C5%9Fveri%C5%9Fi/id1547965580?uo=4',
  },
  {
    id: 'quizlet',
    name: 'Quizlet',
    publisher: 'Quizlet',
    technology: 'kmp',
    category: 'education',
    scope: 'shared-logic',
    description: {
      ko: '플래시카드와 퀴즈로 개념을 익히고 시험을 준비하는 학습 서비스입니다.',
      en: 'A study service using flashcards and quizzes for practice and exam preparation.',
    },
    adoption: {
      ko: '기존 JavaScript 공유 코드를 Kotlin으로 이전.',
      en: 'Shared JavaScript code migrated to Kotlin.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bf/a4/13/bfa4131a-2b4c-53fd-9c94-43e61b7162a8/AppIcon-production-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/quizlet-more-than-flashcards/id546473125?uo=4',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    publisher: 'Shopify',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '판매자가 상품, 주문과 스토어 운영을 모바일에서 관리하는 앱입니다.',
      en: 'A mobile app for merchants to manage products, orders and store operations.',
    },
    adoption: {
      ko: 'Shopify는 모바일 앱을 RN으로 개발한다고 공개했습니다.',
      en: 'Shopify publicly describes RN as the foundation of its mobile apps.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.shopify.com/mobile',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/45/67/1f/45671f85-3d88-446d-b01b-7224bda823f1/AppIcon-com.jadedpixel.shopify-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/shopify-sell-online-in-person/id371294472?uo=4',
  },
  {
    id: 'kikoff',
    name: 'Kikoff',
    publisher: 'Kikoff',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '신용 관리 관련 서비스를 제공하는 미국의 개인 금융 앱입니다.',
      en: 'A US personal-finance app offering credit-building services.',
    },
    adoption: {
      ko: '초기부터 Flutter로 iOS와 Android를 함께 개발한 소규모 팀의 사례입니다.',
      en: 'A small team built iOS and Android together with Flutter from an early stage.',
    },
    source: {
      title: 'Kikoff',
      url: 'https://flutter.dev/showcase/kikoff',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://kikoff.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5d/77/26/5d772650-f97a-ed50-52eb-2edc0660a8d3/AppIcon-enterprise-0-0-1x_U007epad-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/kikoff-build-credit-quickly/id1525159784?uo=4',
  },
  {
    id: 'memrise',
    name: 'Memrise',
    publisher: 'Memrise',
    technology: 'kmp',
    category: 'education',
    scope: 'shared-logic',
    description: {
      ko: '일상에서 쓰이는 표현을 배우고 외국어를 연습하는 학습 서비스입니다.',
      en: 'A language-learning service for practicing useful everyday expressions.',
    },
    adoption: {
      ko: '모바일·웹 로직을 점진적으로 공유.',
      en: 'Incrementally shared mobile and web logic.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.memrise.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/55/48/d4/5548d47f-d6cc-4f35-eb13-5fa69872e717/AppIcon-0-0-1x_U007emarketing-0-8-0-P3-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/memrise-easy-language-learning/id635966718?uo=4',
  },
  {
    id: 'shop',
    name: 'Shop',
    publisher: 'Shopify',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '브랜드와 상품을 발견하고 구매 이후 배송까지 확인하는 쇼핑 앱입니다.',
      en: 'A shopping app for discovering brands and following purchases through delivery.',
    },
    adoption: {
      ko: 'Shopify의 RN 모바일 앱 제품군에 포함됩니다.',
      en: "Part of Shopify's RN mobile application portfolio.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/fb/66/c9/fb66c96b-4c3f-7ab3-e53e-fcf57a69fc7f/AppIconProduction-0-0-1x_U007ephone-0-11-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/shop-track-pay-discover/id1223471316?uo=4',
  },
  {
    id: 'expo-city-dubai',
    name: 'Expo City Dubai',
    publisher: 'Expo City Dubai',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '두바이의 복합 지구에서 장소와 행사, 방문 정보를 탐색하는 앱입니다.',
      en: "An app for discovering venues, events and visitor information in Dubai's mixed-use district.",
    },
    adoption: {
      ko: '지도 중심의 경험을 Flutter로 개발했습니다. 이름의 Expo는 RN 프레임워크와 무관합니다.',
      en: 'Its map-oriented experience uses Flutter; the Expo name here is unrelated to the RN framework.',
    },
    source: {
      title: 'Expo City Dubai',
      url: 'https://flutter.dev/showcase/expo-city-dubai',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.expocitydubai.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/19/74/eb/1974ebea-e87d-7831-6ba5-32927e2cda45/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/expo-city-dubai/id6504216698?uo=4',
  },
  {
    id: 'forbes',
    name: 'Forbes',
    publisher: 'Forbes',
    technology: 'kmp',
    category: 'entertainment',
    scope: 'shared-logic',
    description: {
      ko: '비즈니스, 산업과 인물 관련 기사와 분석을 읽는 뉴스 앱입니다.',
      en: 'A news app for reporting and analysis on business, industries and people.',
    },
    adoption: {
      ko: '모바일 앱의 비즈니스 로직을 KMP로 공유하고 플랫폼별 UI 선택을 유지했습니다.',
      en: 'Shares mobile business logic with KMP while retaining platform-specific UI choices.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.forbes.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/98/07/29/980729b1-e689-2aaa-fe78-849de2fec2bc/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/forbes/id1638757310?uo=4',
  },
  {
    id: 'shopify-inbox',
    name: 'Shopify Inbox',
    publisher: 'Shopify',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '판매자가 고객의 질문에 답하고 구매 상담을 이어가는 메시징 도구입니다.',
      en: 'A merchant messaging tool for answering customer questions and supporting purchases.',
    },
    adoption: {
      ko: 'Shopify가 공개한 RN 모바일 앱 사례입니다.',
      en: 'A Shopify mobile application publicly built with RN.',
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.shopify.com/inbox',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/fe/90/3b/fe903bc1-dac9-f43d-15bd-a43544798c80/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/shopify-inbox/id1301681854?uo=4',
  },
  {
    id: 'agape',
    name: 'Agapé',
    publisher: 'Agapé Wellness',
    technology: 'flutter',
    category: 'health',
    scope: 'app',
    description: {
      ko: '일상적인 질문과 대화를 통해 가까운 사람들과 관계를 가꾸는 앱입니다.',
      en: 'A relationship app encouraging conversations and everyday connection with loved ones.',
    },
    adoption: {
      ko: 'Flutter를 활용해 여러 기기에 일관된 상호작용을 제공한 사례입니다.',
      en: 'Uses Flutter to deliver a consistent interactive experience across devices.',
    },
    source: {
      title: 'Agapé',
      url: 'https://flutter.dev/showcase/agape',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.getdailyagape.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/8rJnXVsXmK28UGQZ4GFnPYjBTCnlEDGiRElMGjXib52pB2oIYmeQk19jIzfKLd0U3XxKd3-JxLDCMdlxnF00',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.getdailyagape',
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩 · Bilibili',
    publisher: 'Bilibili',
    technology: 'kmp',
    category: 'entertainment',
    scope: 'features',
    description: {
      ko: '영상과 창작자 커뮤니티를 중심으로 콘텐츠를 즐기는 중국의 플랫폼입니다.',
      en: 'A Chinese platform built around videos and creator communities.',
    },
    adoption: {
      ko: '중국판 앱의 메시징 기능에 KMP·Compose 적용.',
      en: "KMP and Compose in the Chinese app's messaging.",
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.bilibili.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/11/db/0f/11db0f86-e5a4-3c6a-1946-698346e63d44/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl:
      'https://apps.apple.com/cn/app/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E5%BC%B9%E5%B9%95%E7%95%AA%E5%89%A7%E7%9B%B4%E6%92%AD%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91/id736536022?uo=4',
  },
  {
    id: 'shopify-pos',
    name: 'Shopify POS',
    publisher: 'Shopify',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '매장 결제와 상품·주문 관리를 온라인 스토어 운영과 연결합니다.',
      en: 'A point-of-sale app connecting in-store payments and orders with online retail.',
    },
    adoption: {
      ko: 'Shopify의 RN 기반 모바일 제품군으로 소개됩니다.',
      en: "Included in Shopify's RN mobile product portfolio.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.shopify.com/pos',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f4/38/0a/f4380a41-5f53-0fda-4a0c-d14f01c12acb/PosAppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/shopify-point-of-sale-pos/id686830644?uo=4',
  },
  {
    id: 'headspace',
    name: 'Headspace',
    publisher: 'Headspace',
    technology: 'flutter',
    category: 'health',
    scope: 'features',
    description: {
      ko: '명상과 수면 등 마음 건강을 위한 콘텐츠를 제공하는 서비스입니다.',
      en: 'A service offering meditation, sleep and mental-wellbeing content.',
    },
    adoption: {
      ko: '공식 사례는 모바일·웹 경험을 위한 Flutter 전환 과정을 소개합니다.',
      en: 'The published case discusses migration to Flutter for mobile and web experiences.',
    },
    source: {
      title: 'Headspace',
      url: 'https://flutter.dev/showcase/headspace',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.headspace.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/64/da/0e/64da0e97-b29f-bf25-ef1b-8b90c4ab8ee8/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/headspace-sleep-meditation/id493145008?uo=4',
  },
  {
    id: 'workday',
    name: 'Workday',
    publisher: 'Workday',
    technology: 'kmp',
    category: 'productivity',
    scope: 'shared-logic',
    description: {
      ko: '직원이 인사·업무 관련 정보를 확인하고 일상적인 절차를 처리하는 앱입니다.',
      en: 'An employee app for accessing workplace information and completing everyday tasks.',
    },
    adoption: {
      ko: '기존 네이티브 경험을 유지하면서 모바일 코드 공유 영역에 KMP를 도입했습니다.',
      en: 'Adopted KMP for shared mobile code while preserving the native user experience.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.workday.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/6f/d8/e8/6fd8e8b1-da87-613b-6e23-859fd37e7431/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/workday/id316800034?uo=4',
  },
  {
    id: 'spaces-by-wix',
    name: 'Spaces by Wix',
    publisher: 'Wix',
    technology: 'react-native',
    category: 'social',
    scope: 'app',
    description: {
      ko: '이용자가 Wix 기반 비즈니스와 커뮤니티의 소식과 서비스를 만나는 앱입니다.',
      en: 'A member app for engaging with Wix businesses and their communities.',
    },
    adoption: {
      ko: 'Wix가 공개한 RN 앱 제품군에 포함됩니다.',
      en: "Part of Wix's publicly documented RN application suite.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2a/34/e4/2a34e4fc-06fe-2c59-d3bc-0cac50cd6c3f/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/spaces-follow-businesses/id1099748482?uo=4',
  },
  {
    id: 'mgm-resorts',
    name: 'MGM Resorts',
    publisher: 'MGM Resorts International',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '리조트 방문객이 숙박과 현장 서비스를 이용하도록 돕는 앱입니다.',
      en: 'An app helping resort guests access stays and on-property services.',
    },
    adoption: {
      ko: '개발 파트너와 함께 Flutter로 고객의 디지털 방문 경험을 구축했습니다.',
      en: 'Built guest-facing digital experiences with Flutter and its development partner.',
    },
    source: {
      title: 'MGM Resorts',
      url: 'https://flutter.dev/showcase/mgm-resorts',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.mgmresorts.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/hz96RBbN8iyp_J6UEgszo-TGWVoIGmOJt9Nwu3DZk8vFr90IaA9hm8dp8QyceQgL3USZSDf74qvvVKhxvnm4MQ',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.mgmresorts.mgmresorts',
  },
  {
    id: 'x',
    name: 'X',
    publisher: 'X',
    technology: 'kmp',
    category: 'social',
    scope: 'shared-logic',
    description: {
      ko: '짧은 게시물과 실시간 대화를 중심으로 소식을 나누는 소셜 서비스입니다.',
      en: 'A social service for short posts, news and real-time conversations.',
    },
    adoption: {
      ko: '공통 로직에 KMP 활용.',
      en: 'KMP used for shared logic.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://x.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/83/6f/af/836faf36-eb77-9ac5-4d0d-c38b77970b8a/ProductionAppIcon-0-0-1x_U007emarketing-0-8-0-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/x/id333903271?uo=4',
  },
  {
    id: 'dine-by-wix',
    name: 'Dine by Wix',
    publisher: 'Wix',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '식당의 메뉴를 살펴보고 주문하며 단골 매장과 연결되는 앱입니다.',
      en: 'An app for browsing restaurant menus, ordering and staying connected with local venues.',
    },
    adoption: {
      ko: 'Wix의 RN 앱 사례로 공식 쇼케이스에 등재되어 있습니다.',
      en: "An official showcase entry from Wix's RN app suite.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://play-lh.googleusercontent.com/yAm6V6uL9woMYOPU2yJFdtvuN_wfLlX889ZSoNaVfsVsyLY-LsmVv3w_daEjMBacqYbzId7eVoDmv8GLzMdcwQ',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.wix.restaurants',
  },
  {
    id: 'kride',
    name: 'k.ride',
    publisher: 'Kakao Mobility',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '한국을 방문한 여행자가 택시를 호출할 수 있도록 만든 앱입니다.',
      en: 'A taxi-hailing app designed for travelers visiting South Korea.',
    },
    adoption: {
      ko: '공식 Flutter 사례는 별도 앱 k.ride입니다. 카카오 T 전체의 기술 스택으로 확대 해석하지 않습니다.',
      en: 'The Flutter case concerns k.ride specifically, not the entire Kakao T technology stack.',
    },
    source: {
      title: 'Kakao Mobility',
      url: 'https://flutter.dev/showcase/kakao-mobility',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://play.google.com/store/apps/details?id=com.kakaomobility.kride',
    imageUrl:
      'https://play-lh.googleusercontent.com/-dlo-blvIDhtkIL4pljFst1ljMagoBTOnG-jbUag_eS7uZtTeovEPJVjQFTXzTsgFhcc9wNsyx8BB9MK9aAf',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.kakaomobility.kride',
  },
  {
    id: 'bolt',
    name: 'Bolt',
    publisher: 'Bolt',
    technology: 'kmp',
    category: 'travel',
    scope: 'shared-logic',
    description: {
      ko: '이동과 배달 등 생활 속 모빌리티 서비스를 제공하는 앱 제품군입니다.',
      en: 'An app portfolio providing mobility and delivery services.',
    },
    adoption: {
      ko: '재연결 기능에서 채팅 엔진 공유로 확대.',
      en: 'Expanded from reconnection to a shared chat engine.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://bolt.eu/',
    imageUrl:
      'https://play-lh.googleusercontent.com/iiEjUHqz2W3uHQ0wFchSGFYNMwBMazonXpq9e2j_P81Tbq32iJqsy1VzMmUhzfjnOrO4oTQLbD3ki7zXIOIihlM',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=ee.mtakso.client',
  },
  {
    id: 'fit-by-wix',
    name: 'Fit by Wix',
    publisher: 'Wix',
    technology: 'react-native',
    category: 'health',
    scope: 'app',
    description: {
      ko: '피트니스 회원이 수업과 운동 서비스를 모바일에서 이용하는 앱입니다.',
      en: 'A member app for accessing fitness classes and services on mobile.',
    },
    adoption: {
      ko: 'Wix의 RN 기반 피트니스 앱 사례입니다.',
      en: "Wix's fitness application is listed as an RN implementation.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://play-lh.googleusercontent.com/WO7KaxGaaemVK_T2ARoLfF0I3aCuJuHte6XwFyh7i0TmdQwGoQLHuo9qoUnpOk4LDu3r2Cmtr_S-qk5K3znCHA',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.wix.fitness',
  },
  {
    id: 'compra-certa',
    name: 'Compra Certa',
    publisher: 'Whirlpool',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '브라질에서 가전제품을 둘러보고 구매하는 온라인 쇼핑 서비스입니다.',
      en: 'A Brazilian online marketplace for discovering and buying home appliances.',
    },
    adoption: {
      ko: 'Whirlpool이 기존 웹 서비스에 Flutter 기반 모바일 판매 채널을 더한 사례입니다.',
      en: 'Whirlpool added a Flutter mobile sales channel to its existing web marketplace.',
    },
    source: {
      title: 'Whirlpool',
      url: 'https://flutter.dev/showcase/whirlpool',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.compracerta.com.br/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/67/cc/f2/67ccf29a-d588-b489-3d6f-f47754f3dafb/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/br/app/compra-certa-compras-online/id6447604703',
  },
  {
    id: 'meetup',
    name: 'Meetup',
    publisher: 'Meetup',
    technology: 'kmp',
    category: 'social',
    scope: 'shared-logic',
    description: {
      ko: '관심사를 공유하는 사람들과 모임을 찾고 참여하는 커뮤니티 서비스입니다.',
      en: 'A community service for discovering and joining groups with shared interests.',
    },
    adoption: {
      ko: 'iOS·Android의 애플리케이션 로직 공유.',
      en: 'Shared application logic across iOS and Android.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.meetup.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ba/19/e3/ba19e363-f991-dc9b-a61b-61722879c33e/appIconRedesigned-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/meetup-social-events-groups/id375990038?uo=4',
  },
  {
    id: 'wix-owner',
    name: 'Wix Owner',
    publisher: 'Wix',
    technology: 'react-native',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '웹사이트와 고객 문의 등 비즈니스 운영을 휴대전화에서 관리합니다.',
      en: 'An owner app for managing a website and customer interactions from a phone.',
    },
    adoption: {
      ko: 'Wix의 RN 앱 제품군 중 운영자용 앱입니다.',
      en: "The business-owner application in Wix's RN suite.",
    },
    source: {
      title: 'React Native Showcase',
      url: 'https://reactnative.dev/showcase',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/89/d4/66/89d466be-f3c0-e70a-acd3-f38caf91e0bb/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/wix-website-builder/id1545924344?uo=4',
  },
  {
    id: 'sncf-connect',
    name: 'SNCF Connect',
    publisher: 'SNCF Connect & Tech',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '프랑스 철도 여행을 검색하고 예약하며 이동 계획을 관리하는 앱입니다.',
      en: 'An app for planning and booking rail journeys in France.',
    },
    adoption: {
      ko: 'iOS와 Android를 함께 업데이트하기 위해 Flutter로 앱을 전환했습니다.',
      en: 'Adopted Flutter to modernize its applications and update iOS and Android together.',
    },
    source: {
      title: 'SNCF Connect',
      url: 'https://flutter.dev/showcase/sncf-connect',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2a/a4/05/2aa4056f-7183-760c-7001-9aba8cc24fe9/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/sncf-connect-trains-routes/id343889987?uo=4',
  },
  {
    id: 'cash-app',
    name: 'Cash App',
    publisher: 'Block',
    technology: 'kmp',
    category: 'finance',
    scope: 'shared-logic',
    description: {
      ko: '사용자가 송금과 금융 관련 기능을 모바일에서 이용하는 서비스입니다.',
      en: 'A mobile service for payments and other financial activities.',
    },
    adoption: {
      ko: 'SQLDelight 경험을 바탕으로 공통 비즈니스 로직을 KMP로 공유하며 네이티브 UI를 유지했습니다.',
      en: 'Built on SQLDelight experience to share business logic with KMP while retaining native UI.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/cash-app/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://cash.app/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d4/3c/a6/d43ca6d7-6f87-8286-bd1a-6174673c93f2/AppIcon-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/cash-app/id711923939?uo=4',
  },
  {
    id: 'mta-traintime',
    name: 'MTA TrainTime',
    publisher: 'Metropolitan Transportation Authority',
    technology: 'react-native',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '뉴욕 통근열차의 여정을 계획하고 티켓을 구매·제시하는 앱입니다.',
      en: 'A New York commuter rail app for planning journeys and buying and presenting tickets.',
    },
    adoption: {
      ko: 'MTA는 2022년 Expo로 TrainTime을 구축하고 EAS로 배포를 운영한다고 설명합니다.',
      en: 'MTA describes building TrainTime with Expo in 2022 and operating its releases with EAS.',
    },
    source: {
      title: 'Using Expo at MTA — Expo',
      url: 'https://expo.dev/customers/mta',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.mta.info/traintime',
    imageUrl:
      'https://play-lh.googleusercontent.com/nSdyGmq7s73HfeVaJ4tePcSQnIx3L-MrH3lcRQntUzC_kkWmtF2UXSFtwBA7Bs9zx5KYwmYSqNHhtwVnYjd1JA',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.mta.mobileapp',
  },
  {
    id: 'monta',
    name: 'Monta',
    publisher: 'Monta',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '전기차 운전자가 충전 장소를 찾고 충전을 관리하는 서비스입니다.',
      en: 'A service helping electric-vehicle drivers find charging locations and manage charging.',
    },
    adoption: {
      ko: '지도 연동을 검증한 뒤 Flutter로 모바일 제품을 구축하고 확장했습니다.',
      en: 'Validated map integration before building and expanding its mobile product with Flutter.',
    },
    source: {
      title: 'Monta',
      url: 'https://flutter.dev/showcase/monta',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://monta.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/Vm612db0CZSazwCWOJMvUOWRwu3YB-AY0A1f9jCnZsGlq79x6TgB9hSymifJb1qU3agBzobQJ6ThpOOLyCYWcg',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.montaapp.monta',
  },
  {
    id: 'prezzee',
    name: 'Prezzee',
    publisher: 'Prezzee',
    technology: 'kmp',
    category: 'commerce',
    scope: 'shared-logic',
    description: {
      ko: '디지털 기프트카드를 보내고 보관하며 사용하는 선물 서비스입니다.',
      en: 'A gifting service for sending, storing and spending digital gift cards.',
    },
    adoption: {
      ko: '모바일 모노레포와 공유 모듈을 도입하면서 플랫폼별 UI 경험을 유지한 사례입니다.',
      en: 'Introduced a mobile monorepo and shared modules while retaining platform-specific UI experiences.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.prezzee.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/43/6f/71/436f71dc-a57d-2de2-2caa-3496ef74fd6c/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/prezzee-egift-cards/id1047060902?uo=4',
  },
  {
    id: 'hipcamp',
    name: 'Hipcamp',
    publisher: 'Hipcamp',
    technology: 'react-native',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '캠핑장과 독특한 야외 숙박지를 찾아 여행을 계획하는 예약 서비스입니다.',
      en: 'A booking service for discovering campsites and distinctive outdoor stays.',
    },
    adoption: {
      ko: '기존 모바일 앱의 빌드와 OTA 업데이트를 Expo EAS로 옮긴 사례입니다.',
      en: 'The team moved its mobile build and OTA update workflow to Expo EAS.',
    },
    source: {
      title: 'Using Expo at Hipcamp — Expo',
      url: 'https://expo.dev/customers/hipcamp',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.hipcamp.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6b/9d/5e/6b9d5ed2-21dc-42dd-72f9-5a809fdd8eb7/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/hipcamp-camping-rvs-cabins/id1440066037',
  },
  {
    id: 'wolt-merchant',
    name: 'Wolt Merchant',
    publisher: 'Wolt',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: 'Wolt 입점 매장이 들어오는 주문을 확인하고 처리하는 운영 앱입니다.',
      en: 'An operational app for Wolt merchants to receive and manage orders.',
    },
    adoption: {
      ko: 'iPad용 매장 앱을 iOS·Android 여러 화면으로 넓힌 Flutter 사례입니다.',
      en: 'Flutter expanded the merchant app from iPad to additional iOS and Android screens.',
    },
    source: {
      title: 'Wolt',
      url: 'https://flutter.dev/showcase/wolt',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://play-lh.googleusercontent.com/tFHzAO9jbkssc1WejX5Sbda6DZU-LbcLlSZ3fkGxhp_Hl3anSBQIfngLF7ICFVULlzuIWkRdBlWA9X8JIa_eMg',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.wolt.picker&hl=en',
  },
  {
    id: 'down-dog',
    name: 'Down Dog',
    publisher: 'Yoga Buddhi',
    technology: 'kmp',
    category: 'health',
    scope: 'shared-logic',
    description: {
      ko: '사용자가 설정한 조건에 따라 요가 연습 구성을 만들어 주는 앱입니다.',
      en: "An app that generates yoga practices based on a user's chosen preferences.",
    },
    adoption: {
      ko: 'iOS·Android·웹에서 운동 구성 등 공통 코드를 Kotlin Multiplatform으로 공유합니다.',
      en: 'Shares code, including practice-generation logic, across iOS, Android and web with KMP.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/down-dog/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.downdogapp.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a0/ec/2c/a0ec2c9d-9b74-523c-7cdb-445ee79907a0/Original-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/yoga-down-dog/id983693694?uo=4',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    publisher: 'Phantom',
    technology: 'react-native',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '사용자가 디지털 자산과 온체인 서비스를 이용하는 암호화폐 지갑입니다.',
      en: 'A crypto wallet for accessing digital assets and on-chain services.',
    },
    adoption: {
      ko: 'RN·Expo 모노레포에서 모바일과 다른 제품의 로직·UI 일부를 공유합니다.',
      en: 'Its RN and Expo monorepo shares portions of logic and UI across mobile and other products.',
    },
    source: {
      title: 'Using Expo at Phantom — Expo',
      url: 'https://expo.dev/customers/phantom',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://phantom.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/de/04/e8/de04e88f-2cf8-0579-0b3f-76eee94a5c00/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/phantom-trading-wallet/id1598432977?uo=4',
  },
  {
    id: 'xiaomi-ev',
    name: 'Xiaomi EV',
    publisher: 'Xiaomi',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '샤오미 전기차의 상태 확인과 원격 제어, 차량 커뮤니티를 연결하는 앱입니다.',
      en: 'A companion app for Xiaomi EV status, remote controls and vehicle communities.',
    },
    adoption: {
      ko: 'Xiaomi SU7 동반 앱의 Flutter 도입 사례로, 모든 Xiaomi 앱을 뜻하지 않습니다.',
      en: 'The case covers the Xiaomi SU7 companion app, not all Xiaomi applications.',
    },
    source: {
      title: 'Xiaomi',
      url: 'https://flutter.dev/showcase/xiaomi',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.xiaomiev.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/97/3b/5b/973b5b97-35e1-00ba-3d89-9e779c48f44f/AppIcon-0-0-1x_U007emarketing-0-8-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl:
      'https://apps.apple.com/cn/app/%E5%B0%8F%E7%B1%B3%E6%B1%BD%E8%BD%A6/id6473663234',
  },
  {
    id: '9gag',
    name: '9GAG',
    publisher: '9GAG',
    technology: 'kmp',
    category: 'social',
    scope: 'shared-logic',
    description: {
      ko: '유머 이미지와 영상 등 이용자 콘텐츠를 발견하고 공유하는 커뮤니티입니다.',
      en: 'A community for discovering and sharing humor, images and videos.',
    },
    adoption: {
      ko: 'KMP를 점진적으로 도입한 모바일 사례.',
      en: 'A case of incremental mobile KMP adoption.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://9gag.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/O3exMzvq4XfEBBr96KeMynd3E30tk4xPGcnYrQGrHtBZAVUgOIEHMqTA7hU_VHniqTO1wIZu5d7wPb4xxDA5F5U',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.ninegag.android.app',
  },
  {
    id: 'partiful',
    name: 'Partiful',
    publisher: 'Partiful',
    technology: 'react-native',
    category: 'social',
    scope: 'app',
    description: {
      ko: '초대장을 만들고 참석자를 모아 오프라인 모임을 준비하는 서비스입니다.',
      en: 'A social planning app for creating invitations and bringing people together offline.',
    },
    adoption: {
      ko: 'RN·Expo로 여러 플랫폼의 이벤트 경험을 개발한 사례입니다.',
      en: 'A cross-platform event-planning experience developed with RN and Expo.',
    },
    source: {
      title: 'Using Expo at Partiful — Expo',
      url: 'https://expo.dev/customers/partiful',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://partiful.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c9/45/dc/c945dc06-d1ff-c2b9-3864-57fa923d3aaa/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/partiful-party-invite-maker/id1662982304?uo=4',
  },
  {
    id: 'virgin-money',
    name: 'Virgin Money',
    publisher: 'Virgin Money',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '고객이 모바일에서 계좌와 금융 상품을 관리하는 뱅킹 서비스입니다.',
      en: 'A banking service for managing accounts and financial products on mobile.',
    },
    adoption: {
      ko: '분리된 금융 상품 앱과 플랫폼별 개발을 통합하기 위해 Flutter를 선택했습니다.',
      en: 'Selected Flutter to unify development across separate financial-product apps and platforms.',
    },
    source: {
      title: 'Virgin Money',
      url: 'https://flutter.dev/showcase/virgin-money',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://uk.virginmoney.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f9/38/39/f938396f-d3c8-85ac-ee0d-c674a9f8361f/AppIcon-1x_U007epad-0-1-sRGB-85-220-0.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/gb/app/virgin-money-mobile-banking/id1482269155?uo=4',
  },
  {
    id: 'fastwork',
    name: 'Fastwork',
    publisher: 'Fastwork',
    technology: 'kmp',
    category: 'commerce',
    scope: 'shared-logic',
    description: {
      ko: '기업과 프리랜서를 연결해 전문 서비스를 거래하는 동남아시아 플랫폼입니다.',
      en: 'A Southeast Asian marketplace connecting businesses with freelance professionals.',
    },
    adoption: {
      ko: 'UI는 분리하고 도메인·데이터 계층의 비즈니스 로직과 API 코드를 공유합니다.',
      en: 'Keeps UI separate while sharing business logic and API code in domain and data layers.',
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/fastwork/',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://fastwork.co/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c8/69/ed/c869ed70-b3e6-bdcd-fde3-f3b2131e8c13/AppIcon-0-0-1x_U007ephone-0-11-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/th/app/fastwork-hire-freelancers/id1154830520?uo=4',
  },
  {
    id: 'incident-io',
    name: 'incident.io',
    publisher: 'incident.io',
    technology: 'react-native',
    category: 'developer',
    scope: 'app',
    description: {
      ko: '서비스 장애가 발생했을 때 알림을 받고 대응에 참여하는 업무 도구입니다.',
      en: 'An operational tool for receiving incident alerts and participating in response.',
    },
    adoption: {
      ko: '기존 제품 엔지니어가 RN·Expo로 모바일 앱을 구축한 사례입니다.',
      en: 'Existing product engineers built the mobile application using RN and Expo.',
    },
    source: {
      title: 'Using Expo at incident.io — Expo',
      url: 'https://expo.dev/customers/incident-io',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://incident.io/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ad/21/ec/ad21ec2f-f8f9-78eb-403b-c9543704901c/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/incident-io/id6471268530?uo=4',
  },
  {
    id: 'universal-parks',
    name: 'Universal parks apps',
    publisher: 'Universal Destinations & Experiences',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '테마파크 방문객이 시설과 현장 서비스를 탐색하도록 돕는 앱 사례입니다.',
      en: 'Guest apps helping visitors navigate theme parks and their services.',
    },
    adoption: {
      ko: '공식 사례는 Universal의 방문객용 앱에 Flutter를 활용한 경험입니다.',
      en: "The official case describes Flutter in Universal's guest-facing applications.",
    },
    source: {
      title: 'Universal Studios',
      url: 'https://flutter.dev/showcase/universal-studios',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.universalorlando.com/web/en/us/plan-your-visit/mobile-app',
    imageUrl:
      'https://play-lh.googleusercontent.com/-FVujVhMQOzbvxPbz8uq06Dl_sgTdd_-kgd4wI38HDX6b6BJwmHWgirUAA9SOaEv_kgkCj6XeXf8CHYypTQOhsc',
    imageSourceUrl:
      'https://play.google.com/store/apps/details?id=com.universalstudios.orlandoresort',
  },
  {
    id: 'kuaiying',
    name: '快影 · Kuaiying',
    publisher: 'Kuaishou',
    technology: 'kmp',
    category: 'entertainment',
    scope: 'shared-logic',
    description: {
      ko: '짧은 영상을 편집하고 제작하는 크리에이터용 모바일 도구입니다.',
      en: 'A mobile tool for creators to edit and produce short videos.',
    },
    adoption: {
      ko: 'Kuaiying 팀의 KMP 도입 사례입니다. Kuaishou 그룹 전체 앱의 UI 공유를 의미하지 않습니다.',
      en: "The case concerns Kuaiying's KMP adoption, not shared UI across every Kuaishou product.",
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/59/9e/c9/599ec9f3-3cc6-5cd0-fbf1-503009a19a1f/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl:
      'https://apps.apple.com/cn/app/%E5%BF%AB%E5%BD%B1-%E5%BF%AB%E6%89%8B%E5%AE%98%E6%96%B9ai%E8%A7%86%E9%A2%91%E5%89%AA%E8%BE%91%E5%88%9B%E4%BD%9C%E5%B7%A5%E5%85%B7/id1195860596',
  },
  {
    id: 'cottages-com',
    name: 'cottages.com',
    publisher: 'Awaze',
    technology: 'react-native',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '휴가용 숙소를 예약한 고객이 여행에 필요한 정보를 확인하는 앱입니다.',
      en: 'A guest app for accessing information about a holiday rental stay.',
    },
    adoption: {
      ko: 'Awaze가 RN·Expo 공통 코드로 구축한 세 브랜드 앱 중 하나입니다.',
      en: "One of three branded guest apps built from Awaze's shared RN and Expo codebase.",
    },
    source: {
      title: 'Using Expo at Awaze — Expo',
      url: 'https://expo.dev/customers/awaze',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.cottages.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e5/8e/7e/e58e7e54-f03e-93ff-4777-e698d0dc7237/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/gb/app/cottages-com-holiday-cottages/id6741528848',
  },
  {
    id: 'sozcu',
    name: 'Sözcü',
    publisher: 'Estetik Yayıncılık',
    technology: 'flutter',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '튀르키예의 뉴스와 시사 콘텐츠를 모바일에서 읽는 미디어 앱입니다.',
      en: 'A mobile news app covering current affairs in Türkiye.',
    },
    adoption: {
      ko: 'iOS·Android를 Flutter 공통 코드로 전환하고 광고 연동을 정리한 사례입니다.',
      en: 'Unified iOS and Android with Flutter while streamlining advertising integration.',
    },
    source: {
      title: 'Estetik Yayıncılık',
      url: 'https://flutter.dev/showcase/sozcu',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.sozcu.com.tr/',
    imageUrl:
      'https://play-lh.googleusercontent.com/4qBlzLBBzVxm2YGReY382CAuzGRFQXkFvx5uBQojKHk4iWjKh-rf6s5PKRm2iLpiwZ1H__Qua33MAYZw4TtOuQM',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=org.studionord.sozcu.gazete',
  },
  {
    id: 'baidu-wonder',
    name: 'Wonder by Baidu',
    publisher: 'Baidu',
    technology: 'kmp',
    category: 'utilities',
    scope: 'shared-logic',
    description: {
      ko: '학습과 생활 도구, 콘텐츠 탐색을 결합한 Baidu의 젊은 이용자 대상 앱 사례입니다.',
      en: "Baidu's app case combining learning, everyday tools and content discovery for younger users.",
    },
    adoption: {
      ko: 'Wonder 앱의 데이터·비즈니스 로직을 공유하고 기존 네이티브 UI를 유지했습니다.',
      en: "Shares Wonder's data and business logic while retaining native UI on both mobile platforms.",
    },
    source: {
      title: 'Kotlin case studies',
      url: 'https://kotlinlang.org/case-studies/baidu/',
    },
    reviewedAt: '2026-09-06',
    imageUrl: 'https://img.apk3.com/img2021/12/15/15/2021121599344661_APP.png',
    imageSourceUrl: 'https://www.apk3.com/app/483179.html',
  },
  {
    id: 'business-insider',
    name: 'Business Insider',
    publisher: 'Insider',
    technology: 'react-native',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '경제와 비즈니스, 기술 분야의 뉴스와 분석을 읽는 미디어 앱입니다.',
      en: 'A media app for business, technology and economic reporting.',
    },
    adoption: {
      ko: 'Insider가 별도 네이티브 앱에서 Expo로 전환한 경험을 공개했습니다.',
      en: 'Insider documented its move from separate native applications to Expo.',
    },
    source: {
      title: 'Using Expo at Insider — Expo',
      url: 'https://expo.dev/customers/insider',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.businessinsider.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f5/64/bb/f564bb12-0aaf-477b-df47-29bb15725330/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/business-insider-news-more/id554260576?uo=4',
  },
  {
    id: 'stage',
    name: 'STAGE',
    publisher: 'STAGE',
    technology: 'flutter',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '인도의 지역 언어와 방언으로 만든 영상 콘텐츠를 제공하는 스트리밍 앱입니다.',
      en: 'A streaming service featuring video content in Indian regional languages and dialects.',
    },
    adoption: {
      ko: 'Flutter와 Firebase로 모바일부터 TV까지 여러 플랫폼을 지원한 사례입니다.',
      en: 'Uses Flutter and Firebase to support experiences spanning mobile devices and TV.',
    },
    source: {
      title: 'STAGE',
      url: 'https://flutter.dev/showcase/stage',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.stage.in/',
    imageUrl:
      'https://play-lh.googleusercontent.com/Z-S84mMc8pzsT2uYHOhsNcfyZEiBGjDYXFmt6YUNl89BKmyQgIlsahjtjo5i9rBGG3ENkaqYoGMWRcWQuimz',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=in.stage',
  },
  {
    id: 'lingvano',
    name: 'Lingvano',
    publisher: 'Lingvano',
    technology: 'react-native',
    category: 'education',
    scope: 'app',
    description: {
      ko: '농인 강사의 영상 수업과 상호작용으로 수어를 배우는 학습 앱입니다.',
      en: 'A sign-language learning app with interactive video lessons taught by Deaf instructors.',
    },
    adoption: {
      ko: 'Expo로 iOS·Android·웹 학습 경험을 개발하고 EAS를 활용합니다.',
      en: 'Built with Expo across iOS, Android and web, with EAS supporting delivery.',
    },
    source: {
      title: 'Using Expo at Lingvano — Expo',
      url: 'https://expo.dev/customers/lingvano',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.lingvano.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/izg1IXdCag0to2njdwtKUSDKVY28E02GQD4jxzZz68iMh725rI9joMp8cNf2RAOpacDC58W_meqqT3h2yW6mGYA',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.lingvano.app',
  },
  {
    id: 'lucid',
    name: 'Lucid',
    publisher: 'Lucid Motors',
    technology: 'flutter',
    category: 'travel',
    scope: 'app',
    description: {
      ko: 'Lucid 전기차와 연결해 차량 관련 기능을 이용하는 동반 앱입니다.',
      en: 'A companion application connecting owners with their Lucid electric vehicles.',
    },
    adoption: {
      ko: 'Lucid Air 출시에 맞춰 작은 팀이 Flutter로 iOS·Android 앱을 개발했습니다.',
      en: 'A small team built Flutter apps for iOS and Android alongside the Lucid Air launch.',
    },
    source: {
      title: 'Lucid Motors',
      url: 'https://flutter.dev/showcase/lucid-motors',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://lucidmotors.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3a/62/e7/3a62e703-93cc-1b1c-a3d1-bcf2f40d7a52/Lucid_Bear_V2-0-0-1x_U007ephone-0-0-0-1-0-0-P3-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/lucid-motors/id1579793272?uo=4',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    publisher: 'Bounce',
    technology: 'react-native',
    category: 'travel',
    scope: 'app',
    description: {
      ko: '여행 중 짐을 맡길 보관 장소를 찾고 예약하는 서비스입니다.',
      en: 'A travel service for finding and booking places to store luggage.',
    },
    adoption: {
      ko: 'Expo EAS와 OTA 업데이트를 모바일 지속 배포에 활용합니다.',
      en: 'Uses Expo EAS and OTA updates for continuous mobile delivery.',
    },
    source: {
      title: 'Using Expo at Bounce — Expo',
      url: 'https://expo.dev/customers/bounce',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://bounce.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/-RCdR_cT1Mlq939yom1Rx1an5yazlXi3mqU5mF0OCkjrhA9Fdk7CBK0aHez1JfhYTWJ6AiZgzD_kGeG5kEBwuA',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.usebounce',
  },
  {
    id: 'romwe',
    name: 'ROMWE',
    publisher: 'ROMWE',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '의류와 패션 아이템을 탐색하고 구매하는 쇼핑 앱입니다.',
      en: 'A shopping app for discovering clothing and fashion items.',
    },
    adoption: {
      ko: '공식 사례는 ROMWE의 Flutter 도입입니다. SHEIN 전체 앱에 대한 주장은 아닙니다.',
      en: 'The Flutter case covers ROMWE and does not establish the stack of the entire SHEIN app.',
    },
    source: {
      title: 'Romwe Fashion (SHEIN)',
      url: 'https://flutter.dev/showcase/romwe-fashion-shein',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.romwe.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/neutrU5FMF-yBjZOp6ed0fB-hup-yy7NqXHyaYgm_tTrTlZSD6UrjMveEvQcLBCSVz64_buxTrYnHOhi3fen',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.romwe',
  },
  {
    id: 'mollie',
    name: 'Mollie',
    publisher: 'Mollie',
    technology: 'react-native',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '사업자가 결제 내역을 확인하고 매장의 결제 업무를 관리하는 서비스입니다.',
      en: 'A payments service helping businesses monitor transactions and manage payment operations.',
    },
    adoption: {
      ko: 'RN·Expo 기반으로 모바일·웹과 결제 단말기까지 개발 영역을 확장했습니다.',
      en: 'RN and Expo support mobile and web development as well as a payment terminal application.',
    },
    source: {
      title: 'Using Expo at Mollie — Expo',
      url: 'https://expo.dev/customers/mollie',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.mollie.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/83/23/7c/83237cb7-5a6a-8303-614a-65fb03b4c24e/prod-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/mollie/id1473455257?uo=4',
  },
  {
    id: 'cz',
    name: 'CZ',
    publisher: 'CZ Zorgverzekeringen',
    technology: 'flutter',
    category: 'health',
    scope: 'app',
    description: {
      ko: '보험 가입자가 건강보험 관련 정보를 확인하고 업무를 처리하는 앱입니다.',
      en: 'An app for customers to access health-insurance information and services.',
    },
    adoption: {
      ko: '기존 앱의 품질과 확장성을 개선하기 위해 Flutter로 재구축했습니다.',
      en: 'Rebuilt its existing app with Flutter to improve quality and maintainability.',
    },
    source: {
      title: 'CZ Zorgverzekeringen',
      url: 'https://flutter.dev/showcase/cz-zorgverzekeringen',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.cz.nl/',
    imageUrl:
      'https://play-lh.googleusercontent.com/a6ke2MmX3JuXz-urXz5ha16o9Tnbtok5k4hrBjRG6p6A3EYgYc6riwcTJvOZ7AvkFcGBl-J-rFFlBDWGx1vTTg',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=nl.cz.app',
  },
  {
    id: 'goody',
    name: 'Goody',
    publisher: 'Goody',
    technology: 'react-native',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '개인과 기업이 상황에 맞는 선물을 고르고 전달하는 서비스입니다.',
      en: 'A gifting service for choosing and sending gifts to personal and business contacts.',
    },
    adoption: {
      ko: '초기부터 Expo를 사용해 iOS와 Android의 제품 경험을 함께 개발했습니다.',
      en: 'Used Expo from the outset to develop the iOS and Android product experience together.',
    },
    source: {
      title: 'Using Expo at Goody — Expo',
      url: 'https://expo.dev/customers/goody',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.ongoody.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5a/ce/c1/5acec131-860a-285d-03c7-0597a7a757e1/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/goody-easy-gifting/id1502301646?uo=4',
  },
  {
    id: 'betterment',
    name: 'Betterment',
    publisher: 'Betterment',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '투자와 자산 관리 서비스를 모바일에서 이용하는 금융 앱입니다.',
      en: 'A financial app providing access to investment and money-management services.',
    },
    adoption: {
      ko: '제품 코드베이스를 Flutter로 전환한 경험이 공식 사례로 공개되어 있습니다.',
      en: 'Its migration of the product codebase to Flutter is documented in an official case study.',
    },
    source: {
      title: 'Betterment',
      url: 'https://flutter.dev/showcase/betterment',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.betterment.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/61/16/2f/61162f06-7d49-e441-5757-09ab2a8cddd2/BMT_App_Icon_iOS_Prod-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/betterment-invest-save-money/id393156562',
  },
  {
    id: 'better',
    name: 'Better',
    publisher: 'Better',
    technology: 'react-native',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '주택 금융과 관련된 디지털 서비스를 모바일에서 제공하는 핀테크 사례입니다.',
      en: 'A fintech example bringing digital home-financing services to mobile users.',
    },
    adoption: {
      ko: 'RN 앱에 Expo의 라이브러리와 네이티브 확장 가능한 워크플로를 도입했습니다.',
      en: 'Adopted Expo libraries and a native-extensible workflow within its RN application.',
    },
    source: {
      title: 'Using Expo at Better — Expo',
      url: 'https://expo.dev/customers/better',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://better.com/',
    imageUrl: 'https://media.better.com/better-com/1627660194327/meta/apple-touch-icon.png',
    imageSourceUrl: 'https://better.com/',
  },
  {
    id: 'kijiji',
    name: 'Kijiji',
    publisher: 'Kijiji',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '캐나다 이용자가 중고 물품과 지역 생활 서비스를 찾는 거래 앱입니다.',
      en: 'A Canadian marketplace for secondhand items and local services.',
    },
    adoption: {
      ko: '기능 차이와 기술 부채를 줄이기 위해 네이티브 앱을 Flutter로 전환했습니다.',
      en: 'Migrated native apps to Flutter to reduce feature gaps and accumulated technical debt.',
    },
    source: {
      title: 'Kijiji',
      url: 'https://flutter.dev/showcase/kijiji1',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.kijiji.ca/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/73/d0/b6/73d0b61b-7f56-6d9f-6c50-95e9acf05685/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/ca/app/kijiji-buy-sell-find-deals/id318979520',
  },
  {
    id: 'blackline',
    name: 'BlackLine',
    publisher: 'BlackLine',
    technology: 'react-native',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '기업의 재무·회계 업무를 지원하는 BlackLine의 모바일 제품입니다.',
      en: "The mobile product for BlackLine's enterprise finance and accounting workflows.",
    },
    adoption: {
      ko: '별도 네이티브 앱을 RN으로 전환하고 Expo로 개발·배포 흐름을 정리했습니다.',
      en: 'Replaced separate native apps with RN and streamlined development and releases using Expo.',
    },
    source: {
      title: 'Using Expo at Blackline — Expo',
      url: 'https://expo.dev/customers/blackline',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.blackline.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b0/73/4f/b0734f3c-3719-5d69-1b5b-bc3c1efe395b/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/blackline/id1609332076?uo=4',
  },
  {
    id: 'skandia',
    name: 'Skandia',
    publisher: 'Skandia',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '스웨덴 고객이 계좌와 금융 서비스를 관리하는 모바일 뱅킹 앱입니다.',
      en: 'A mobile banking app for Swedish customers to manage accounts and financial services.',
    },
    adoption: {
      ko: '플랫폼별 기능 차이가 커진 기존 앱을 Flutter로 다시 구축한 사례입니다.',
      en: 'Rebuilt an existing app in Flutter after functionality diverged between platforms.',
    },
    source: {
      title: 'Skandia',
      url: 'https://flutter.dev/showcase/skandia',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.skandia.se/',
    imageUrl:
      'https://play-lh.googleusercontent.com/fEn7X2jHDopMKWs30YZ9errWhbFUnStsw3Zg1zm1V8U4ca8LSDyFNbYk415niTtzXGQNVGTHT9ulRoaHuQO5Zw',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=se.skandiabanken.android.wallet',
  },
  {
    id: 'playon',
    name: 'GoFan',
    publisher: 'PlayOn',
    technology: 'react-native',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '학교와 스포츠 행사에서 티켓 판매와 현장 운영을 지원하는 앱 사례입니다.',
      en: 'Applications supporting ticketing and on-site operations for schools and sports events.',
    },
    adoption: {
      ko: '공개 사례의 범위는 Expo 기반 티켓팅·POS 앱입니다.',
      en: 'The published Expo case specifically covers ticketing and point-of-sale applications.',
    },
    source: {
      title: 'Using Expo at PlayOn — Expo',
      url: 'https://expo.dev/customers/playon',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.playonsports.com/',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/78/86/9f/78869f57-fb3b-9f74-a944-77266ca6ce82/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/gofan-buy-tickets-to-events/id1049091284',
  },
  {
    id: 'caribou-coffee',
    name: 'Caribou Coffee',
    publisher: 'Caribou Coffee',
    technology: 'flutter',
    category: 'commerce',
    scope: 'app',
    description: {
      ko: '커피를 주문하고 브랜드의 모바일 서비스를 이용하는 고객용 앱입니다.',
      en: "A customer app for ordering coffee and accessing the brand's mobile services.",
    },
    adoption: {
      ko: '여러 프레임워크를 비교한 뒤 Flutter 공통 코드베이스로 앱을 전환했습니다.',
      en: 'Compared multiple frameworks before moving to a shared Flutter codebase.',
    },
    source: {
      title: 'Caribou Coffee',
      url: 'https://flutter.dev/showcase/caribou-coffee',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/08/ac/73/08ac7327-f615-d913-8f8d-e19cae300936/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.webp',
    imageSourceUrl: 'https://apps.apple.com/us/app/caribou-coffee/id971358255',
  },
  {
    id: 'cameo',
    name: 'Cameo',
    publisher: 'Cameo',
    technology: 'react-native',
    category: 'entertainment',
    scope: 'app',
    description: {
      ko: '팬이 크리에이터에게 개인화된 영상 메시지를 요청하는 서비스입니다.',
      en: 'A service where fans request personalized video messages from creators.',
    },
    adoption: {
      ko: 'Expo의 RN 패키지와 배포 도구로 모바일 기능 개발을 확장했습니다.',
      en: "Used Expo's RN packages and release tooling to scale mobile feature development.",
    },
    source: {
      title: 'Using Expo at Cameo — Expo',
      url: 'https://expo.dev/customers/cameo',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://play-lh.googleusercontent.com/rtRsGaOrEbC6ZyLHUEkyYWUwZYXnFgNBcLkVpn7Sv9KqodxwwC09m6mGOL9QswqRxPJDU8lVYDXeRCj-jXwHDQ',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.baronapp.cameo',
  },
  {
    id: 'so-vegan',
    name: 'SO VEGAN',
    publisher: 'SO VEGAN',
    technology: 'flutter',
    category: 'health',
    scope: 'app',
    description: {
      ko: '식물성 요리 레시피를 찾아보고 식생활에 활용하는 앱입니다.',
      en: 'An app for discovering plant-based recipes and cooking ideas.',
    },
    adoption: {
      ko: '브랜드 경험을 살린 첫 모바일 앱을 Flutter로 개발했습니다.',
      en: 'Built its first mobile application in Flutter with a focus on the brand experience.',
    },
    source: {
      title: 'So Vegan',
      url: 'https://flutter.dev/showcase/so-vegan',
    },
    reviewedAt: '2026-09-06',
    imageUrl:
      'https://play-lh.googleusercontent.com/7r8rsfQiV9EJGitPmR8EMIxeOEcav8TElNgYt7S4PeKHcmwp6C4nC6j1vCDmbtGwRtBl7KxgHX-9p0GyKjHvOH8',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.wearesovegan.app',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    publisher: 'Bluesky Social',
    technology: 'react-native',
    category: 'social',
    scope: 'app',
    description: {
      ko: '이용자가 피드와 커뮤니티를 선택해 대화를 나누는 소셜 네트워크입니다.',
      en: 'A social network where people choose feeds and communities to follow.',
    },
    adoption: {
      ko: '공개 저장소에서 RN·Expo 기반 iOS·Android·웹 앱 구현을 확인할 수 있습니다.',
      en: 'Its open repository exposes the RN and Expo implementation for iOS, Android and web.',
    },
    source: {
      title:
        'GitHub - bluesky-social/social-app: The Bluesky Social application for Web, iOS, and Android · GitHub',
      url: 'https://github.com/bluesky-social/social-app',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://bsky.app/',
    imageUrl:
      'https://play-lh.googleusercontent.com/54eUk_UXr65meQqoOIMXAnuNIyLOuznb-Ad19ZytLq7nBqSaeF0fefspnZkDSKbbZASMSpKaAUCSGD_c0eliSRM',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=xyz.blueskyweb.app',
  },
  {
    id: 'reflection',
    name: 'Reflection',
    publisher: 'Reflection.app',
    technology: 'flutter',
    category: 'health',
    scope: 'app',
    description: {
      ko: '일상의 생각과 감정을 글로 남기고 돌아보는 저널링 앱입니다.',
      en: 'A journaling app for recording and reflecting on everyday thoughts and feelings.',
    },
    adoption: {
      ko: '웹 중심 서비스에서 Flutter로 iOS·Android·웹 공통 구현을 만든 사례입니다.',
      en: 'Moved from a web-first service to a Flutter implementation shared across mobile and web.',
    },
    source: {
      title: 'Reflection.app',
      url: 'https://flutter.dev/showcase/reflectionapp',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.reflection.app/',
    imageUrl:
      'https://play-lh.googleusercontent.com/4UHVuzkgdJXsgX0y7dSXDAh4CpXL6YuGmKC0jTigODA96JFMqsSty1jt4yDkmTT_QLgy20DXVPvPpnBrXZE51A',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=app.reflection.reflection',
  },
  {
    id: 'superlist',
    name: 'Superlist',
    publisher: 'Superlist',
    technology: 'flutter',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '개인 할 일과 팀의 작업을 함께 정리하는 업무 관리 앱입니다.',
      en: 'A work-management app combining personal to-dos and team tasks.',
    },
    adoption: {
      ko: 'Flutter 공식 사례는 여러 플랫폼의 작업 관리 경험을 구축한 과정을 소개합니다.',
      en: 'The official Flutter case covers building its task-management experience across platforms.',
    },
    source: {
      title: 'Superlist',
      url: 'https://flutter.dev/showcase/superlist',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.superlist.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/-fIAP4PsvfDpljW19_q3lklL2Sf6Nmwlyr22filS3tvM0JOTDsO-gG7eXB7mwM6FMgwor1Y5b1xE7bnBi954ow',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.superlist.superlist',
  },
  {
    id: 'rows',
    name: 'Rows',
    publisher: 'Rows',
    technology: 'flutter',
    category: 'productivity',
    scope: 'app',
    description: {
      ko: '팀이 데이터를 다루고 협업할 수 있도록 만든 스프레드시트 도구입니다.',
      en: 'A spreadsheet tool designed for teams to work with data together.',
    },
    adoption: {
      ko: 'Flutter를 활용한 스프레드시트 제품 개발 사례입니다.',
      en: 'A published case of using Flutter to develop a spreadsheet product.',
    },
    source: {
      title: 'Rows',
      url: 'https://flutter.dev/showcase/rows',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://rows.com/',
    imageUrl: 'https://rows.com/favicons/apple-touch-icon.png?v=1',
    imageSourceUrl: 'https://rows.com/',
  },
  {
    id: 'rive',
    name: 'Rive',
    publisher: 'Rive',
    technology: 'flutter',
    category: 'developer',
    scope: 'app',
    description: {
      ko: '앱과 웹에 쓰이는 인터랙티브 애니메이션을 제작하는 디자인 도구입니다.',
      en: 'A design tool for creating interactive animations for applications and websites.',
    },
    adoption: {
      ko: '사례는 Flutter로 재작성한 Rive 편집 도구입니다. Rive 런타임 사용 앱을 모두 Flutter로 분류하지 않습니다.',
      en: 'The case concerns the Rive editor rewrite, not every application embedding a Rive runtime.',
    },
    source: {
      title: 'Rive',
      url: 'https://flutter.dev/showcase/rive',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://rive.app/',
    imageUrl:
      'https://framerusercontent.com/images/5WNUOLDFjvpqT7O9s67mXZ8Kv3o.png?width=1024&height=1024',
    imageSourceUrl: 'https://www.rive.app/downloads',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    publisher: 'Nubank',
    technology: 'flutter',
    category: 'finance',
    scope: 'app',
    description: {
      ko: '고객이 휴대전화에서 금융 생활을 관리하도록 돕는 디지털 은행입니다.',
      en: 'A digital bank helping customers manage their financial lives on mobile.',
    },
    adoption: {
      ko: '기존 앱에 점진적으로 도입할 공통 모바일 개발 기반으로 Flutter를 선택했습니다.',
      en: 'Selected Flutter as a shared mobile foundation that could be introduced incrementally.',
    },
    source: {
      title: 'Nubank',
      url: 'https://flutter.dev/showcase/nubank',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://nubank.com.br/',
    imageUrl:
      'https://play-lh.googleusercontent.com/FP6PILGwB6hrdvwg_mE8H1MKi2AcRDbHJcdg7WMfjiHbs4-ZZhYSMtgibkpeakstu1UeNHL4TGCo1l0mV2qkQa4',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.nu.production',
  },
  {
    id: 'xianyu',
    name: '闲鱼 · Xianyu',
    publisher: 'Alibaba Group',
    technology: 'flutter',
    category: 'commerce',
    scope: 'features',
    description: {
      ko: '중고 물품을 사고팔며 취향에 맞는 상품을 발견하는 중국의 거래 앱입니다.',
      en: 'A Chinese secondhand marketplace for buying, selling and discovering items.',
    },
    adoption: {
      ko: 'Alibaba의 Xianyu 앱에서 Flutter를 도입한 사례이며 그룹 전체 앱을 뜻하지 않습니다.',
      en: "The Flutter case concerns Alibaba's Xianyu application, not every app in the group.",
    },
    source: {
      title: 'Alibaba Group',
      url: 'https://flutter.dev/showcase/alibaba-group',
    },
    reviewedAt: '2026-09-06',
    websiteUrl: 'https://www.goofish.com/',
    imageUrl:
      'https://play-lh.googleusercontent.com/yEyIAHHM8m7l_bFfVxhVfxTXsAf0ekrnCnxKk6_d-Swsu19rTx4yq-u6rIYdLNS6JJ1j6Kzm6qg4_6AEtJtKhQ',
    imageSourceUrl: 'https://play.google.com/store/apps/details?id=com.taobao.idlefish',
  },
];
