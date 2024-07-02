
import { defineCollection, z } from 'astro:content';

const base = z.object({
  title: z.string(),
  description: z.string(),
  namespace: z.string(),
  meta_tags: z.string().optional(),
  noindex: z.boolean().optional().default(false),
});

const braziljs = defineCollection({
  schema: base.extend({
    lang: z.string(),
    ogImage: z.string()
  })
});


export const collections = { braziljs };