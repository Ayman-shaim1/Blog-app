import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
// import Alert from "./components/Alert";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoriteArticlesPage from "./pages/FavoriteArticlesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminArticlesPage from "./pages/AdminPages/AdminArticlesPage";
import AdminUsersPage from "./pages/AdminPages/AdminUsersPage";
import AdminArticlePage from "./pages/AdminPages/AdminArticlePage";
import AdminCategoriesPage from "./pages/AdminPages/AdminCategoriesPage";
import AdminLandingPage from "./pages/AdminPages/AdminLandingPage";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import { removeAlert } from "./redux/alert/alertActions";

const App = () => {
  const MySwal = withReactContent(Swal);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alert.content && alert.type) {
      MySwal.fire({
        title: (
          <>
            <h1>Alert</h1>
          </>
        ),
        text: alert.content,
        icon: !alert.type
          ? "error"
          : alert.type === "danger"
          ? "error"
          : alert.type,
        confirmButtonColor: `var(--bs-${alert.type})`,
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(removeAlert());
        }
      });
    }
    let genderMessage = false;
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        firebase
          .firestore()
          .collection("Users")
          .doc(user.uid)
          .update({
            emailVerified: user.emailVerified ? true : false,
          });
        if (!genderMessage) {
          const userFromColl = firebase
            .firestore()
            .collection("Users")
            .doc(user.uid);
          const userData = await (await userFromColl.get()).data();
          if (userData) {
            if (userData.gender === undefined) {
              MySwal.fire({
                title: (
                  <>
                    <h1>Alert</h1>
                  </>
                ),
                text: "You have to update your gender please",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Male",
                cancelButtonText: "Female",
                confirmButtonColor: `var(--bs-primary)`,
                cancelButtonColor: `var(--bs-primary)`,
              }).then((result) => {
                if (result.isConfirmed) {
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(user.uid)
                    .update({
                      gender: "Male",
                    });
                  MySwal.fire({
                    title: (
                      <>
                        <h1>Alert</h1>
                      </>
                    ),
                    text: "Your gender have been updated succefully",
                    icon: "success",
                    confirmButtonColor: `var(--bs-success)`,
                  });
                } else {
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(user.uid)
                    .update({
                      gender: "female",
                    });
                  firebase
                    .firestore()
                    .collection("Users")
                    .doc(user.uid)
                    .update({
                      gender: "Male",
                    });
                  MySwal.fire({
                    title: (
                      <>
                        <h1>Alert</h1>
                      </>
                    ),
                    text: "Your gender have been updated succefully",
                    icon: "success",
                    confirmButtonColor: `var(--bs-success)`,
                  });
                }
              });
            }
          }
        }
      }
    });
  }, [alert, MySwal, dispatch]);
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/" component={ArticlesPage} exact />
          <Route path="/Articles" component={ArticlesPage} exact />
          <Route
            path="/FavoriteArticles"
            component={FavoriteArticlesPage}
            exact
          />
          <Route path="/CreateArticle" component={CreateArticlePage} exact />
          <Route path="/Article/:id" component={ArticlePage} exact />
          <Route path="/Login" component={LoginPage} exact />
          <Route path="/Register" component={RegisterPage} exact />
          <Route path="/ForgotPassword" component={ForgotPasswordPage} exact />
          <Route path="/Admin/Users" component={AdminUsersPage} exact />
          <Route path="/Admin/Articles" component={AdminArticlesPage} exact />
          <Route
            path="/Admin/Articles/:status"
            component={AdminArticlesPage}
            exact
          />
          <Route path="/Admin/Article/:id" component={AdminArticlePage} exact />
          <Route
            path="/Admin/Categories"
            component={AdminCategoriesPage}
            exact
          />
          <Route path="/Admin" component={AdminLandingPage} exact />
        </Container>
      </main>
      <footer>
        <Container>
          <hr />
          <div className="justify-content-center d-flex pb-2">
            <span>Copyright &copy; {new Date().getFullYear()} Blog-App</span>
          </div>
        </Container>
      </footer>
    </Router>
  );
};

export default App;
