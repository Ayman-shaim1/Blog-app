import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, children }) {
  const [show, setShow] = useState(true);

  return (
    <>
      {show && (
        <Alert variant={variant} onClose={() => setShow(false)} dismissible>
          {children}
        </Alert>
      )}
    </>
  );
}
Message.defaultProps = {
  variant: "info",
};
export default Message;
