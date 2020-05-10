import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <Wrapper>
      <h1>Codename</h1>
      <Instruction>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage
      </Instruction>
      <StartButton to="/game">Play now</StartButton>
    </Wrapper>
  );
};

export { Homepage };

const Wrapper = styled.div``;

const Instruction = styled.div`
  text-align: center;
`;

const StartButton = styled(Link)``;
