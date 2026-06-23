import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const letters = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/letters" }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
  }),
});

export const collections = { letters };
