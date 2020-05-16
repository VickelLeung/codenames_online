import React from "react";
import styled from "styled-components";
import Chip from "@material-ui/core/Chip";

export default ({ type, name, message, color }) => (
  <Wrapper>
    {type == "chat" ? (
      <div>
        <Username style={{ color: color == "red" ? "#FF4A6B" : "#4CB2ED " }}>
          {name}
        </Username>
        : <Chip label={message} />
      </div>
    ) : null}
    {type == "join" ? (
      <p>
        <strong style={{ color: color == "red" ? "#FF4A6B" : "#4CB2ED " }}>
          {name}
        </strong>
        &nbsp;has joined the chat.
      </p>
    ) : null}
    {type == "spymaster" ? (
      <p>
        <strong>{name} </strong>became a spymaster.
      </p>
    ) : null}
    {type == "player" ? (
      <p>
        <strong>{name}</strong> became a player.
      </p>
    ) : null}
  </Wrapper>
);

const Wrapper = styled.div`
  text-align: left;
  margin: 2% 0;
`;

const Username = styled.span`
  font-size: 1.3em;
  font-style: bold;
`;
