import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import styled from "styled-components";

const AlertItem = (props) => {
  return (
    <Alert variant="outlined" severity="info">
      {props.children}
    </Alert>
  );
};

export default AlertItem;
