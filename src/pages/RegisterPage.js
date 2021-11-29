import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { connect } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";
import { getGeoData } from "../redux/geoData/geoDataActions";

import Loader from "../components/Loader";

const RegisterPage = ({
  history,
  setAlert,
  getGeoData,
  geoData,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const types = ["image/png", "image/jpeg", "image/jpg", "image/svg"];

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confrimPassword) {
      setAlert("Passwords do not match", "danger");
    } else {
      setLoading(true);
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async () => {
            await firebase.auth().onAuthStateChanged(async function (user) {
              if (user) {
                user.updateProfile({
                  displayName: name,
                });
                user
                  .sendEmailVerification()
                  .then(() => {
                    setAlert(
                      `we have sent to you a mail verification on ${user.email} please check this mail and verify your account `,
                      "info"
                    );
                  })
                  .catch((err) => {
                    setAlert("something wrong about the verfication", "danger");
                  });

                let existe = false;
                const users = await firebase.firestore().collection("Users");
                users.onSnapshot(async (snap) => {
                  snap.forEach((doc) => {
                    if (doc.data().email === email) {
                      existe = true;
                    }
                  });
                  if (!existe) {
                    if (image) {
                      const storageRef = firebase.storage().ref(image.name);
                      storageRef.put(image).on(
                        "state_changed",
                        (snap) => {},
                        (err) => {
                          setAlert(err, "danger");
                        },
                        async () => {
                          const url = await storageRef.getDownloadURL();
                          firebase
                            .firestore()
                            .collection("Users")
                            .doc(user.uid)
                            .set({
                              email,
                              gender,
                              photo: url,
                              agent: navigator.userAgentData.platform,
                              emailVerified: user.emailVerified,
                              lastSignInTime:
                                user.metadata && user.metadata.lastSignInTime
                                  ? user.metadata.lastSignInTime
                                  : null,
                              visitsCount: 0,
                              country:
                                geoData && geoData.data
                                  ? geoData.data.country_name
                                  : null,
                            });
                        }
                      );
                    } else {
                      firebase
                        .firestore()
                        .collection("Users")
                        .doc(user.uid)
                        .set({
                          email,
                          gender,
                          agent: navigator.userAgentData.platform,
                          emailVerified: user.emailVerified,
                          lastSignInTime:
                            user.metadata && user.metadata.lastSignInTime
                              ? user.metadata.lastSignInTime
                              : null,
                          visitsCount: 0,
                          country:
                            geoData && geoData.data
                              ? geoData.data.country_name
                              : null,
                        });
                    }
                  }
                });
              }
            });
          });

        setLoading(false);
        history.push("/");
        firebase.auth().signOut();
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setAlert("user alerady existe !!", "danger");
        }
        if (error.code === "auth/weak-password") {
          setAlert("password should be at least 6 characters !!", "danger");
        }
        setLoading(false);
      }
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

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        history.push("/");
      }
    });

    getGeoData();
  }, [history,getGeoData]);
  return (
    <FormContainer>
      <div className="d-flex justify-content-center mt-4">
        <h4>Register here !</h4>
      </div>
      <div className="d-flex justify-content-center mt-1">
        {loading && <Loader />}
      </div>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            className="mb-2"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            className="mb-2"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <>
          <Form.Label>Gender</Form.Label>
          <Form.Check
            type="radio"
            className="m-2"
            value="Male"
            label="Male"
            name="rd-gender"
            checked={gender === "Male" ? true : false}
            onChange={(e) => setGender(e.target.value)}
          />

          <Form.Check
            type="radio"
            className="m-2"
            label="Female"
            value="Female"
            name="rd-gender"
            checked={gender === "Female" ? true : false}
            onChange={(e) => setGender(e.target.value)}
          />
        </>
        <Form.Group className="mt-2">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="file"
            placeholder="Enter your photo"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={changeHandler}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            className="mb-2"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm passwrod</Form.Label>
          <Form.Control
            required
            type="password"
            className="mb-2"
            placeholder="Enter confirm password"
            value={confrimPassword}
            onChange={(e) => setConfrimPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid grap-2">
          <Button size="sm" type="submit">
            Sign up
          </Button>
        </div>
      </Form>
      <div className="justify-content-center d-flex mt-3">
        Have an Account&nbsp;<Link to="/login">Login</Link>
      </div>
    </FormContainer>
  );
};

const mapStateToProps = (state) => {
  const { geoData } = state;
  return { geoData: geoData };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
    getGeoData: () => dispatch(getGeoData()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
