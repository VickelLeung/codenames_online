import React from "react";
import styled from "styled-components";
import Chip from "@material-ui/core/Chip";

export default ({ type, name, message }) => (
  <Wrapper>
    {type == "chat" ? (
      <div>
        <strong>{name}</strong>: <Chip label={message} />{" "}
      </div>
    ) : null}
    {type == "join" ? <p>{name} has joined the chat.</p> : null}
  </Wrapper>
);

const Wrapper = styled.div``;
