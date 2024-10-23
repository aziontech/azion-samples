import * as React from "react"
import { Link } from "gatsby"

const BlogWidget = ({ categories }) => {
  return (
    <>
      <div className="sidebar blog-grid-page">
        <div className="widget search-widget">
          <h5 className="widget-title">Search This Site</h5>
          <form action={`/blog/search`} method="get">
            <input type="text" name="q" placeholder="Search Here..." />
            <button type="submit"><i className="lni lni-search-alt"></i></button>
          </form>
        </div>
      </div>

      <div className="widget categories-widget">
        <h5 className="widget-title">Categories</h5>
        <ul className="categories-list">
          {categories.map(category => {
            return <li key={category.slug}>
              <Link to={`/blog/category/${category.slug}`}>{category.name}</Link>
            </li>
          })}
        </ul>
      </div>

    </>
  )
}

export default BlogWidget;
