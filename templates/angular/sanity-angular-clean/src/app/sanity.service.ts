import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient, ClientConfig, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { Post } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  private client: SanityClient;
  private imageUrlBuilder: ImageUrlBuilder;
  private clientConfig: ClientConfig = {
    projectId: process.env["SANITY_STUDIO_PROJECT_ID"],
    dataset: process.env["SANITY_STUDIO_DATASET"],
    apiVersion: "2022-05-01",
    useCdn: false,
  };
  constructor(private http: HttpClient) {
    this.client = this.sanityClient();
    this.imageUrlBuilder = imageUrlBuilder(this.client);
  }
  private sanityClient(): SanityClient {
    return createClient(this.clientConfig);
  }

  getImageUrlBuilder(source: SanityImageSource): ImageUrlBuilder {
    return this.imageUrlBuilder.image(source);
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.sanityClient().fetch(
      '*[_type == "post" && defined(slug.current)]|order(_createdAt desc)'
    );
  }
  async getPost(slug: string): Promise<Post> {
    return await this.sanityClient().fetch(
      '*[_type == "post" && slug.current == $slug][0]',
      { slug }
    );
  }
}
