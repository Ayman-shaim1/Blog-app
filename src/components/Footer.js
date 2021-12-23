import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <Container>
        <hr />

        <Row>
          <Col xl={6} lg={6} md={6} sm={6} className="mt-2">
            <Row>
              <Col>
                <Link to="/AboutUs">About us</Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link to="/ContactUs">Contact us</Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link to="/AdvertiseWithUs">Advertise with us</Link>
              </Col>
            </Row>
          </Col>

          <Col xl={6} lg={6} md={6} sm={6} className="mt-2">
            <Row>
              <Col>
                <Link to="/Services">Services</Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link to="/PrivacyPolicy">Privacy policy</Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        <div className="d-flex justify-content-center">
          <h5>Socials Media</h5>
        </div>
        <ul className="d-flex justify-content-center">
          <li className="m-2">
            <a href="https://www.facebook.com">
              <i className="fab fa-facebook"></i> Facebook
            </a>
          </li>
          <li className="m-2">
            <a href="https://www.Instagram.com">
              <i className="fab fa-instagram"></i> Instagarm
            </a>
          </li>
          <li className="m-2">
            <a href="https://www.twitter.com">
              <i className="fab fa-twitter"></i> Twitter
            </a>
          </li>
        </ul>

        <hr />
        <div className="justify-content-center d-flex pb-2">
          <span>Copyright &copy; {new Date().getFullYear()} My Manarah</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
