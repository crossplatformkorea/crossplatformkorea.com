/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Translate, { translate } from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import React, { useEffect } from "react";
import classnames from "classnames";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import AdFit from "../uis/AdFit";
import { useMediaQuery } from "react-responsive";
import AdFitMobileBanner from "../uis/AdFitMobileBanner";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;

  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  return (
    <Layout
      // @ts-ignore
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8181493727238996"
          crossOrigin="anonymous"
        />
      </Head>
      <header
        className={classnames("hero hero--primary", styles.heroBanner)}
        style={{ backgroundColor: "#24272D" }}
      >
        <img
          src="img/hero.svg"
          alt="hero"
          style={{
            width: "100%",
            minHeight: "100%",
            objectFit: "cover",
          }}
        />
      </header>
      <main>
        <div className={styles.heroSection}>
          <h1 className="hero__title">
            <Translate id="homepage.title" description="homepage.title title">
              Cross-Platform Korea
            </Translate>
          </h1>
          <p className="hero__subtitle">
            <Translate
              id="homepage.description"
              description="homepage.description description"
            >
              React Native, Flutter, MAUI and related technologies, etc.
            </Translate>
          </p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--primary button--lg",
                styles.beSpeaker
              )}
              to={useBaseUrl("docs/current/speaker")}
            >
              <Translate
                id="homepage.beSpeaker"
                description="homepage.beSpeaker description"
              >
                Be our speaker
              </Translate>
            </Link>
          </div>
          {isMobile ? (
            <div>
              <AdFit
                unit="DAN-YpcHf9p49U5ykXi8"
                height={100}
                width={320}
                className="adfit-top-mobile"
                style={{
                  flex: 1,
                  marginTop: 48,
                }}
              />
            </div>
          ) : null}

          {!isMobile ? (
            <div>
              <AdFit
                unit="DAN-Ms5Vd3oUzsV5SwKQ"
                height={90}
                width={728}
                className="adfit-top"
                style={{
                  flex: 1,
                  marginTop: 48,
                  display: !isMobile ? "flex" : "none",
                }}
              />
            </div>
          ) : null}
        </div>
        <div className={styles.newsSection}>
          <p
            className={styles.newsTitle}
            style={{ fontSize: "1.8em", fontWeight: "bold" }}
          >
            <Translate
              id="homepage.news.title"
              description="homepage.news title"
            >
              Upcoming News
            </Translate>
          </p>
          <div className={styles.newsDescription}>
            밋업에서 발표자를 모집하고 있습니다. 편안한 분위기에서 재미있는 주제로 이야기를 나눠요.<br />
            발표자께는 20만원 상당의 발표비 지급 기회가 제공되며 발표 시간은 30~80분 자유롭게 준비하시면 됩니다.<br />
            원할한 밋업이 진행 될 수 있도록 많은 참여 바랍니다.
            <p>
            <br />
            <Link
              className={classnames(
                "button button--outline button--primary button--lg",
                styles.beSpeaker
              )}
              to={"docs/current/speaker"}
            >
              스피커 신청 바로가기
            </Link>
            </p>
            <br />
            차후 일정: 6월 26일 수요일 오후 7시 30분 ~ 8시 30분, 네트워킹 8시 45분 ~
            <br />
            장소: 서울시 강남구 테헤란로 501 브이플렉스 건물 1층에서
            안내 드립니다. 밋업 링크는 조만간 공지드리겠습니다.
            {/* <p style={{
              fontSize: 20,
              textDecoration: 'underline',
              textDecorationColor: 'blueviolet',
            }}>
              <a href="">밋업 링크</a>
            </p> */}
            <br />
            <br />
          </div>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.beSpeaker
              )}
              to={"docs/current/news"}
            >
              <Translate
                id="homepage.recentNews"
                description="homepage.recentNews description"
              >
                Recent News
              </Translate>
            </Link>
            {/* <div style={{ width: 12 }} />
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.beSpeaker
              )}
              to={
                "https://www.meetup.com/crossplatformkorea/events/293904379"
              }
            >
              <Translate
                id="homepage.apply"
                description="homepage.apply description"
              >
                Apply for meetup
              </Translate>
            </Link> */}
          </div>

          <AdFitMobileBanner
            unit="DAN-madoZ3R52KRmyt95"
            height={250}
            width={300}
            className="adfit-bottom-1"
            style={{ marginTop: 48 }}
          />
        </div>
      </main>
    </Layout>
  );
}

export default Home;
