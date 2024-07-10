// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import Image from '@theme/IdealImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { Box, Typography } from '@mui/material';
import { BlogPagination } from '../BlogPagination';

function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogHomepageBanner(props) {
  const blogMetadata = props.metadata;
  const imageDefault = {
    urlBannerBg:
      'https://res.cloudinary.com/thanhnam/image/upload/v1696174608/thanhnamnguyen.dev/blog/blog-banner_othakp.png',
    urlAvatar:
      'https://res.cloudinary.com/thanhnam/image/upload/v1715137157/project/docusaurus-material-ui-template/logo_wnw5lv.png',
  };

  return (
    <div className="blog">
      <div className="blog-banner-wrapper">
        <Image img={useBaseUrl(imageDefault.urlBannerBg)} alt="Blog banner" className="blog-banner-bg" loading="lazy" />
        <Image
          img={useBaseUrl(imageDefault.urlAvatar)}
          alt="avatar blog"
          className="blog-avatar"
          width={100}
          height={100}
          loading="lazy"
        />
      </div>
      <Box sx={{ marginTop: '100px' }}>
        <Typography variant="h2" className="section-block__heading">
          {blogMetadata.blogTitle}
        </Typography>
        <Typography variant="body1" className="section-block__description">
          {blogMetadata.blogDescription}
        </Typography>
      </Box>
    </div>
  );
}

function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props;

  return (
    <BlogLayout sidebar={sidebar}>
      <BlogHomepageBanner {...props} />
      <BlogPostItems items={items} />
      <BlogPagination metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
