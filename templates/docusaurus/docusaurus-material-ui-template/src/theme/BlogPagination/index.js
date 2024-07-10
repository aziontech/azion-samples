// /**
//  * Copyright @ by Code Lyoko Team. All rights reserved.
//  * Author: Thành Nam Nguyễn
//  */

import React from 'react';
import Pagination from '@mui/material/Pagination';
import { useHistory } from '@docusaurus/router';

export const BlogPagination = ({ metadata }) => {
  let history = useHistory();

  const handleParams = () => {
    const path = history.location.pathname;
    const parts = path.split('/');
    const pageNumber = parts[parts.length - 1];

    const page = isNaN(pageNumber) ? 1 : parseInt(pageNumber);
    return page;
  };

  let page = handleParams();

  const handlePageChange = (event, value) => {
    if (value === page) {
      return;
    }

    const newPagePath = value === 1 ? '/blog' : `/blog/page/${value}`;
    history.push(newPagePath);
  };

  return (
    <>
      {metadata.totalPages > 1 ? (
        <Pagination count={metadata.totalPages} page={page} onChange={handlePageChange} className="blog-pagination" />
      ) : (
        <></>
      )}
    </>
  );
};
