import { butterCMS } from "../plugins/ButterCMS";

export const getBlogCategory = async (categorySlug) => {
  const response = await butterCMS.category.retrieve(categorySlug);
  return response.data.data;
};
export const getBlogTag = async (tagSlug) => {
  const response = await butterCMS.tag.retrieve(tagSlug);
  return response.data.data;
};
