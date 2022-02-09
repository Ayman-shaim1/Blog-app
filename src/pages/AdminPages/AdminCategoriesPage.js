import React, { useEffect, useState } from "react";
import firebase from "firebase";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Alert,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { connect } from "react-redux";
import { setAlert } from "../../redux/alert/alertActions";
import SideBar from "../../components/AdminComponents/SideBar";
import Meta from "../../components/Meta";


const AdminCategoriesPage = ({ setAlert, history }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [choosenCategory, setChoosenCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowSubAddCategory] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const handleCloseAddCategory = () => setShowAddCategory(false);
  const handleShowAddCategory = () => setShowAddCategory(true);

  const handleCloseAddSubCategory = () => setShowSubAddCategory(false);
  const handleShowAddSubCategory = () => setShowSubAddCategory(true);

  const showSubCategoriesHandler = (id) => {
    setChoosenCategory(id);
    setSubCategories(
      categories.find((cat) => String(cat.id) === String(id)).subCategories
    );
  };
  const deleteCategoryHandler = async (id) => {
    firebase
      .firestore()
      .collection("ArticleCategories")
      .doc(id)
      .delete()
      .then((res) => {
        console.log(res);
        setChoosenCategory("");
        setAlert("this category has been deleted seccuessfully", "success");
      })
      .catch((err) => {
        setAlert(err, "danger");
      });
  };
  const deleteSubCategoryHandler = async (subCategoryName) => {
    const category = firebase
      .firestore()
      .collection("ArticleCategories")
      .doc(choosenCategory);
    const categoryData = await (await category.get()).data();
    category.update({
      ...categoryData,
      subCategories: categoryData.subCategories.filter(
        (sc) => sc !== subCategoryName
      ),
    });
    setSubCategories(subCategories.filter((sc) => sc !== subCategoryName));
    setAlert(
      subCategoryName + " sub category has been deleted seccuessfully",
      "success"
    );
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    if (categoryName !== "") {
      if (
        categories.findIndex((cat) => cat.categoryName === categoryName) === -1
      ) {
        firebase.firestore().collection("ArticleCategories").add({
          categoryName: categoryName,
        });
        setAlert(
          categoryName + " Category has been added successfully",
          "success"
        );
        setShowAddCategory(false);
        setCategoryName("");
      } else {
        setCategoryName("");
        setAlert("This category is already added ", "warning");
      }
    } else {
      setAlert("Please enter the category name", "danger");
    }
  };
  const addSubCategoryHandler = async (e) => {
    e.preventDefault();
    const category = firebase
      .firestore()
      .collection("ArticleCategories")
      .doc(choosenCategory);
    const categoryData = await (await category.get()).data();
    if (categoryData.subCategories) {
      if (
        categoryData.subCategories.findIndex(
          (cat) => String(cat).toLowerCase() === subCategoryName.toLowerCase()
        ) !== -1
      ) {
        setAlert("This sub category already existe ", "warning");
        setSubCategoryName("");
      } else {
        categoryData.subCategories.push(subCategoryName);
        category.update({
          ...categoryData,
        });
        let ar_subcategories = [];
        if (subCategories && subCategories.length !== 0)
          ar_subcategories = [...subCategories, subCategoryName];
        else ar_subcategories = [subCategoryName];

        setSubCategories(ar_subcategories);
        setSubCategoryName("");
        setAlert("Sub category has been added seccussfully", "success");
        setShowSubAddCategory(false);
      }
    } else {
      category.update({
        ...categoryData,
        subCategories: [subCategoryName],
      });
      let ar_subcategories = [];
      if (subCategories && subCategories.length !== 0)
        ar_subcategories = [...subCategories, subCategoryName];
      else ar_subcategories = [subCategoryName];

      setSubCategories(ar_subcategories);
      setSubCategoryName("");
      setAlert("Sub category has been added seccussfully", "success");
    }
  };
  const addNewSubCategoryNameHandler = async (subCategory) => {
    const txt = document.getElementById(`txt-subcat-${subCategory}`);
    const value = txt.value;
    if (value !== "") {
      const category = firebase
        .firestore()
        .collection("ArticleCategories")
        .doc(choosenCategory);
      const categoryData = await (await category.get()).data();
      if (categoryData.subCategories) {
        if (
          categoryData.subCategories.findIndex(
            (cat) => String(cat).toLowerCase() === subCategory.toLowerCase()
          ) !== -1
        ) {
          // update articles how have the same name as the old category :
          const Articles = firebase.firestore().collection("Article");
          Articles.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (
                doc.data().subCategory.toLowerCase() ===
                subCategory.toLowerCase()
              )
                firebase.firestore().collection("Article").doc(doc.id).update({
                  subCategory: value,
                });
            });
          });

          const newSubCat = categoryData.subCategories.filter(
            (sub) => sub !== subCategory
          );
          newSubCat.push(value);
          setSubCategories(newSubCat);
          // update categorie collection how have the same name as the old subcategory :

          category.update({
            ...categoryData,
            subCategories: newSubCat,
          });
        }
      }
      txt.setAttribute("id", `txt-subcat-${txt.value}`);
      txt.value = "";
    }
  };

  const addNewCategoryNameHandler = async (CategoryName) => {
    const txt = document.getElementById(`txt-cat-${CategoryName}`);
    const value = txt.value;
    if (value !== "") {
      const category = firebase
        .firestore()
        .collection("ArticleCategories")
        .doc(choosenCategory);
      const categoryData = await (await category.get()).data();

      let newCategories = [];
      categories.forEach((cat) => {
        if (cat.categoryName === CategoryName) {
          cat.categoryName = value;
        }
        newCategories.push(cat);
      });
      setCategories(newCategories);
      // update articles how have the same name as the old category :
      const Articles = firebase.firestore().collection("Article");
      Articles.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().category.toLowerCase() === CategoryName.toLowerCase())
            firebase.firestore().collection("Article").doc(doc.id).update({
              category: value,
            });
        });
      });

      // update categorie collection how have the same name as the old category :
      category.update({
        ...categoryData,
        categoryName: value,
      });
      txt.setAttribute("id", `txt-cat-${txt.value}`);
      txt.value = "";
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

            firebase
              .firestore()
              .collection("ArticleCategories")
              .onSnapshot((snap) => {
                const docs = [];
                snap.forEach((doc) => {
                  docs.push({ ...doc.data(), id: doc.id });
                });
                setCategories(docs);
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
  }, [history]);
  return (
    <>
      <Meta title="Welcome To E-Blog" />
      <Row>
        <Col xl={2} lg={2} md={3}>
          <SideBar />
        </Col>
        <Col xl={10} lg={10} md={9}>
          {choosenCategory && choosenCategory !== "" && (
            <>
              <strong>selected category : </strong>
              <Alert variant="info" className="justify-content-between d-flex">
                <h6>category id : {choosenCategory}</h6>
                <h6>
                  category name :{" "}
                  {categories.find((x) => x.id === choosenCategory) &&
                    categories.find((x) => x.id === choosenCategory)
                      .categoryName}
                </h6>
              </Alert>
            </>
          )}

          <Button size="sm" onClick={handleShowAddCategory}>
            Add Category
          </Button>
          <Modal show={showAddCategory} onHide={handleCloseAddCategory}>
            <Modal.Header closeButton>Add Category</Modal.Header>
            <Modal.Body>
              <Form onSubmit={addCategoryHandler}>
                <Form.Group>
                  <Form.Label>Name category</Form.Label>
                  <Form.Control
                    onChange={(e) => setCategoryName(e.target.value)}
                    value={categoryName}
                    placeholder="Enter a name of category"
                  />
                </Form.Group>
                <div className="d-grid gap-2 mt-3">
                  <Button size="sm" type="submit">
                    Add category
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
          <div className="justify-content-center d-flex my-2">
            <h5>Categories</h5>
          </div>
          <Table hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category name</th>
                <th colSpan="2">Update category name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.length !== 0 &&
                categories.map((category) => (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip>click to see all sub categories</Tooltip>
                    }>
                    <tr
                      key={category.id}
                      className="cursor-pointer"
                      onClick={() => {
                        showSubCategoriesHandler(category.id);
                      }}>
                      <td>{category.id}</td>
                      <td>{category.categoryName}</td>
                      <td colSpan="10">
                        <InputGroup className="mb-3">
                          <Form.Control
                            size="sm"
                            placeholder="new category name"
                            id={`txt-cat-${category.categoryName}`}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              addNewCategoryNameHandler(category.categoryName)
                            }>
                            <i className="fas fa-plus"></i>
                          </Button>
                        </InputGroup>
                      </td>

                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteCategoryHandler(category.id)}>
                          <i className="fas fa-times"></i>
                        </Button>
                      </td>
                    </tr>
                  </OverlayTrigger>
                ))}
            </tbody>
          </Table>
          {choosenCategory && (
            <>
              <Button
                size="sm"
                onClick={handleShowAddSubCategory}
                className="mt-5 mb-3">
                Add sub category
              </Button>
              <Modal
                show={showAddSubCategory}
                onHide={handleCloseAddSubCategory}>
                <Modal.Header closeButton>Add Category</Modal.Header>
                <Modal.Body>
                  <Form onSubmit={addSubCategoryHandler}>
                    <Form.Group>
                      <Form.Label>Name sub category</Form.Label>
                      <Form.Control
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        placeholder="Enter a name of sub category"
                      />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-3">
                      <Button size="sm" type="submit">
                        Add sub category
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </>
          )}
          {subCategories && subCategories.length !== 0 && (
            <>
              <Table hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>subCategories</th>
                    <th>update sub categories name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((subCategory) => (
                    <tr key={subCategory} className="cursor-pointer">
                      <td>{subCategory}</td>
                      <td colSpan="10">
                        <InputGroup className="mb-3">
                          <Form.Control
                            id={`txt-subcat-${subCategory}`}
                            size="sm"
                            placeholder="new sub category name"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              addNewSubCategoryNameHandler(subCategory)
                            }>
                            <i className="fas fa-plus"></i>
                          </Button>
                        </InputGroup>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteSubCategoryHandler(subCategory)}>
                          <i className="fas fa-times"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(AdminCategoriesPage);
