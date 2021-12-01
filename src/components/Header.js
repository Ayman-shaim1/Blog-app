import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import firebase from "firebase";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isVerifyed, setIsVeryfied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logoutHandler = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
    setIsLogin(false);
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async function (user) {
      setTimeout(async () => {
        if (user) {
          setIsLogin(true);
          if (user.emailVerified) {
            setIsVeryfied(true);
            const connectedUserFromColl = firebase
              .firestore()
              .collection("Users")
              .doc(user.uid);

            if (connectedUserFromColl) {
              const connectedUserData = await (
                await connectedUserFromColl.get()
              ).data();
              if (connectedUserData && connectedUserData.isAdmin) {
                setIsAdmin(true);
              }
            }
          }
          if (!firebase.auth().currentUser) {
            setIsLogin(false);
          }
        }
      }, 500);
    });
  }, []);
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>E-Blog</Navbar.Brand>
        </LinkContainer>
        {isLogin && (
          <NavDropdown
            title={`Hello ${
              firebase.auth().currentUser &&
              firebase.auth().currentUser.displayName
                ? firebase.auth().currentUser.displayName
                : firebase.auth().currentUser
                ? firebase.auth().currentUser.email
                : "New User"
            }`}
            id="collasible-nav-dropdown-sm">
            <LinkContainer to="/Articles">
              <NavDropdown.Item>Articles</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/FavoriteArticles">
              <NavDropdown.Item>Favorite articles</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/CreateArticle">
              <NavDropdown.Item>Create Article</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider></NavDropdown.Divider>
            <LinkContainer to="/lougout">
              <NavDropdown.Item onClick={logoutHandler}>
                Logout
              </NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        )}
        <Navbar.Toggle aria-controls="my-nav" />
        <Navbar.Collapse id="my-nav">
          <Nav
            className="me-auto my-2 navbar-nav w-100 justify-content-end"
            navbarScroll>
            {!isLogin ? (
              <LinkContainer to="/Login" className="nav-link-drp">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <>
                {isVerifyed && (
                  <NavDropdown
                    title={`Hello ${
                      firebase.auth().currentUser &&
                      firebase.auth().currentUser.displayName
                        ? firebase.auth().currentUser.displayName
                        : firebase.auth().currentUser
                        ? firebase.auth().currentUser.email
                        : "New User"
                    }`}
                    id="collasible-nav-dropdown">
                    <LinkContainer to="/Articles">
                      <NavDropdown.Item>Articles</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/FavoriteArticles">
                      <NavDropdown.Item>Favorite articles</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/CreateArticle">
                      <NavDropdown.Item>Create Article</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider></NavDropdown.Divider>
                    <LinkContainer to="/lougout">
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
                {isAdmin && (
                  <LinkContainer to="/Admin">
                    <Nav.Link>Admin</Nav.Link>
                  </LinkContainer>
                  // <NavDropdown title="Admin" id="collasible-nav-dropdown">
                  //   <LinkContainer to="/Admin/Categories">
                  //     <NavDropdown.Item>Categories</NavDropdown.Item>
                  //   </LinkContainer>
                  //   <LinkContainer to="/Admin/Articles">
                  //     <NavDropdown.Item>Articles</NavDropdown.Item>
                  //   </LinkContainer>
                  //   <LinkContainer to="/Admin/Users">
                  //     <NavDropdown.Item>Users</NavDropdown.Item>
                  //   </LinkContainer>
                  // </NavDropdown>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
