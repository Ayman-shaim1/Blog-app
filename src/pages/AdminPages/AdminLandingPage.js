import React, { useState, useEffect } from "react";
import { Row, Col, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import SideBar from "../../components/AdminComponents/SideBar";
import firebase from "firebase";
import { LinkContainer } from "react-router-bootstrap";
const AdminLandingPage = () => {
  const [nbrArticles, setNbrArticles] = useState(0);
  const [nbrUnpublishedArticles, setNbrUnpublishedArticles] = useState(0);
  const [nbrPendingArticles, setNbrPendingArticles] = useState(0);

  useEffect(() => {
    firebase
      .firestore()
      .collection("Article")
      .onSnapshot((snap) => {
        let cpt1 = 0;
        let cpt2 = 0
        snap.forEach((doc) => {
          if (doc.data().status === "published") {
            cpt1++;
          } else if (doc.data().status === "pending_for_review") {
            cpt2++
          }
        });
        setNbrArticles(cpt1);
        setNbrPendingArticles(cpt2);
      });

    firebase
      .firestore()
      .collection("unPublishArticles")
      .onSnapshot((snap) => {
        setNbrUnpublishedArticles(snap.docs.length);
      });
  }, []);

  return (
    <Row>
      <Col xl={3} lg={3} md={3} sm={3}>
        <SideBar />
      </Col>

      <Col xl={9} lg={9} md={9} sm={9}>
        <h1 className="justify-content-center d-flex mb-2">
          Hello{" "}
          {firebase.auth().currentUser &&
          firebase.auth().currentUser.displayName
            ? firebase.auth().currentUser.displayName
            : "Admin"}
        </h1>
        <hr />
        <h5 className="justify-content-center d-flex mb-2">
          {new Date().toDateString()}
        </h5>
        <hr />
        <Row>
          <Col xl={6} lg={6} md={6} sm={12}>
            <LinkContainer to="/Admin/Articles/published">
              <a href="/">
                <OverlayTrigger
                  overlay={<Tooltip>click to see published articles</Tooltip>}>
                  <Card bg="info" className="mb-2" text="light">
                    <Card.Body>
                      <h3 style={{ color: "#fff" }}>
                        <i className="fas fa-newspaper"></i> {nbrArticles}{" "}
                        publiched articles
                      </h3>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </a>
            </LinkContainer>
          </Col>

          <Col xl={6} lg={6} md={6} sm={12}>
            <LinkContainer to="/Admin/Articles/unpublished">
              <a href="/">
                <OverlayTrigger
                  overlay={
                    <Tooltip>click to see unpublished articles</Tooltip>
                  }>
                  <Card bg="info" text="light">
                    <Card.Body>
                      <h3 style={{ color: "#fff" }}>
                        <i className="far fa-newspaper"></i>{" "}
                        {nbrUnpublishedArticles} unpublished Articles
                      </h3>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </a>
            </LinkContainer>
          </Col>

          <Col xl={12} lg={12} md={12} sm={12}>
            <LinkContainer to="/Admin/Articles/pending_for_review">
              <a href="/">
                <OverlayTrigger
                  overlay={
                    <Tooltip>click to see pending for review articles</Tooltip>
                  }>
                  <Card bg="info" text="light">
                    <Card.Body>
                      <h3
                        style={{ color: "#fff" }}
                        className="justify-content-center d-flex">
                        <i className="far fa-newspaper"></i>{" "}
                        {nbrPendingArticles} pending for review Articles
                      </h3>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </a>
            </LinkContainer>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AdminLandingPage;
