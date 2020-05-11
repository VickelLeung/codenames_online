import React from "react";
import styled from "styled-components";
const Scoreboard = (props) => {
  return (
    <Wrapper>
      <TeamName
        style={{
          color: "white",
          background: props.name == "RED" ? "red" : "blue",
        }}
      >
        {props.name}
      </TeamName>
      <Number
        style={{
          color: props.name == "RED" ? "red" : "blue",
        }}
      >
        {props.Number}
      </Number>
    </Wrapper>
  );
};

export { Scoreboard };

const Wrapper = styled.div`
  border: 1px solid #f0f0f0;
  margin: 1%;
`;

const TeamName = styled.div``;

const Number = styled.div``;
