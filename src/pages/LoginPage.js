import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  facebookProvider,
  googleProvider,
  // twitterProvider,
} from "../firebase/authMethods";
import firebase from "firebase";

import Loader from "../components/Loader";
import { connect } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";

const LoginPage = ({ history, setAlert }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const socialMediaAuthHandler = async (provider) => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        // const credential = result.credential;
        // console.log(credential);
        //const token = credential.accessToken;
        const user = result.user;

        const providerData = user.providerData[0];
        const userFromColl = firebase
          .firestore()
          .collection("Users")
          .doc(user.uid);
        const userData = await (await userFromColl.get()).data();
        if (!userData) {
          fetch("https://ipinfo.io/json?token=9e902eb7529457")
            .then((response) => response.json())
            .then((jsonResponse) => {
              firebase
                .firestore()
                .collection("Users")
                .doc(user.uid)
                .set({
                  ...providerData,
                  agent: navigator.userAgentData.platform,
                  country: jsonResponse.country,
                  emailVerified: user.emailVerified,
                  lastSignInTime:
                    user.metadata && user.metadata.lastSignInTime
                      ? user.metadata.lastSignInTime
                      : null,
                  visitsCount: 0,
                });
            });
          if (!user.emailVerified) {
            firebase.auth().signOut();
            user.sendEmailVerification().then(() => {
              setAlert(
                `we have sent to you a mail verification on ${user.email} please check this mail and verify your account `,
                "info"
              );
            });
          }
        } else {
          userFromColl.update({
            lastSignInTime:
              user.metadata && user.metadata.lastSignInTime
                ? user.metadata.lastSignInTime
                : null,
          });
        }
      })
      .catch((err) => {
        setAlert(err, "danger");
      });
  };
  const authHandler = async (e) => {
    e.preventDefault();
    if (email === "") {
      setAlert("Email is required !", "danger");
    }
    if (password === "") {
      setAlert("password is required !", "danger");
    }
    if (email === "" && password === "") {
      setAlert("email and password is required", "danger");
    }
    if (email !== "" && password !== "") {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          if (!res.user.emailVerified) {
            firebase.auth().signOut();
            setAlert("You should verify your account please !!", "info");
            history.push("/Login");
          } else {
            history.push("/");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.code === "auth/user-not-found") {
            setAlert(email + " is not registered", "danger");
          }
          if (err.code === "auth/wrong-password") {
            setAlert("the password you entered is wrong", "danger");
          }
          if (err.code === "auth/network-request-failed") {
            setAlert(err.message, "danger");
          }
        });
    }
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        history.push("/");
      }
    });
  }, [history]);
  return (
    <FormContainer>
      <div className="justify-content-center d-flex mt-3">
        <h4>Login Here !</h4>
      </div>
      <div className="justify-content-center d-flex mt-3">
        {loading && <Loader />}
      </div>

      <Form onSubmit={authHandler}>
        <Form.Group>
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            className="mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Passwrod </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="primary" className="mt-2" size="sm" type="submit">
            sign in
          </Button>
        </div>
        <div className="justify-content-end d-flex">
          <Link to="/ForgotPassword?">Forgot your password ?</Link>
        </div>
        <div className="justify-content-center d-flex mt-3">
          New Customer <Link to="/register">Register</Link>
        </div>
      </Form>
      <hr />
      <div className="d-grid gap-2">
        <Button
          variant="danger"
          className="mb-2"
          size="sm"
          onClick={() => socialMediaAuthHandler(googleProvider)}>
          <i className="fab fa-google"></i> Sign up with google
        </Button>
        <Button
          variant="info"
          className="mb-2"
          size="sm"
          onClick={() => socialMediaAuthHandler(facebookProvider)}>
          <i className="fab fa-facebook-f"></i> Sign up with facebook
        </Button>
        {/* <Button
          variant="info"
          className="mb-2"
          size="sm"
          onClick={() => socialMediaAuthHandler(twitterProvider)}>
          <i className="fab fa-twitter"></i> Sign up with twitter
        </Button> */}
      </div>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(LoginPage);
