import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { connect } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";
import Meta from "../components/Meta";



const ForgotPasswordPage = ({ history,setAlert }) => {
  const [email, setEmail] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (email !== "") {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setAlert("Email has been sent to you ,Please check and verify","success");
          history.push("/Login");
        })
        .catch((error) => {
          setAlert(error.message,"danger");
        });
    } else {
      setAlert("Please Enter an email","danger");
    }
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        history.push("/Login");
      }
    });
  }, [history]);
  return (
    <>
     <Meta title="Welcome To E-Blog" />
      <FormContainer>
        <h2 className="my-3 ">Forgot password ?</h2>
        <p>
          please enter yout email adress below and we will send you information
          to recover your account
        </p>
        
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div className="d-grid gap-2 mt-3">
            <Button size="sm" type="submit">
              reset password
            </Button>
          </div>
        </Form>
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(ForgotPasswordPage);
