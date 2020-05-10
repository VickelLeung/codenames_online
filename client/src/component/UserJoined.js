import React from "react";
import styled from "styled-components";

export default ({ name }) => (
  <Wrapper>
    <p>The user {name} has joined the chat.</p>
  </Wrapper>
);

const Wrapper = styled.div``;
