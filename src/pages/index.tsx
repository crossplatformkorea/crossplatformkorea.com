/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Translate, { translate } from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import React from "react";
import classnames from "classnames";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Feature({ key, imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div key={key} className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  return (
    <Layout
      // @ts-ignore
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
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
          <p className={styles.newsDescription}>
            <Translate
              id="homepage.news.description"
              description="homepage.news description"
            >
              The meetup is scheduled for Wednesday, March 29th from
              7:30-9:40pm. We brought in a special speaker for the current
              month. Check out the meetup and speakers through [Community] ???
              [Recent News].
            </Translate>
          </p>
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
            <div style={{width: 12}}/>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.beSpeaker
              )}
              to={
                "https://www.meetup.com/ko-KR/crossplatformkorea/events/291975474"
              }
              // to={useBaseUrl("/blog/20221114-meetup")}
            >
              <Translate
                id="homepage.apply"
                description="homepage.apply description"
              >
                Apply for meetup
              </Translate>
            </Link>
          </div>
          <div style={{height: 12}}/>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
