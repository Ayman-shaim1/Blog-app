import React from "react";
import { Alert } from "react-bootstrap";
import Meta from "../components/Meta";

const NotFoundPage = () => {
  return (
    <>
      <Meta title="Welcome To E-Blog" />
      <Alert variant="danger">
        <Alert.Heading>Page nour found</Alert.Heading>
        <p>this page is not found please redirect or choose an existing page</p>
      </Alert>
    </>
  );
};

export default NotFoundPage;
