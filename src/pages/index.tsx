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
import React from "react";
import classnames from "classnames";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
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
            7월에는 블록체인 특별 행사가 있습니다. 주제: AI 시대, 블록체인이 왜
            필요할까?
            <br />
            일정: 7월 19 (수) 오후 7시부터 9시 (2시간)
            <br />
            장소: 강남구 봉은사로 227 우정타워
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
          <div style={{ height: 12 }} />
        </div>
      </main>
    </Layout>
  );
}

export default Home;
