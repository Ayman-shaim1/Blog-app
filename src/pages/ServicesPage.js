import React from "react";
import { Card, Row, Col } from "react-bootstrap";
const ServicesPage = () => {
  return (
    <>
      <div className="alert alert-info p-5">
        <div className="d-flex justify-content-center p-5">
          <h1>Services</h1>
        </div>
      </div>
      <Row>
        <Col xl={4} lg={4} md={6} sm={12} className="mt-2">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-center">
                <h5>Service1</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                assumenda nam natus architecto ratione quasi quia autem, libero
                eveniet fugit voluptas odio eligendi quo labore sequi explicabo
                consectetur rem dolore delectus facilis quaerat sint?
                Accusantium qui provident aut quo dolorem blanditiis debitis, ex
                iste temporibus quisquam impedit cum nesciunt maxime.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={4} md={6} sm={12} className="mt-2">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-center">
                <h5>Service2</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                assumenda nam natus architecto ratione quasi quia autem, libero
                eveniet fugit voluptas odio eligendi quo labore sequi explicabo
                consectetur rem dolore delectus facilis quaerat sint?
                Accusantium qui provident aut quo dolorem blanditiis debitis, ex
                iste temporibus quisquam impedit cum nesciunt maxime.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={4} md={6} sm={12} className="mt-2">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-center">
                <h5>Service3</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                assumenda nam natus architecto ratione quasi quia autem, libero
                eveniet fugit voluptas odio eligendi quo labore sequi explicabo
                consectetur rem dolore delectus facilis quaerat sint?
                Accusantium qui provident aut quo dolorem blanditiis debitis, ex
                iste temporibus quisquam impedit cum nesciunt maxime.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ServicesPage;
