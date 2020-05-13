import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import bgImg from "../assets/images/codenames.jpeg";

const Homepage = () => {
  return (
    <Wrapper>
      <MainContainer>
        <Container>
          <Title>The Codenames</Title>
          <Instruction>
            Welcome to Codenames, this is a very simple games of codenames. If
            you are not very familiar with the game, you can refer to how to
            play for more information.
          </Instruction>
          <ButtonContainer>
            <Button variant="contained">How to play</Button>
            <StartButton to="/game">
              <Button variant="contained">Play now</Button>
            </StartButton>
          </ButtonContainer>
        </Container>
      </MainContainer>
      <Footer>
        <p>
          This game was made possible due to coronavirus, follow me throught
          github
          <a
            style={{ textDecoration: "none" }}
            href="https://github.com/VickelLeung"
          >
            <Button variant="outlined" style={{ color: "white" }}>
              @click here
            </Button>
          </a>
          or buy me a coffee by donating here
        </p>
      </Footer>
    </Wrapper>
  );
};

export { Homepage };

const Wrapper = styled.div`
  height: 100vh;
  background-image: url(${bgImg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Instruction = styled.div`
  text-align: center;
  margin: 3% 10%;
`;

const StartButton = styled(Link)`
  text-decoration: none;
`;

const MainContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 25%;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 1.6em;
  font-family: Chalkduster;
`;

const Container = styled.div`
  border: 1px solid black;
  padding: 3%;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Footer = styled.div`
  background: rgba(0, 0, 0, 0.9);
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0px;
  color: white;
`;
