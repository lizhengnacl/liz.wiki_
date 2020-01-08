import React from 'react';
import {MDXProvider} from '@mdx-js/tag';
import formatDate from 'date-fns/format';
import {useAmp} from 'next/amp';

import Head from '~/components/layout/head';
import Layout from '~/components/layout/layout';
import Wrapper from '~/components/layout/wrapper';
import ContentFooter from '~/components/layout/content-footer';
import Heading from '~/components/text/linked-heading';
import components from '~/lib/mdx-components';
import {H1, H2, H3, H4, H5, P} from '~/components/text';
import {Avatar} from '~/components/avatar';
import HR from '~/components/text/hr';
import {FooterFeedback} from '~/components/feedback-input';
import DeployBanner from '~/components/deploy-banner';
import Main from '~/components/layout/main';
import DocsRuntime from '~/lib/api/runtime';
import Sidebar from '~/components/layout/sidebar';
import DocsIndex from '~/components/layout/index';
import getHref from '~/lib/api/get-href';
import scrollToElement from '~/lib/utils/scroll-to-element';
import {HEADER_HEIGHT} from '~/lib/constants';
import Content from '~/components/layout/content';
import Context from '~/lib/api/slugs-context';
import getFragment from '~/lib/api/get-fragment';
import * as bodyLocker from '~/lib/utils/body-locker';
import SectionIndex from './index/section-index';

// import GrammarTutorial from '~/pages/guides/grammar-tutorial.mdx'

const DocH2 = ({children}) => (
  <>
    <Heading lean offsetTop={175}>
      <H2>{children}</H2>
    </Heading>
    <style jsx>{`
      :global(h2) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
);

const DocH3 = ({children}) => (
  <>
    <Heading lean offsetTop={175}>
      <H3>{children}</H3>
    </Heading>
    <style jsx>{`
      :global(h3) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
);

const DocH4 = ({children}) => (
  <>
    <Heading lean offsetTop={175}>
      <H4>{children}</H4>
    </Heading>
    <style jsx>{`
      :global(h4) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
);

class Guide extends React.PureComponent {
  state = {
    activeCategory: 'introduction',
    activeSection: 'introduction',
    activeEntry: null,
    navigationActive: false,
    // version: this.props.router.asPath.split(/(v[0-9])/)[1] || 'v2',
  };

  handleSidebarRef = node => {
    this.sidebarNode = node;
  };

  handleEntryActive = entryNode => {
    scrollToElement(this.sidebarNode, entryNode);
  };

  handleSectionActive = sectionNode => {
    if (!this.state.activeEntry) {
      scrollToElement(this.sidebarNode, sectionNode);
    }
  };

  handleIndexClick = () => {
    if (this.state.navigationActive) {
      bodyLocker.unlock();
      this.setState({
        navigationActive: false,
      });
    }
  };

  updateActive = ({category = null, section = null, entry = null}) => {
    if (
      this.state.activeCategory !== category ||
      this.state.activeSection !== section ||
      this.state.activeEntry !== entry
    ) {
      this.setState({
        activeCategory: category,
        activeSection: section,
        activeEntry: entry,
      });
    }
  };

  setInitiallyActive = ({href, category = null, section = null, entry = null}) => {
    // if (this.props.router.asPath.endsWith(href)) {
    //   this.updateActive({category, section, entry});
    // }
  };

  render() {
    const {navigationActive} = this.state;
    const {
      meta = {
        title: 'Now Documentation',
        description:
          'The knowledge base and documentation for how to use ZEIT Now and how it works.',
      },
    } = this.props;

    const active = {
      category: this.state.activeCategory,
      section: this.state.activeSection,
      entry: this.state.activeEntry,
    };

    return (
      <MDXProvider
        components={{
          ...components,
          h2: DocH2,
          h3: DocH3,
          h4: DocH4,
        }}
      >
        <Layout>
          <Head
            titlePrefix=""
            titleSuffix=" - liz.wiki"
            title={`${meta.title}`}
            description={meta.description}
            image={meta.image}
          />

          {
            meta.toc !== undefined && <DocsRuntime docs={this.props.children}>
              {({structure}) => (
                <Main>
                  <Sidebar
                    active={navigationActive}
                    innerRef={this.handleSidebarRef}
                    fixed
                  >
                    <DocsIndex
                      spread={meta.toc.spread}
                      activeItem={active}
                      getHref={getHref}
                      onEntryActive={this.handleEntryActive}
                      onSectionActive={this.handleSectionActive}
                      onClickLink={this.handleIndexClick}
                      structure={structure}
                      updateActive={this.updateActive}
                      setInitiallyActive={this.setInitiallyActive}
                    />
                  </Sidebar>

                  <Content>
                    <div className="content">
                      <div>
                        {structure.map(category => {
                          const categorySlugs = {category: category.slug};
                          return (
                            <div
                              className="category-wrapper"
                              key={getFragment(categorySlugs)}
                            >
                              <span id={getFragment(categorySlugs)}/>
                              <Context.Provider
                                value={{
                                  slugs: categorySlugs,
                                  // testingToken,
                                  updateActive: this.updateActive,
                                }}
                              >
                                {category.content}
                              </Context.Provider>

                              {category.sections.map(section => {
                                const sectionSlugs = {
                                  category: category.slug,
                                  section: section.slug,
                                };

                                return (
                                  <div
                                    className="section-wrapper"
                                    key={getFragment(sectionSlugs)}
                                  >
                                    <span id={getFragment(sectionSlugs)}/>
                                    <Context.Provider
                                      value={{
                                        slugs: sectionSlugs,
                                        // testingToken,
                                        updateActive: this.updateActive,
                                      }}
                                    >
                                      {section.content}
                                    </Context.Provider>
                                    <div>
                                      {section.entries.map(entry => {
                                        const entrySlugs = {
                                          category: category.slug,
                                          section: section.slug,
                                          entry: entry.slug,
                                        };

                                        return (
                                          <div
                                            className="entry-wrapper"
                                            key={getFragment(entrySlugs)}
                                          >
                                            <span id={getFragment(entrySlugs)}/>
                                            <Context.Provider
                                              value={{
                                                slugs: entrySlugs,
                                                // testingToken,
                                                updateActive: this.updateActive,
                                              }}
                                            >
                                              {entry.content}
                                            </Context.Provider>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Content>
                </Main>
              )}
            </DocsRuntime>
          }

          {
            meta.toc === undefined && <article>
              <header className="guide-heading content-heading">
                <Wrapper width="900">
                  <H1>{meta.title}</H1>
                  <P>{meta.description}</P>
                </Wrapper>
              </header>

              <Wrapper width="768">
                <section className="guide content">
                  {meta.example && meta.demo && (
                    <DeployBanner example={meta.example} demo={meta.demo}/>
                  )}
                  {this.props.children}
                </section>
              </Wrapper>
            </article>
          }


          <style jsx>{`
            .guide {
              width: 100%;
              padding-bottom: 96px;
              padding-top: 32px;
              display: flex;
              flex-direction: column;
            }

            .guide-heading {
              border-bottom: 1px solid #eaeaea;
              padding-top: 24px;
              padding-bottom: 44px;
              text-align: center;
            }

            .guide-meta {
              margin-top: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .guide-meta :global(.avatar-group) {
              width: auto;
              margin-right: 16px;
            }

            .guide-author :global(h5) {
              margin-top: 0;
            }

            .authors-list {
              display: flex;
              flex-flow: row wrap;
            }

            .author-info {
              display: flex;
              align-items: center;
              margin-right: 24px;
              font-size: var(--font-size-primary);
              line-height: var(--line-height-primary);
              margin-bottom: 8px;
            }

            .author-info :global(.avatar) {
              margin-right: 8px;
            }

            .published {
              color: #666;
              font-size: var(--font-size-primary);
              line-height: var(--line-height-primary);
              margin-top: 24px;
              display: block;
            }

            .guide-heading :global(h1) {
              margin-bottom: 8px;
            }

            .guide-heading :global(p) {
              font-size: 16px;
              margin-top: 8px;
              color: #444444;
            }

            .rate-guide :global(h5) {
              margin: 0;
              display: inline-block;
            }

            .rate-guide :global(.feedback) {
              display: inline-flex;
              margin-left: 24px;
            }

            @media (max-width: 552px) {
              .rate-guide :global(h5) {
                display: block;
                margin-bottom: 32px;
              }

              .rate-guide :global(.feedback) {
                margin-left: 0;
              }
            }
            
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }

            .category-wrapper:not(:first-child) {
              padding: 40px 0;
            }

            .category-wrapper:first-child :global(h1) {
              margin-top: 0;
            }

            .category-wrapper:not(:last-child) {
              border-bottom: 1px solid #eaeaea;
            }

            .category-wrapper:last-child {
              padding-bottom: 0;
            }

            .category-wrapper,
            .section-wrapper,
            .entry-wrapper {
              position: relative;
            }

            .entry-wrapper > :global(*:last-child) {
              margin-bottom: 0;
            }

            span {
              position: absolute;
              top: -${HEADER_HEIGHT + 24}px;
            }

            .platform-select-title {
              font-size: var(--font-size-primary);
              line-height: var(--line-height-primary);
              font-weight: bold;
              margin-bottom: 16px;
              margin-top: 0;
            }

            .select-wrapper :global(.select) {
              width: 100%;
            }

            .toggle-group-wrapper {
              display: none;
            }

            @media screen and (max-width: 950px) {
              .toggle-group-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 40px;
              }
            }
          `}</style>
        </Layout>
      </MDXProvider>
    );
  }
}

export default Guide;
