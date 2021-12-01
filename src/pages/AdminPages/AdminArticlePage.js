import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, Form, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { setAlert } from "../../redux/alert/alertActions";
import { Editor } from "@tinymce/tinymce-react";
import SideBar from "../../components/AdminComponents/SideBar";

const AdminArticlePage = ({ match, history, setAlert }) => {
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showArticleInfo, setShowArticleInfo] = useState(false);
  const [showArticleImage, setShowArticleImage] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [textContent, setTextContent] = useState("");
  const [image, setImage] = useState("");
  const types = ["image/png", "image/jpeg"];
  const articleContentRef = useRef(null);

  const publishArticleHandler = async () => {
    const ArticleFromColl = await firebase
      .firestore()
      .collection("Article")
      .doc(match.params.id);
    if (ArticleFromColl) {
      const data = await (await ArticleFromColl.get()).data();
      data.status = "published";
      setArticle(data);
      ArticleFromColl.update(data);
      const unPublishArticlesRef = firebase
        .firestore()
        .collection("unPublishArticles");
      const unPublichArticle = unPublishArticlesRef.doc(match.params.id);
      if (unPublichArticle && (await (await unPublichArticle.get()).data())) {
        unPublichArticle.delete();
      }
    }
  };
  const unPublishArticleHandler = async () => {
    const ArticleRef = firebase
      .firestore()
      .collection("Article")
      .doc(match.params.id);

    const unPublishArticlesRef = firebase
      .firestore()
      .collection("unPublishArticles");
    const unPublichArticle = unPublishArticlesRef.doc(match.params.id);
    if (ArticleRef) {
      const data = await (await ArticleRef.get()).data();
      data.status = "unpublished";
      setArticle(data);
      ArticleRef.update(data);
      if (!unPublichArticle || !(await (await unPublichArticle.get()).data())) {
        const data = await (await ArticleRef.get()).data();
        unPublichArticle.set(data);
      }
    }
  };

  const handleCloseArticleInfo = () => setShowArticleInfo(false);
  const handleShowArticleInfo = () => {
    firebase
      .firestore()
      .collection("ArticleCategories")
      .onSnapshot((snap) => {
        const cats = [];
        snap.forEach((doc) => {
          cats.push(doc.data());
        });
        setCategories(cats);

        const subCats = categories.find(
          (c) => String(c.categoryName) === String(category)
        );
        if (subCats) {
          setSubCategories(subCats.subCategories);
        }
      });
    setShowArticleInfo(true);
  };

  const handleCloseArticleImage = () => setShowArticleImage(false);
  const handleShowArticleImage = () => setShowArticleImage(true);

  const changeImageHandler = async (e) => {
    e.preventDefault();
    if (image) {
      const storageRef = firebase.storage().ref(image.name);
      const currentUser = firebase.auth().currentUser;
      const collectionRef = firebase
        .firestore()
        .collection("Article")
        .doc(match.params.id);
      storageRef.put(image).on(
        "state_changed",
        (snap) => {},
        (err) => {
          setAlert(err, "danger");
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          collectionRef.update({
            ...article,
            updateDate: new Date().toDateString(),
            image: url,
            updatedBy: currentUser.email,
          });
          setArticle({
            ...article,
            updateDate: new Date().toDateString(),
            image: url,
            updatedBy: currentUser.email,
          });
          setAlert(
            "this image of this article has been updated with successfully",
            "success"
          );
          setShowArticleImage(false);
        }
      );
    }
  };
  const changeArticleInfoHandler = async (e) => {
    e.preventDefault();
    const articleFromColl = firebase
      .firestore()
      .collection("Article")
      .doc(match.params.id);
    const currentUser = firebase.auth().currentUser;

    if (articleFromColl) {
      articleFromColl
        .update({
          ...article,
          title,
          category,
          subCategory,
          textContent,
          updateDate: new Date().toDateString(),
          updatedBy: currentUser.email,
        })
        .then(() => {
          setAlert("this post has been updated with successfully", "success");
          setShowArticleInfo(false);
          setArticle({
            ...article,
            title,
            category,
            subCategory,
            textContent,
            updateDate: new Date().toDateString(),
            updatedBy: currentUser.email,
          });
        });
    }
  };
  const changeHandler = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setImage(selected);
    } else {
      setImage("");
      setAlert("Please select an image file (png or jpeg)", "danger");
    }
  };

  const changeCategoryHandler = (e) => {
    setCategory(e.target.value);
    if (e.target.value !== "") {
      const subCat = categories.find(
        (cat) => cat.categoryName === e.target.value
      ).subCategories;
      if (subCat) setSubCategories(subCat);
      else setSubCategories([]);
    } else {
      setSubCategories([]);
      setSubCategory("");
    }
  };
  useEffect(() => {
    const getArticle = async () => {
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
              const ArticleFromColl = await firebase
                .firestore()
                .collection("Article")
                .doc(match.params.id);
              if (ArticleFromColl) {
                const data = await (await ArticleFromColl.get()).data();
                setArticle(data);
                setTitle(data.title);
                setCategory(data.category);
                setSubCategory(data.subCategory);
                setTextContent(data.textContent);
                if(articleContentRef && articleContentRef.current)
                articleContentRef.current.innerHTML = data.textContent;
              }
              firebase
                .firestore()
                .collection("ArticleCategories")
                .onSnapshot((snap) => {
                  const cats = [];
                  snap.forEach((doc) => {
                    cats.push(doc.data());
                  });
                  setCategories(cats);
                  setTimeout(() => {
                    const subCats = categories.find(
                      (c) => String(c.categoryName) === String(category)
                    );
                    console.log(subCategories);
                    if (subCats) {
                      setSubCategories(subCats.subCategories);
                    }
                  }, 1000);
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
    };
    getArticle();
  }, [history, match]);
  return (
    <Row>
      <Col xl={2} lg={2} md={3}>
        <SideBar />
      </Col>
      <Col xl={10} lg={10} md={9}>
        <Link to="/Admin/Articles" className="btn btn-primary btn-sm mb-2">
          Go Back
        </Link>
        {article && (
          <Row>
            <Col xl={6} lg={6} md={12} sm={12} className="mb-2">
              <div className="position-relative">
                <img src={article.image} alt="" className="w-100" />
                <Badge
                  onClick={handleShowArticleImage}
                  className="position-absolute in-change-photo p-2 cursor-pointer bg-info">
                  change photo
                </Badge>
                <Modal show={showArticleImage} onHide={handleCloseArticleImage}>
                  <Modal.Header closeButton>Update Article Image</Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={changeImageHandler}>
                      <Form.Group>
                        <Form.Label>choose new image :</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                      <div className="d-grid gap-2 mt-2">
                        <Button type="submit" size="sm">
                          Update
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
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
              <small className="d-block">
                created by : {article.createdBy}
              </small>
              {article.updateDate && (
                <small className="d-block">
                  updated on : {article.updateDate}
                </small>
              )}
              {article.updatedBy && (
                <small className="d-block">
                  updated by : {article.updatedBy}
                </small>
              )}
              <hr />

              {article.status !== "pending_for_review" ? (
                <div className="d-flex justify-content-between">
                  {" "}
                  {article.status === "unpublished" ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={publishArticleHandler}>
                      publish this article
                    </Button>
                  ) : (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={unPublishArticleHandler}>
                      unpublish this article
                    </Button>
                  )}
                  <Button size="sm" onClick={handleShowArticleInfo}>
                    Update article info
                  </Button>
                  <Modal
                    show={showArticleInfo}
                    onHide={handleCloseArticleInfo}
                    size="lg">
                    <Modal.Header closeButton>Update this Article</Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={changeArticleInfoHandler}>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            className="mb-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={category}
                            onChange={changeCategoryHandler}>
                            <option value="">-- choose category ---</option>
                            {categories.map((category) => (
                              <option
                                key={category.categoryName}
                                value={category.categoryName}>
                                {category.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Subcategory</Form.Label>
                          <Form.Select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}>
                            <option value="">-- choose sub category ---</option>
                            {subCategories.map((subCategory) => (
                              <option value={subCategory} key={subCategory}>
                                {subCategory}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Article text content</Form.Label>
                          <Editor
                            apiKey="zqri8re1n8afuojmtdux76spujbjfmtbbxh4tt7a82bechls"
                            value={textContent}
                            onEditorChange={(newValue, editor) => {
                              setTextContent(newValue);
                            }}
                            init={{
                              resize: false,
                              plugins:
                                "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
                              imagetools_cors_hosts: ["picsum.photos"],
                              menubar:
                                "file edit view insert format tools table help",
                              toolbar:
                                "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
                              toolbar_sticky: true,
                              autosave_ask_before_unload: true,
                              autosave_interval: "30s",
                              autosave_prefix: "{path}{query}-{id}-",
                              autosave_restore_when_empty: false,
                              autosave_retention: "2m",
                              image_advtab: true,
                              link_list: [
                                {
                                  title: "My page 1",
                                  value: "https://www.tiny.cloud",
                                },
                                {
                                  title: "My page 2",
                                  value: "http://www.moxiecode.com",
                                },
                              ],
                              image_list: [
                                {
                                  title: "My page 1",
                                  value: "https://www.tiny.cloud",
                                },
                                {
                                  title: "My page 2",
                                  value: "http://www.moxiecode.com",
                                },
                              ],
                              image_class_list: [
                                { title: "None", value: "" },
                                { title: "Some class", value: "class-name" },
                              ],
                              importcss_append: true,
                              file_picker_callback: function (
                                callback,
                                value,
                                meta
                              ) {
                                /* Provide file and text for the link dialog */
                                if (meta.filetype === "file") {
                                  callback(
                                    "https://www.google.com/logos/google.jpg",
                                    {
                                      text: "My text",
                                    }
                                  );
                                }
                                /* Provide image and alt text for the image dialog */
                                if (meta.filetype === "image") {
                                  callback(
                                    "https://www.google.com/logos/google.jpg",
                                    {
                                      alt: "My alt text",
                                    }
                                  );
                                }

                                /* Provide alternative source and posted for the media dialog */
                                if (meta.filetype === "media") {
                                  callback("movie.mp4", {
                                    source2: "alt.ogg",
                                    poster:
                                      "https://www.google.com/logos/google.jpg",
                                  });
                                }
                              },
                              templates: [
                                {
                                  title: "New Table",
                                  description: "creates a new table",
                                  content:
                                    '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
                                },
                                {
                                  title: "Starting my story",
                                  description: "A cure for writers block",
                                  content: "Once upon a time...",
                                },
                                {
                                  title: "New list with dates",
                                  description: "New List with dates",
                                  content:
                                    '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
                                },
                              ],

                              height: 500,
                              image_caption: true,
                              quickbars_selection_toolbar:
                                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                              noneditable_noneditable_class: "mceNonEditable",
                              toolbar_mode: "sliding",
                              contextmenu: "link image imagetools table",

                              content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            }}
                          />
                        </Form.Group>

                        <div className="d-grid gap-2">
                          <Button type="submit" size="sm">
                            Update
                          </Button>
                        </div>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-center">
                    <h6 className="text-danger mb-4">
                      this article is pending for review
                    </h6>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={publishArticleHandler}>
                      publish this article
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(AdminArticlePage);
