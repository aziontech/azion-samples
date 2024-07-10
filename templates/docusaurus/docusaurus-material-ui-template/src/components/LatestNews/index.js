// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import TagsListInline from '@theme/TagsListInline';

import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Box,
  Button,
  AvatarGroup,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

function RecentBlogPostCard({ recentPost }) {
  const { blogData } = recentPost;

  return (
    <Grid2 xs={12} sm={6} sx={{ display: 'flex' }}>
      <Card sx={{ backgroundImage: 'unset', backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Link to={blogData.metadata.permalink} className="blog-card__image-link">
          <CardMedia
            component="img"
            height="auto"
            width={500}
            image={useBaseUrl(blogData.metadata.frontMatter.image)}
            alt={blogData.metadata.title}
            loading="lazy"
            title={blogData.metadata.title}
            className="blog-card__image"
          />
        </Link>
        <Link to={blogData.metadata.permalink} className="blog-link">
          <CardContent className="blog-card__title">{blogData.metadata.title}</CardContent>
        </Link>
        <CardContent className="blog-card__description">
          <Typography variant="body2" color="text.secondary">
            {blogData.metadata.description}
          </Typography>
        </CardContent>
        <CardHeader
          avatar={
            <AvatarGroup total={blogData.metadata.authors.length}>
              {blogData.metadata.authors.map((author, index) => (
                <Link href={author.url} title={author.name} key={index}>
                  <Avatar alt={author.name} src={useBaseUrl(author.imageURL)} />
                </Link>
              ))}
            </AvatarGroup>
          }
          subheader={
            <>
              <span>{new Date(blogData.metadata.date).toLocaleDateString()}</span> •
              <span> {Math.ceil(blogData.metadata.readingTime)} min reads</span>
            </>
          }
        />
        <CardActions disableSpacing style={{ margin: '0 8px 10px' }} className="blog-card__tags">
          {blogData.metadata.tags.length > 0 ? <TagsListInline tags={blogData.metadata.tags} /> : null}
        </CardActions>
      </Card>
    </Grid2>
  );
}

export default function LatestNews({ homePageBlogMetadata, recentPosts }) {
  return (
    <Container className="margin-bottom--xl" sx={{ overflowX: 'hidden' }}>
      <Typography variant="h2" className="section-block__heading">
        {homePageBlogMetadata.blogTitle}
      </Typography>
      <Typography variant="body1" className="section-block__description">
        {homePageBlogMetadata.blogDescription}
      </Typography>
      <Grid2 container spacing={5} className="blog">
        {recentPosts.map((recentPost, index) => (
          <RecentBlogPostCard key={index} recentPost={recentPost} />
        ))}
      </Grid2>
      <Box className="text--center margin-top--lg">
        <Link to={homePageBlogMetadata.path}>
          <Button variant="outlined">See all</Button>
        </Link>
      </Box>
    </Container>
  );
}
