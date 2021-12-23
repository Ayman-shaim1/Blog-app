import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import { setAlert } from "../redux/alert/alertActions";
import { connect } from "react-redux";

const ContactUsPage = ({ setAlert }) => {
  const form = useRef();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const sendEmailHandler = (e) => {
    e.preventDefault();

    if (email && phoneNumber && name && message) {
      emailjs
        .sendForm(
          "service_it3lxbc",
          "template_thmj2w5",
          e.target,
          "user_XH9DYg2sNRpLe1b0A3fXf"
        )
        .then(
          (result) => {
            setAlert(
              "You message has been send with successfully !",
              "success"
            );
            setMessage("");
            setPhoneNumber("");
            setName("");
            setEmail("");
          },
          (error) => {
            setAlert(error.text, "danger");
          }
        );
    } else {
      setAlert(
        "Please ! you have to enter all the informations in the fields !",
        "danger"
      );
    }
  };

  return (
    <>
      <div className="alert alert-info p-5">
        <div className="p-5 d-flex justify-content-center">
          <h1>Contact us</h1>
        </div>
      </div>

      <Form ref={form} onSubmit={sendEmailHandler}>
        <Form.Group>
          <Form.Label>Full name</Form.Label>
          <Form.Control
            name="fullName"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            name="phone"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            style={{ height: "200px" }}
            placeholder="Enter your message"
            value={message}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid gap-2 mt-2">
          <Button type="submit" size="sm">
            submit
          </Button>
        </div>
      </Form>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(ContactUsPage);
