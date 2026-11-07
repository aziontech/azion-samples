interface SeoOptions {
  title: string
  description?: string
}

export function seo({ title, description }: SeoOptions): Array<Record<string, string>> {
  const tags: Array<Record<string, string>> = [{ title }]
  if (description) {
    tags.push({ name: 'description', content: description })
    tags.push({ property: 'og:title', content: title })
    tags.push({ property: 'og:description', content: description })
  }
  return tags
}
