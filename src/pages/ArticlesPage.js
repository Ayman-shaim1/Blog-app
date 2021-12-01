import React, { useEffect, useState } from "react";
import { Badge, Row, Col, Form } from "react-bootstrap";
import db from "../firebase/config";
// import Message from "../components/Message";
import Loader from "../components/Loader";
import Article from "../components/Article";

const ArticlesPage = () => {
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
      // Articles.where("category", "==", e.target.innerText);

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
      setSearchArticles(
        articles.filter(
          (art) =>
            art.category === choosenCategory &&
            art.subCategory === e.target.innerText
        )
      );
    } else {
      setSearchArticles(
        articles.filter((art) => art.category === choosenCategory)
      );
    }
  };

  const keyUpHandler = (e) => {
    if (e.target.value !== "") {
      setSearchArticles(
        articles.filter((a) =>
          String(a.title).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      const Articles = db.firestore().collection("Article");
      Articles.onSnapshot((snap) => {
        const articles = [];
        snap.forEach((doc) => {
          articles.push({ ...doc.data(), id: doc.id });
        });
        setSearchArticles(articles);
      });
    }
  };

  useEffect(() => {
    const categories = db.firestore().collection("ArticleCategories");
    categories.onSnapshot((snap) => {
      const articleCategories = [];
      snap.forEach((doc) => {
        articleCategories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(articleCategories);
    });
    const Articles = db.firestore().collection("Article");
    Articles.onSnapshot((snap) => {
      const articles = [];
      snap.forEach((doc) => {
        if (doc.data().status === "published")
          articles.push({ ...doc.data(), id: doc.id });
      });
      setArticles(articles);
      setSearchArticles(articles);
    });

    // db.auth().signOut();
  }, []);
  return (
    <>
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

      <div>
        <div className="justify-content-end d-flex">
          <Form.Control
            style={{ width: "300px" }}
            placeholder="search for article here ..."
            size="sm"
            className="mb-3"
            onKeyUp={keyUpHandler}
          />
        </div>
        <div>
          <Row>
            {searchArticles.length === 0 ? (
              <div className="d-flex justify-content-center">
                <h5 className="text-warning">Nothing was found!</h5>
              </div>
            ) : (
              searchArticles.map((item, index) => (
                <Col xl={4} lg={4} md={6} sm={12} key={index} className="mb-2">
                  <Article article={item} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </>
  );
};

export default ArticlesPage;
