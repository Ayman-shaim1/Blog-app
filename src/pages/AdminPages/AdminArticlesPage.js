import React, { useEffect, useState } from "react";
import firebase from "firebase";
import Article from "../../components/AdminComponents/Article";
import Loader from "../../components/Loader";
// import Message from "../../components/Message";
import { Row, Col, Badge, Form } from "react-bootstrap";
import SideBar from "../../components/AdminComponents/SideBar";
import { Link } from "react-router-dom";

const AdminArticlesPage = ({ history, match }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchArticles, setSearchArticles] = useState([]);
  const [choosenCategory, setChoosenCategory] = useState("");

  const chooseCategoryHandler = (e) => {
    if (e.target.innerText !== "All") {
      setChoosenCategory(e.target.innerText);
      setSubCategories(
        categories.find((cat) => cat.categoryName === e.target.innerText)
          .subCategories
      );
      if (match.params.status)
        setSearchArticles(
          articles.filter(
            (art) =>
              art.category === e.target.innerText &&
              art.status === match.params.status
          )
        );
      else
        setSearchArticles(
          articles.filter((art) => art.category === e.target.innerText)
        );
    } else {
      setChoosenCategory("");
      setSubCategories([]);
      setSearchArticles(articles);
    }
  };
  const chooseSubCategoryHandler = (e) => {
    if (e.target.innerText !== "All") {
      if (match.params.status)
        setSearchArticles(
          articles.filter(
            (art) =>
              art.category === choosenCategory &&
              art.subCategory === e.target.innerText &&
              art.status === match.params.status
          )
        );
      else
        setSearchArticles(
          articles.filter(
            (art) =>
              art.category === choosenCategory &&
              art.subCategory === e.target.innerText
          )
        );
    } else {
      if (match.params.status)
        setSearchArticles(
          articles.filter(
            (art) =>
              art.category === choosenCategory &&
              art.status === match.params.status
          )
        );
      else
        setSearchArticles(
          articles.filter((art) => art.category === choosenCategory)
        );
    }
  };

  const keyUpHandler = (e) => {
    if (e.target.value !== "") {
      if (match.params.status)
        setSearchArticles(
          articles.filter(
            (a) =>
              String(a.title)
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) &&
              a.status === match.params.status
          )
        );
      else
        setSearchArticles(
          articles.filter((a) =>
            String(a.title).toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
    } else {
      if (match.params.status)
        setSearchArticles(
          articles.filter((a) => a.status === match.params.status)
        );
      else setSearchArticles(articles);
    }
  };

  const changeHandler = (e) => {
    const val = e.target.value;
    if (Number(val) !== 0) {
      setSearchArticles(articles.filter((a) => a.outDatedCount >= val));
    } else {
      setSearchArticles(articles);
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user && user.emailVerified) {
        const connectedUserFromColl = firebase
          .firestore()
          .collection("Users")
          .doc(user.uid);

        if (connectedUserFromColl) {
          const connectedUserData = await (
            await connectedUserFromColl.get()
          ).data();
          if (connectedUserData && connectedUserData.isAdmin) {
            // if user is connected and is an admin :
            const categories = firebase
              .firestore()
              .collection("ArticleCategories");
            categories.onSnapshot((snap) => {
              const articleCategories = [];
              snap.forEach((doc) => {
                articleCategories.push({ ...doc.data(), id: doc.id });
              });
              setCategories(articleCategories);
            });

            const Articles = firebase.firestore().collection("Article");
            Articles.onSnapshot((snap) => {
              const arts = [];
              snap.forEach((doc) => {
                if (
                  match.params.status &&
                  doc.data().status === match.params.status
                ) {
                  arts.push({ ...doc.data(), id: doc.id });
                } else if (!match.params.status) {
                  arts.push({ ...doc.data(), id: doc.id });
                }
              });
              setArticles(arts);
              setSearchArticles(arts);
            });
          } else {
            history.push("/Login");
          }
        } else {
          history.push("/Login");
        }
      } else {
        history.push("/Login");
      }
    });
  }, [history, match]);
  return (
    <Row>
      <Col xl={2} lg={2} md={3}>
        <SideBar />
      </Col>
      <Col xl={10} lg={10} md={9}>
        <div className="d-flex justify-content-center">
          <h6>Choose category</h6>
        </div>
        <div className="d-flex">
          {categories.length === 0 ? (
            <Loader />
          ) : (
            <>
              <Badge
                className="d-block m-2 category"
                onClick={chooseCategoryHandler}>
                All
              </Badge>
              {categories.map((item) => (
                <Badge
                  className="d-block m-2 category"
                  key={item.categoryName}
                  onClick={chooseCategoryHandler}>
                  {item.categoryName}
                </Badge>
              ))}
            </>
          )}
        </div>
        <hr />

        {subCategories && subCategories.length !== 0 && (
          <>
            <div className="d-flex justify-content-center">
              <h6>Choose Sub category</h6>
            </div>
            <div className="d-flex">
              <Badge
                className="d-block m-2 category"
                onClick={chooseSubCategoryHandler}>
                All
              </Badge>
              {subCategories.map((item) => (
                <Badge
                  className="d-block m-2 category"
                  key={item}
                  onClick={chooseSubCategoryHandler}>
                  {item}
                </Badge>
              ))}
            </div>
            <hr />
          </>
        )}
        <div className="justify-content-center d-lg-flex d-sm-block">
          <Link
            className={`m-1 btn btn-status btn-sm btn-outline-secondary d-sm-block ${
              !match.params.status && "active"
            }`}
            size="sm"
            to="/Admin/Articles">
            All
          </Link>

          <Link
            to="/Admin/Articles/published"
            className={`m-1 btn btn-status btn-sm btn-outline-secondary d-sm-block ${
              match.params.status &&
              match.params.status === "published" &&
              "active"
            }`}
            size="sm">
            Published
          </Link>
          <Link
            to="/Admin/Articles/unpublished"
            className={`m-1 btn btn-status btn-sm btn-outline-secondary d-sm-block ${
              match.params.status &&
              match.params.status === "unpublished" &&
              "active"
            }`}
            size="sm">
            Unpublished
          </Link>
          <Link
            to="/Admin/Articles/pending_for_review"
            className={`m-1 btn btn-status btn-sm btn-outline-secondary d-sm-block ${
              match.params.status &&
              match.params.status === "pending_for_review" &&
              "active"
            }`}
            size="sm">
            Pending for review
          </Link>
        </div>
        <hr />
        <div className="justify-content-center d-flex">
          <Form.Group>
            <Form.Label>outDated count more or equal than</Form.Label>

            <input
              type="number"
              className="form-control"
              min="0"
              id="txt-outDated-count"
              onChange={changeHandler}
            />

            {/* <Form.Control size="sm"  as=""/> */}
          </Form.Group>
        </div>
        <hr />
        <div className="justify-content-end d-flex">
          <Form.Control
            style={{ width: "300px" }}
            placeholder="search for article here ..."
            size="sm"
            className="mb-3"
            onKeyUp={keyUpHandler}
          />
        </div>
        <Row>
          {searchArticles.length !== 0 ? (
            searchArticles.map((item) => (
              <Col xl={4} lg={4} md={6} sm={12} key={item.id} className="mb-2">
                <Article article={item} />
              </Col>
            ))
          ) : (
            <div className="d-flex justify-content-center">
              <h5 className="text-warning">Nothing was found !</h5>
            </div>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default AdminArticlesPage;
