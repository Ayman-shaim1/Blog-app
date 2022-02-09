import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import firebase from "firebase";
import Article from "../components/Article";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Meta from "../components/Meta";



const FavoriteArticlesPage = ({ history }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user && user.emailVerified) {
        const userFromColl = await firebase
          .firestore()
          .collection("Users")
          .doc(user.uid);

        if (userFromColl) {
          const data = await (await userFromColl.get()).data();

          if (data) {
            await firebase
              .firestore()
              .collection("Article")
              .onSnapshot((snap) => {
                setLoading(true);
                const favArticles = [];
                snap.forEach((doc) => {
                  if (data.favoriteArticles) {
                    data.favoriteArticles.forEach((article) => {
                      if (
                        article === doc.id &&
                        doc.data().status !== "pending_for_review"
                      ) {
                        favArticles.push({ ...doc.data(), id: doc.id });
                      }
                    });
                  }
                });
                setArticles(favArticles);
                setLoading(false);
              });
          }
        }
      } else {
        history.push("/");
      }
    });
  }, [history]);
  return (
    <>
     <Meta title="Welcome To E-Blog" />
      <Link to="/" className="btn btn-primary mb-2 btn-sm">
        Go To home
      </Link>
      <h1>Your favorite articles</h1>
      <div className="d-flex justify-content-center">
        {loading && <Loader />}
      </div>
      {articles && articles.length !== 0 ? (
        <Row>
          {articles.map((item, index) => (
            <Col xl={4} lg={4} md={6} sm={12} key={index} className="mb-2">
              <Article article={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="d-flex justify-content-center">
          <h3 className="text-warning mt-3">Nothing was found !!</h3>
        </div>
      )}
    </>
  );
};

export default FavoriteArticlesPage;
