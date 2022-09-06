import React from "react";
import Pagination from "@mui/material/Pagination";

const CustomPagination = ({ setPage, numOfPages = 10 }) => {
  const handlePageChange = (page) => {
    setPage(page);
    window.scroll(0, 0);
  };
  return (
    <div className="custompagination">
      <Pagination
        color="secondary"
        count={numOfPages}
        onChange={(e) => handlePageChange(e.target.textContent)}
      />
    </div>
  );
};

export default CustomPagination;
