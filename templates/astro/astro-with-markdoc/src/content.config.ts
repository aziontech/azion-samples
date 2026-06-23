import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const docs = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/docs' }),
	schema: z.object({
		title: z.string(),
	}),
});

export const collections = { docs };
