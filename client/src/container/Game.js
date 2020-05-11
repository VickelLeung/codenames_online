import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Chat from "../container/Chat";
import Countdown from "react-countdown";
import Button from "@material-ui/core/Button";
import { setTurn, alternateSpymaster } from "../action/action";
import { Scoreboard } from "../component/Scoreboard/Scoreboard";
import { CardContainer } from "../container/CardContainer/CardContainer";
import { setConnection } from "../action/action";

const URL = "ws:https://thecodenamebackend.herokuapp.com/";

class Game extends PureComponent {
  ws = new WebSocket(URL);

  state = { userInfo: {} };
  componentDidMount = () => {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      this.props.setConnection(true);
      const message = {
        type: "getCards",
      };
      this.ws.send(JSON.stringify(message));
    };

    this.setState({ userInfo: this.props.details });

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      // const message = JSON.parse(evt.data);
      const message = JSON.parse(evt.data);
      console.log(message);
      switch (message.type) {
        case "endTurn":
          this.props.setTurn(message.currentTurn);
          break;
        case "redWon":
          alert("Red won the game");
          break;
        case "blueWon":
          alert("blue won the game");
          break;
      }
      // this.addMessage(message);
    };

    // this.ws.onclose = () => {
    //   console.log("disconnected");
    //   // automatically try to reconnect on connection loss
    //   this.setState({
    //     ws: new WebSocket(URL),
    //     name: this.props.details.username,
    //   });
    // };
  };

  endTurn = () => {
    let turn = this.props.currentTurn;
    if (turn == "RED") {
      turn = "BLUE";
    } else {
      turn = "RED";
    }
    this.props.setTurn(turn);

    const message = {
      type: "endTurn",
      currentTurn: turn,
    };
    this.ws.send(JSON.stringify(message));
  };

  nextGame = () => {
    const message = {
      type: "nextGame",
    };
    this.ws.send(JSON.stringify(message));
  };

  alternateSpy = (value) => {
    //send back to server
    console.log(this.props.username);
    const message = {
      type: "spymaster",
      player: this.props.username,
      isActive: value,
    };
    this.ws.send(JSON.stringify(message));

    this.props.alternateSpymaster(value);
  };

  render() {
    return (
      <Wrapper>
        <h1>Codenames</h1>

        <ScoreContainer>
          <Scoreboard name="BLUE" Number={this.props.blueScore} />
          <Scoreboard name="RED" Number={this.props.redScore} />
        </ScoreContainer>
        {/* <p>spy:{this.props.spy ? <p>good</p> : <p>bad</p>}</p> */}
        <Container>
          <GameContainer>
            <PlayerMode>
              <EndBtn
                disabled={!this.props.spy}
                onClick={() => this.alternateSpy(false)}
              >
                Player
              </EndBtn>
              <EndBtn
                disabled={this.props.spy}
                onClick={() => this.alternateSpy(true)}
              >
                Spymaster
              </EndBtn>
            </PlayerMode>
            {this.props.currentTurn == "RED" ? (
              <RedTurn>It's Red turn</RedTurn>
            ) : (
              <BlueTurn>It's Blue turn</BlueTurn>
            )}
            <CardContainer />
          </GameContainer>
          <ChatContainer>
            <Chat />
          </ChatContainer>
        </Container>

        <EndBtn onClick={this.endTurn}>End turn</EndBtn>
        <EndBtn onClick={this.nextGame}>Next game</EndBtn>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    redScore: state.redScore,
    blueScore: state.blueScore,
    currentTurn: state.currentTurn,
    details: state.userDetail,
    spy: state.isSpymaster,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTurn: (info) => {
      dispatch(setTurn(info));
    },
    alternateSpymaster: (info) => {
      dispatch(alternateSpymaster(info));
    },
    setConnection: (info) => {
      dispatch(setConnection(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

const Wrapper = styled.div`
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const GameContainer = styled.div`
  width: 70vw;
  margin: 1% 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ChatContainer = styled.div`
  text-align: center;
  border: 1px solid black;
  width: 30vw;
`;

const RedTurn = styled.div`
  text-align: center;
  color: black;
  width: 50%;
  background: linear-gradient(
    0deg,
    rgba(124, 123, 123, 0) 0%,
    rgba(255, 0, 0, 0.5872724089635855) 100%,
    rgba(0, 0, 0, 1) 100%,
    rgba(255, 0, 0, 0) 100%
  );
`;

const BlueTurn = styled.div`
  color: black;
  width: 50%;
  background: linear-gradient(
    0deg,
    rgba(124, 123, 123, 0) 0%,
    rgba(14, 0, 255, 0.5872724089635855) 100%,
    rgba(0, 0, 0, 1) 100%,
    rgba(255, 0, 0, 0) 100%
  );
`;

const EndBtn = styled(Button)``;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PlayerMode = styled.div`
  display: flex;
  flex-direction: row;
`;
