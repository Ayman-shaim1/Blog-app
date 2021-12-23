import React from "react";
import { Alert } from "react-bootstrap";
const NotFoundPage = () => {
  return (
    <Alert variant="danger">
      <Alert.Heading>Page nour found</Alert.Heading>
      <p>this page is not found please redirect or choose an existing page</p>
    </Alert>
  );
};

export default NotFoundPage;
