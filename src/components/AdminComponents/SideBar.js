import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const SideBar = () => {
  return (
    <Nav className="flex-md-column flex-sm-row mb-5 justify-content-center" >
      <LinkContainer to="/Admin">
        <Nav.Link>Admin</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/Admin/Categories">
        <Nav.Link>Categories</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/Admin/Articles">
        <Nav.Link>Articles</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/Admin/Users">
        <Nav.Link>Users</Nav.Link>
      </LinkContainer>
    </Nav>
  );
};

export default SideBar;
