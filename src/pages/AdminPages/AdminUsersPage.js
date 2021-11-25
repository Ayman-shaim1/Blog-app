import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, ProgressBar } from "react-bootstrap";
import firebase from "firebase";
import SideBar from "../../components/AdminComponents/SideBar";

const AdminUsersPage = ({ history }) => {
  const [users, setUsers] = useState([]);
  const [nbrRegistred, setNbrRegistred] = useState(0);
  const [nbrPending, setNbrPending] = useState(0);

  const [nbrGoogleVisits, setNbrGoogleVisits] = useState(0);
  const [nbrFacebookVisits, setNbrFacebookVisits] = useState(0);
  const [nbrEmailPasswordVisits, setNbrEmailPasswordVisits] = useState(0);

  const [perMale, setPerMale] = useState(0);
  const [perFemale, setPerFemale] = useState(0);

  const makeHimAsAdminHandler = async (id) => {
    const userFromColl = firebase.firestore().collection("Users").doc(id);
    if (userFromColl) {
      const data = await (await userFromColl.get()).data();
      userFromColl.update({
        ...data,
        isAdmin: true,
      });
    }
  };
  const makeHimAsNormalUserHandler = async (id) => {
    const userFromColl = firebase.firestore().collection("Users").doc(id);
    if (userFromColl) {
      const data = await (await userFromColl.get()).data();
      userFromColl.update({
        ...data,
        isAdmin: false,
      });
    }
  };
  const lastLogin = (lastSignInTime) => {
    if (lastSignInTime) {
      const date1 = new Date();
      const date2 = new Date(lastSignInTime);
      // Year :
      if (Number(date1.getFullYear()) > Number(date2.getFullYear()))
        return (
          Number(date1.getFullYear()) -
          Number(date2.getFullYear()) +
          " year ago"
        );

      // Month :
      if (
        Number(date1.getFullYear()) === Number(date2.getFullYear()) &&
        Number(date1.getMonth()) > Number(date2.getMonth())
      )
        return (
          Number(date1.getMonth()) - Number(date2.getMonth()) + " Month ago"
        );
      // Day :
      if (
        Number(date1.getFullYear()) === Number(date2.getFullYear()) &&
        Number(date1.getMonth()) === Number(date2.getMonth()) &&
        Number(date1.getDay()) > Number(date2.getDay())
      )
        return Number(date1.getDay()) - Number(date2.getDay()) + " Day ago";
      // Hour :
      if (
        Number(date1.getFullYear()) === Number(date2.getFullYear()) &&
        Number(date1.getMonth()) === Number(date2.getMonth()) &&
        Number(date1.getDay()) === Number(date2.getDay()) &&
        Number(date1.getHours()) > Number(date2.getHours())
      )
        return (
          Number(date1.getHours()) - Number(date2.getHours()) + " Hour ago"
        );

      // Minutes :
      if (
        Number(date1.getFullYear()) === Number(date2.getFullYear()) &&
        Number(date1.getMonth()) === Number(date2.getMonth()) &&
        Number(date1.getDay()) === Number(date2.getDay()) &&
        Number(date1.getHours()) === Number(date2.getHours()) &&
        Number(date1.getMinutes()) > Number(date2.getMinutes())
      )
        return (
          Number(date1.getMinutes()) -
          Number(date2.getMinutes()) +
          " Minutes ago"
        );

      // Second :
      if (
        Number(date1.getFullYear()) === Number(date2.getFullYear()) &&
        Number(date1.getMonth()) === Number(date2.getMonth()) &&
        Number(date1.getDay()) === Number(date2.getDay()) &&
        Number(date1.getHours()) === Number(date2.getHours()) &&
        Number(date1.getMinutes()) === Number(date2.getMinutes()) &&
        Number(date1.getSeconds()) > Number(date2.getSeconds())
      )
        return (
          Number(date1.getSeconds()) -
          Number(date2.getSeconds()) +
          " Second ago"
        );
    }
  };
  useEffect(() => {
    const getUsers = async () => {
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
              const usersFromColl = firebase.firestore().collection("Users");
              usersFromColl.onSnapshot((snap) => {
                const usersA = [];
                let nbrR = 0;
                let nbrP = 0;
                let nbrMale = 0;
                let nbrFemale = 0;
                let nbrGoogle = 0;
                let nbrFacebook = 0;
                let nbrEmailPassword = 0;
                snap.forEach((doc) => {
                  nbrR++;
                  if (!doc.data().emailVerified) nbrP++;
                  if (
                    doc.data().gender &&
                    doc.data().gender.toLowerCase() === "male"
                  )
                    nbrMale++;
                  if (
                    doc.data().gender &&
                    doc.data().gender.toLowerCase() === "female"
                  )
                    nbrFemale++;

                  if (doc.data().providerId === "google.com")
                    nbrGoogle += doc.data().visitsCount;
                  else if (doc.data().providerId === "facebook.com")
                    nbrFacebook += doc.data().visitsCount;
                  else
                  nbrEmailPassword += doc.data().visitsCount
                    ? doc.data().visitsCount
                    : 0;

                  // if (doc.id !== user.uid)
                  usersA.push({ ...doc.data(), id: doc.id });
                });
                // console.log(snap.length);
                setUsers(usersA);
                setNbrRegistred(nbrR);
                setNbrPending(nbrP);
                setPerMale((nbrMale / nbrR) * 100);
                setPerFemale((nbrFemale / nbrR) * 100);
                setNbrGoogleVisits(nbrGoogle);
                setNbrFacebookVisits(nbrFacebook);
                setNbrEmailPasswordVisits(nbrEmailPassword);
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
    setTimeout(getUsers(), 1000);
  }, [history]);
  return (
    <Row>
    <Col xl={2} lg={2} md={3}>
      <SideBar />
    </Col>
    <Col xl={10} lg={10} md={9}>
      <Row>
        <Col xl={6} lg={6} md={6} sm={12}>
          <Card bg="info" text="light">
            <Card.Body>
              <h2 style={{ color: "#fff" }}>
                <i className="fas fa-user-friends"></i> {nbrRegistred} Registred
                users
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={6} sm={12}>
          <Card bg="info" text="light">
            <Card.Body>
              <h2 style={{ color: "#fff" }}>
                <i className="fas fa-user-friends"></i> {nbrPending} pending
                users
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />
      <Table hover responsive className="table-sm mt-3">
        <thead>
          <tr>
            <th>
              <small>photo</small>
            </th>
            <th>
              <small>email</small>
            </th>
            <th>
              <small>name</small>
            </th>
            <th>
              <small>country</small>
            </th>
            <th>
              <small>Agent</small>
            </th>
            <th>
              <small>Provider</small>
            </th>
            <th>
              <small>Vistits</small>
            </th>
            <th>
              <small>is&nbsp;admin</small>
            </th>
            <th>
              <small>Last&nbsp;login</small>
            </th>
            <th>
              <small></small>
            </th>
            <th>
              <small></small>
            </th>

            <th>
              <small></small>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length !== 0 &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.photoURL ? user.photoURL : "/images/user.png"}
                    alt=""
                    className="avatar"
                  />
                </td>

                <td>
                  <small>{user.email}</small>
                </td>

                <td>
                  <small>
                    {user.displayName && user.displayName.split(" ")[0]}{" "}
                    {user.displayName && user.displayName.split(" ")[1]}
                  </small>
                </td>

                <td>
                  <small>{user.country}</small>
                </td>
                <td>
                  <small>{user.agent}</small>
                </td>
                <td>
                  <small>
                    {user.providerId ? user.providerId : "email/password"}
                  </small>
                </td>
                <td>
                  <small className="d-flex justify-content-center">
                    {user.visitsCount ? user.visitsCount : 0}
                  </small>
                </td>
                <td>
                  <h5 className="justify-content-center d-flex">
                    {!user.isAdmin ? (
                      <i className="fas fa-times text-danger"></i>
                    ) : (
                      <i className="fas fa-check text-success"></i>
                    )}
                  </h5>
                </td>
                <td colSpan={3}>
                  <small>
                    {user.lastSignInTime &&
                      lastLogin(user.lastSignInTime) &&
                      lastLogin(user.lastSignInTime).split(" ")[0]}{" "}
                    {user.lastSignInTime &&
                      lastLogin(user.lastSignInTime) &&
                      lastLogin(user.lastSignInTime).split(" ")[1]}{" "}
                    {user.lastSignInTime &&
                      lastLogin(user.lastSignInTime) &&
                      lastLogin(user.lastSignInTime).split(" ")[2]}
                  </small>
                </td>
                <td>
                  {user.isAdmin ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => makeHimAsNormalUserHandler(user.id)}>
                      <i className="fas fa-user-times"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => makeHimAsAdminHandler(user.id)}>
                      <i className="fas fa-user-plus"></i>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <hr />
      <Row>
        <Col xl={4} lg={4} md={6} sm={12}>
          <Card bg="secondary" className="m-2">
            <Card.Body>
              <h1
                className="d-flex justify-content-center"
                style={{ fontSize: "50px" }}>
                <i className="fas fa-users"></i>
              </h1>
              <div className=" mt-3  d-flex justify-content-center">
                <h5 className="m-2">
                  {users.filter((u) => u.providerId === undefined).length} users
                </h5>
                <h3>|</h3>
                <h5 className="m-2">
                  {nbrEmailPasswordVisits ? nbrEmailPasswordVisits : 0} visits
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={4} md={6} sm={12}>
          <Card bg="danger" className="m-2" text="light">
            <Card.Body>
              <h1
                style={{ color: "#fff", fontSize: "50px" }}
                className="d-flex justify-content-center">
                <i className="fab fa-google"></i>
              </h1>
              <div className=" mt-3 d-flex justify-content-center">
                <h5 className="m-2" style={{ color: "#fff" }}>
                  {users.filter((u) => u.providerId === "google.com").length}{" "}
                  users
                </h5>
                <h3 style={{ color: "#fff" }}>|</h3>
                <h5 className="m-2" style={{ color: "#fff" }}>
                  {nbrGoogleVisits ? nbrGoogleVisits : 0} visits
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={4} md={6} sm={12}>
          <Card bg="info" className="m-2" text="light">
            <Card.Body>
              <h1
                style={{ color: "#fff", fontSize: "50px" }}
                className="d-flex justify-content-center">
                <i className="fab fa-facebook-f"></i>
              </h1>
              <div className=" mt-3 d-flex justify-content-center">
                <h5 className="m-2" style={{ color: "#fff" }}>
                  {users.filter((u) => u.providerId === "facebook.com").length}{" "}
                  users
                </h5>
                <h3 style={{ color: "#fff" }}>|</h3>
                <h5 className="m-2" style={{ color: "#fff" }}>
                  {nbrFacebookVisits ? nbrFacebookVisits : 0} visits
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr />
      <Col>
        <div className="prec-male">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fas fa-male"></i> Male
            </h5>
            <h5>{perMale}%</h5>
          </div>
          <ProgressBar now={perMale} />
        </div>
        <div className="prec-femal mt-4">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fas fa-female"></i> Male
            </h5>
            <h5>{perFemale}%</h5>
          </div>
          <ProgressBar now={perFemale} />
        </div>
      </Col>

      <div className="mt-5">
        <hr />
        <div className="perc-Organic-search mt-3">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fab fa-google"></i> Organic search
            </h5>
            <h5>191.235 (56%)</h5>
          </div>
          <ProgressBar variant="info" now={56} />
        </div>
        <div className="perc-facebook-search mt-3">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fab fa-facebook-f"></i> Facebook
            </h5>
            <h5>51.223 (15%)</h5>
          </div>
          <ProgressBar variant="info" now={15} />
        </div>

        <div className="perc-Twitter mt-3">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fab fa-twitter"></i> Twitter
            </h5>
            <h5>37.564 (11%)</h5>
          </div>
          <ProgressBar variant="info" now={11} />
        </div>

        <div className="perc-whatsapp mt-3">
          <div className="d-flex justify-content-between">
            <h5>
              <i className="fab fa-whatsapp"></i> whatsapp
            </h5>
            <h5>27.319 (8%)</h5>
          </div>
          <ProgressBar variant="info" now={8} />
        </div>
      </div>
    </Col>
    </Row>
  );
};

export default AdminUsersPage;
