import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationItems = ({ itemPerPage, totalItems,paginate}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <Pagination size="sm">
      <Pagination.First  onClick={() => paginate(1)} />
      {pageNumbers.map((number) => (
        <Pagination.Item key={number} onClick={() => paginate(number)}>{number}</Pagination.Item>
      ))}

      <Pagination.Last onClick={() => paginate(pageNumbers.length)}/>
    </Pagination>
  );
};

export default PaginationItems;
