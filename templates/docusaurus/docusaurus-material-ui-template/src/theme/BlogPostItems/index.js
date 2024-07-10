// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BlogPostItem from '@theme/BlogPostItem';
import TagsListInline from '@theme/TagsListInline';

import { Typography, Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, AvatarGroup } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export default function BlogPostItems({ items, component: BlogPostItemComponent = BlogPostItem }) {
  return (
    <Grid2 container spacing={5} className="blog blog-homepage blog-card">
      {items.map((blog) => (
        <Grid2 xs={12} sm={6} sx={{ display: 'flex' }} key={blog.content.metadata.permalink}>
          <Card sx={{ backgroundImage: 'unset', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Link to={blog.content.metadata.permalink}>
              <CardMedia
                component="img"
                height="auto"
                width={500}
                image={useBaseUrl(blog.content.metadata.frontMatter.image)}
                alt={blog.content.metadata.title}
                loading="lazy"
                title={blog.content.metadata.title}
                className="blog-card__image"
              />
            </Link>
            <Link to={blog.content.metadata.permalink} className="blog-link">
              <CardContent className="blog-card__title">{blog.content.metadata.title}</CardContent>
            </Link>
            <CardContent className="blog-card__description">
              <Typography variant="body2" color="text.secondary">
                {blog.content.metadata.description}
              </Typography>
            </CardContent>
            <CardHeader
              avatar={
                <AvatarGroup total={blog.content.metadata.authors.length}>
                  {blog.content.metadata.authors.map((author, index) => (
                    <Link href={author.url} title={author.name} key={index}>
                      <Avatar alt={author.name} src={useBaseUrl(author.imageURL)} />
                    </Link>
                  ))}
                </AvatarGroup>
              }
              title={
                <>
                  <span>{new Date(blog.content.metadata.date).toLocaleDateString()}</span> •
                  <span> {Math.ceil(blog.content.metadata.readingTime)} min reads</span>
                </>
              }
            />

            <CardActions disableSpacing style={{ margin: '0 8px 10px' }} className="blog-card__tags">
              {blog.content.metadata.tags.length > 0 ? <TagsListInline tags={blog.content.metadata.tags} /> : null}
            </CardActions>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
}
