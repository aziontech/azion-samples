export const basicBlogLinks = [
  {
    to: "/",
    text: "Home",
  },
  {
    to: "/blog/",
    text: "Blog",
  },
];

export const formatTime = (time) => new Date(time).toLocaleString();
export const setSeo = (title, description) => {
  document.title = title;
};
