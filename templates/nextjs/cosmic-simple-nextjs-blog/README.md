# Simple Next.js Blog

![simple-nextjs-blog](https://github.com/cosmicjs/simple-nextjs-blog/assets/1950722/64b6673a-e25b-4124-93ed-bb57a6a35211)

### [View Demo](https://cosmic-nextjs-blog.vercel.app/)

### React + Next.js + Cosmic

This blog uses Next.js to create a React blog. It uses Next.js 15 and the new [Partial Prerendering](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model) to optimize performance and user experience. It connects to the Cosmic API via the [Cosmic JavaScript SDK](https://www.npmjs.com/package/@cosmicjs/sdk).

### Opimized for speed and performance
<img width="901" alt="simple-next-blog" src="https://github.com/user-attachments/assets/e53ef1be-f5a3-4d5a-9eac-4ddd6b32cec4">

## Getting Started

1. Log in to Cosmic and install the [Simple Next.js Blog template](https://www.cosmicjs.com/marketplace/templates/simple-nextjs-blog).
2. Run the following commands to install the code locally.

```
git clone https://github.com/cosmicjs/simple-nextjs-blog
cd simple-nextjs-blog
```

#### Environment Variables

1. Create an `.env.local` file to gain API access to your Cosmic Bucket. To do this, run:

```
cp .env.example .env.local
```

2. Find your API access keys at <em>Bucket Settings &gt; API Access</em> after logging into [your Cosmic dashboard](https://app.cosmicjs.com/login) and add them to the `.env.local` file. It should look something like this:

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-bucket-read-key
```

#### Run in development

Install all dependencies and run in development mode.

```
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).
