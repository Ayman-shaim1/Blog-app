import React, { useEffect, useState, useRef } from "react";
import firebase from "../firebase/config";
import {
  Row,
  Col,
  Badge,
  Offcanvas,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Loader from "../components/Loader";

import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  // FacebookMessengerShareButton,
} from "react-share";
import Meta from "../components/Meta";

const ArticlePage = ({ match, history }) => {
  const [article, setArticle] = useState(null);
  const [like, setLike] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isOutDate, setIsOutDate] = useState(false);

  const [show, setShow] = useState(false);
  const [showBts, setShowBts] = useState(false);
  const shareUrl = "https://blog-app-5dfc0.firebaseapp.com" + match.url;
  const articleContentRef = useRef(null);

  const likeArticleHandler = async () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const userFromColl = firebase
        .firestore()
        .collection("Users")
        .doc(user.uid);
      if (user.emailVerified) {
        const likedArticles = await (await userFromColl.get()).data()
          .likedArticles;
        if (likedArticles) {
          if (likedArticles.findIndex((a) => a === match.params.id) === -1) {
            const data = await (await userFromColl.get()).data();
            userFromColl.update({
              ...data,
              likedArticles: [...likedArticles, match.params.id],
            });
            setLike(true);
            const likeCount = article.likeCount ? article.likeCount + 1 : 1;
            const newArticleData = {
              ...article,
              likeCount: likeCount,
            };
            firebase
              .firestore()
              .collection("Article")
              .doc(match.params.id)
              .update(newArticleData);
            setArticle(newArticleData);
          } else {
            const newLikedArticles = likedArticles.filter(
              (a) => a !== match.params.id
            );

            const data = await (await userFromColl.get()).data();
            userFromColl.update({
              ...data,
              likedArticles: newLikedArticles,
            });
            setLike(false);
            const likeCount = article.likeCount ? article.likeCount - 1 : 0;
            const newArticleData = {
              ...article,
              likeCount: likeCount,
            };
            firebase
              .firestore()
              .collection("Article")
              .doc(match.params.id)
              .update(newArticleData);
            setArticle(newArticleData);
          }
        } else {
          const data = await (await userFromColl.get()).data();
          userFromColl.update({
            ...data,
            likedArticles: [match.params.id],
          });
          setLike(true);
          const likeCount = article.likeCount ? article.likeCount + 1 : 1;
          const newArticleData = {
            ...article,
            likeCount: likeCount,
          };
          firebase
            .firestore()
            .collection("Article")
            .doc(match.params.id)
            .update(newArticleData);
          setArticle(newArticleData);
        }
      } else {
        alert("you account is not verified !!");
      }
    } else {
      alert("you have to sign in !!");
    }
  };
  const favoriteArtictleHandler = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      if (user.emailVerified) {
        const userFromColl = firebase
          .firestore()
          .collection("Users")
          .doc(user.uid);
        const favoriteArticles = await (await userFromColl.get()).data()
          .favoriteArticles;
        if (favoriteArticles) {
          if (favoriteArticles.findIndex((a) => a === match.params.id) === -1) {
            const data = await (await userFromColl.get()).data();
            userFromColl.update({
              ...data,
              favoriteArticles: [...favoriteArticles, match.params.id],
            });
            setFavorite(true);
            const favoriteCount = article.favoriteCount
              ? article.favoriteCount + 1
              : 1;
            const newArticleData = {
              ...article,
              favoriteCount: favoriteCount,
            };
            firebase
              .firestore()
              .collection("Article")
              .doc(match.params.id)
              .update(newArticleData);
            setArticle(newArticleData);
          } else {
            const newFavoriteArticles = favoriteArticles.filter(
              (a) => a !== match.params.id
            );
            const data = await (await userFromColl.get()).data();
            userFromColl.update({
              ...data,
              favoriteArticles: newFavoriteArticles,
            });
            setFavorite(false);
            const favoriteCount = article.favoriteCount
              ? article.favoriteCount - 1
              : 0;
            const newArticleData = {
              ...article,
              favoriteCount: favoriteCount,
            };
            firebase
              .firestore()
              .collection("Article")
              .doc(match.params.id)
              .update(newArticleData);
            setArticle(newArticleData);
          }
        } else {
          const data = await (await userFromColl.get()).data();
          userFromColl.update({
            ...data,
            favoriteArticles: [match.params.id],
          });
          setFavorite(true);
          const favoriteCount = 1;
          const newArticleData = {
            ...article,
            favoriteCount: favoriteCount,
          };
          firebase
            .firestore()
            .collection("Article")
            .doc(match.params.id)
            .update(newArticleData);
          setArticle(newArticleData);
        }
      } else {
        alert("you account is not verified !!");
      }
    } else {
      alert("you have to sign in !!");
    }
  };
  const outdatedHandler = async () => {
    const user = firebase.auth().currentUser;
    const Article = firebase
      .firestore()
      .collection("Article")
      .doc(match.params.id);
    const data = await (await Article.get()).data();
    const user_ourDated = data.user_ourDated
      ? [...data.user_ourDated, user.uid]
      : [user.uid];
    const newData = { ...data, user_ourDated };
    Article.update(newData);

    const connectedUser = firebase
      .firestore()
      .collection("Users")
      .doc(user.uid);

    const connectedUserData = await (await connectedUser.get()).data();
    const outDatedArticles = connectedUserData.outDatedArticles;
    if (outDatedArticles) {
      if (outDatedArticles.findIndex((a) => a === match.params.id) === -1) {
        connectedUserData.outDatedArticles.push(match.params.id);
        connectedUser.update(connectedUserData);
      }
    } else {
      connectedUser.update({
        ...connectedUserData,
        outDatedArticles: [match.params.id],
      });
    }
    setIsOutDate(true);
    const outDatedCount = article.outDatedCount ? article.outDatedCount + 1 : 1;
    const newArticleData = {
      ...article,
      outDatedCount: outDatedCount,
    };
    firebase
      .firestore()
      .collection("Article")
      .doc(match.params.id)
      .update(newArticleData);
    setArticle(newArticleData);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const Articles = firebase.firestore().collection("Article");
    Articles.where(
      firebase.firestore.FieldPath.documentId(),
      "==",
      match.params.id
    ).onSnapshot((snap) => {
      setArticle({ ...snap.docs[0].data() });
      if (articleContentRef.current) {
        articleContentRef.current.innerHTML = snap.docs[0].data().textContent;
        if (
          snap &&
          snap.docs[0] &&
          snap.docs[0].data() &&
          snap.docs[0].data().status !== "published"
        ) {
          history.push("/article");
        }
      }
    });
    const checkLikedFavoriteOrNot = async () => {
      const user = await firebase.auth().currentUser;
      if (user) {
        const userFromColl = await firebase
          .firestore()
          .collection("Users")
          .doc(user.uid);

        if (await (await userFromColl.get()).data()) {
          const user = firebase.auth().currentUser;

          const userFromColl = firebase
            .firestore()
            .collection("Users")
            .doc(user.uid);

          if (userFromColl) {
            const userData = await (await userFromColl.get()).data();
            if (userData) {
              userFromColl.update({
                visitsCount: userData.visitsCount + 1,
              });
            }
          }

          const likedArticles = await (await userFromColl.get()).data()
            .likedArticles;
          const favoriteArticles = await (await userFromColl.get()).data()
            .favoriteArticles;
          const outDatedArticles = await (await userFromColl.get()).data()
            .outDatedArticles;
          if (
            likedArticles &&
            likedArticles.findIndex((a) => a === match.params.id) !== -1
          )
            setLike(true);

          if (
            favoriteArticles &&
            favoriteArticles.findIndex((a) => a === match.params.id) !== -1
          )
            setFavorite(true);
          if (
            outDatedArticles &&
            outDatedArticles.findIndex((a) => a === match.params.id) !== -1
          ) {
            setIsOutDate(true);
          }

          if (user.emailVerified) {
            setShowBts(true);
          }
        }
      }
    };
    setTimeout(checkLikedFavoriteOrNot, 1000);
  }, [match, history]);

  return (
    <>
      <Meta
        title={`Welcome To E-Blog | ${article && article.title} `}
        description={article && article.textContent}
        image={article && article.image}
      />
      <div className="justify-content-between d-flex">
        <Link to="/" className="btn btn-primary mb-2 btn-sm">
          Go To home
        </Link>
        {isOutDate && (
          <small className="text-danger">
            this article is outDated for you
          </small>
        )}
      </div>
      {article ? (
        <Row>
          <Col xl={6} lg={6} md={12} sm={12} className="mb-2">
            <div>
              <img src={article.image} alt="" className="w-100" />
            </div>
          </Col>
          <Col xl={6} lg={6} md={12} sm={12}>
            <h3 lang="ar" className="rr-letter">
              {article.title}
            </h3>
            <h4>{article.category}</h4>
            <h5>{article.subCategory}</h5>
            <div className="mt-2" ref={articleContentRef}></div>
            <hr />
            <div className="d-flex">
              <small className="d-block my-2 mr-2">
                Like :{article.likeCount ? article.likeCount : 0}
              </small>

              <small className="d-block m-2">
                Favorites :{article.favoriteCount ? article.favoriteCount : 0}
              </small>

              <small className="d-block m-2">
                outDated : {article.outDatedCount ? article.outDatedCount : 0}
              </small>
            </div>

            <small className="d-block">created on : {article.date}</small>
            <small className="d-block">created by : {article.createdBy}</small>
            {article.updateDate && (
              <small className="d-block">
                updated on : {article.updateDate}
              </small>
            )}

            <hr />
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                {showBts && (
                  <>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {!like ? "Like" : "Unlike"} this article{" "}
                        </Tooltip>
                      }>
                      <h4>
                        <Badge
                          className="m-2 rounded-pill cursor-pointer v-btn btn-like"
                          bg="light"
                          onClick={likeArticleHandler}>
                          <Icon.HeartFill
                            className={like ? "text-danger" : ""}
                          />
                        </Badge>
                      </h4>
                    </OverlayTrigger>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {!favorite ? "Favorite" : "Unfavorite"} this article{" "}
                        </Tooltip>
                      }>
                      <h4>
                        <Badge
                          className="m-2 rounded-pill cursor-pointer v-btn btn-favorite"
                          bg="light"
                          onClick={favoriteArtictleHandler}>
                          <i
                            className={`fas fa-star ${
                              favorite ? "text-warning" : ""
                            }`}></i>
                        </Badge>
                      </h4>
                    </OverlayTrigger>
                    {!isOutDate && (
                      <OverlayTrigger
                        overlay={<Tooltip>Outdated this article </Tooltip>}>
                        <h4>
                          <Badge
                            className="m-2 rounded-pill v-btn cursor-pointer"
                            bg="light"
                            onClick={outdatedHandler}>
                            <i className="fas fa-times"></i>
                          </Badge>
                        </h4>
                      </OverlayTrigger>
                    )}
                  </>
                )}
                <OverlayTrigger
                  overlay={<Tooltip>Share this article </Tooltip>}>
                  <h4>
                    <Badge
                      className="m-2 rounded-pill v-btn cursor-pointer"
                      bg="light"
                      onClick={handleShow}>
                      <i className="fas fa-share"></i>
                    </Badge>
                  </h4>
                </OverlayTrigger>
                <Offcanvas show={show} onHide={handleClose} placement="bottom">
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      Share this article on socials media
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <div className="d-flex justify-content-center">
                      <FacebookShareButton url={shareUrl} className="m-3">
                        <Icon.Facebook
                          size={40}
                          style={{ color: "rgb(65, 34, 175)" }}
                        />
                      </FacebookShareButton>
                      {/* <FacebookMessengerShareButton
                        className="m-3"
                        url={shareUrl}>
                        <Icon.Messenger size={40} className="text-info" />
                      </FacebookMessengerShareButton> */}
                      <WhatsappShareButton url={shareUrl} className="m-3">
                        <Icon.Whatsapp size={40} className="text-success" />
                      </WhatsappShareButton>
                      <TwitterShareButton url={shareUrl} className="m-3">
                        <Icon.Twitter size={40} className="text-info" />
                      </TwitterShareButton>
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ArticlePage;
