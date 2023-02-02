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
      <header className={classnames("hero hero--primary", styles.heroBanner)} style={{ backgroundColor: '#24272D' }}>
        <img src='img/hero.svg' alt='hero' style={{
          width: '100%',
          minHeight: '100%',
          objectFit: 'cover',
        }}/>
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
              React Native, React and more
            </Translate>
          </p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--primary button--lg",
                styles.takeatour
              )}
              to={useBaseUrl("/docs/current/introduction")}
            >
              <Translate
                id="homepage.takeatour"
                description="homepage.takeatour description"
              >
                Take a tour
              </Translate>
            </Link>
          </div>
        </div>
        <div className={styles.newsSection}>
          <p className={styles.newsTitle} style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
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
              The meetup is scheduled for Wednesday, Feb 22th from 7:30pm to 9:50pm.
              You can [apply for the meetup](https://www.meetup.com/ko-KR/crossplatformkorea/
              events/291351883).

              On the day, there will be a presentation on Flutter Application with GetX pattern and networking by group. While networking, you will be able to freely talk, set missions, and contribute to future meetups.
              Any activity is irrelevant as long as the mission is to share cross-platform knowledge to community. I would appreciate it if you could confirm with the operator in advance.

              Please apply for the meetup through the [Apply] button below 👍
              </Translate>
          </p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.takeatour
              )}
              to={'https://www.meetup.com/ko-KR/crossplatformkorea/events/291351883'}
              // to={useBaseUrl("/blog/20221114-meetup")}
            >
              <Translate
                id="homepage.apply"
                description="homepage.apply description"
              >
                Apply
              </Translate>
            </Link>
          </div>
        </div>
        <div className={styles.newsContent}>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
