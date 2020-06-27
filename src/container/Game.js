import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Chat from "../container/Chat";
import Button from "@material-ui/core/Button";
import {
  setTurn,
  alternateSpymaster,
  setRedScore,
  setBlueScore,
} from "../action/action";
import { Scoreboard } from "../component/Scoreboard/Scoreboard";
import CardContainer from "../container/CardContainer/CardContainer";
import { setConnection } from "../action/action";
import TeamContainer from "./TeamContainer/TeamContainer";
// import AlertItem from "../component/Alert/AlertItem";
import { withSnackbar } from "notistack";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class Game extends PureComponent {
  ws = new WebSocket(URL);

  state = { userInfo: {} };
  componentDidMount = () => {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      this.props.setConnection(true);

      //get current turn / team scores on load
      const messageTurn = {
        type: "getTurn",
      };
      this.ws.send(JSON.stringify(messageTurn));

      const messageRedScore = {
        type: "getRedScore",
      };
      this.ws.send(JSON.stringify(messageRedScore));

      const messageBlueScore = {
        type: "getBlueScore",
      };
      this.ws.send(JSON.stringify(messageBlueScore));

      this.pong();
    };

    this.setState({ userInfo: this.props.details });

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      // console.log(message);
      switch (message.type) {
        case "getTurn":
          console.log("turn");
          this.props.setTurn(message.currentTurn);
          break;
        case "endTurn":
          this.props.setTurn(message.currentTurn);
          break;
        case "getRedScore":
          this.props.setRedScore(message.redScore);
          break;
        case "getBlueScore":
          this.props.setBlueScore(message.blueScore);
          break;
        case "redWon":
          alert("Red won the game");
          break;
        case "blueWon":
          alert("blue won the game");
          break;
        case "disconnect":
          alert("disconnect receive");
          break;
        case "snackbar":
          this.handleSnack(message.user, message.item);
          break;
        case "ping":
          setTimeout(() => {
            this.pong();
          }, 40000);
          break;
      }
      // this.addMessage(message);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL);
    };

    window.onbeforeunload = function () {
      const messageBlueScore = {
        type: "disconnected",
        username: this.props.username,
        color: this.props.getColor,
      };
      this.ws.send(JSON.stringify(messageBlueScore));
      return "closing";
    };
  };

  pong = () => {
    const message = {
      type: "pong",
    };
    this.ws.send(JSON.stringify(message));
  };

  endTurn = () => {
    const message = {
      type: "endTurn",
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
    const message = {
      type: "spymaster",
      player: this.props.username,
      isActive: value,
    };
    this.ws.send(JSON.stringify(message));

    this.props.alternateSpymaster(value);
  };

  displayInfo = () => {
    return (
      <Info>
        <h1>Please join the chatroom before starting the game!</h1>
      </Info>
    );
  };

  handleSnack = (user, item) => {
    this.props.enqueueSnackbar(user + " chosed " + item);
  };

  render() {
    return (
      <Wrapper>
        <MainTitle>The Codenames</MainTitle>

        <Container>
          {this.props.isJoined ? null : this.displayInfo()}

          <GameContainer>
            <ScoreHolder>
              <Title>Scoreboard</Title>
              <ScoreContainer>
                <Scoreboard name="BLUE" Number={this.props.blueScore} />
                <Scoreboard name="RED" Number={this.props.redScore} />
              </ScoreContainer>
            </ScoreHolder>

            {this.props.currentTurn == "red" ? (
              <RedTurn>It's Red turn</RedTurn>
            ) : (
              <BlueTurn>It's Blue turn</BlueTurn>
            )}
            <UserButton>
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

              <EndBtn
                style={{ margin: "2% 0" }}
                variant="outlined"
                onClick={this.endTurn}
              >
                End turn
              </EndBtn>
            </UserButton>

            <CardContainer />
          </GameContainer>
          <HorizontalBar />

          <ChatContainer>
            {/* <TeamContainer /> */}
            <NextBtn
              style={{ margin: "4% 0", color: "white", background: "black" }}
              variant="outlined"
              onClick={this.nextGame}
            >
              Next game
            </NextBtn>
            <ChatTitle>Chatroom</ChatTitle>
            <Chat />
          </ChatContainer>
        </Container>
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
    isJoined: state.isJoined,
    getColor: state.userColor,
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
    setRedScore: (info) => {
      dispatch(setRedScore(info));
    },
    setBlueScore: (info) => {
      dispatch(setBlueScore(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Game));

const Wrapper = styled.div`
  text-align: center;
`;

const Container = styled.div`
  height: 85vh;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 420px) {
    flex-direction: column;
  }
`;

const GameContainer = styled.div`
  width: 70vw;
  margin: 1% 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 420px) {
    width: 100vw;
  }
`;

const ChatContainer = styled.div`
  text-align: center;
  width: 30vw;
  margin: 5% 2%;
  @media screen and (max-width: 420px) {
    display: flex;

    flex-direction: column;
    width: 95vw;
  }
`;

const RedTurn = styled.div`
  font-size: 1.5em;
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
  @media screen and (max-width: 420px) {
    width: 80%;
  }
`;

const BlueTurn = styled.div`
  font-size: 1.5em;
  color: black;
  width: 50%;
  background: linear-gradient(
    0deg,
    rgba(124, 123, 123, 0) 0%,
    rgba(14, 0, 255, 0.5872724089635855) 100%,
    rgba(0, 0, 0, 1) 100%,
    rgba(255, 0, 0, 0) 100%
  );
  @media screen and (max-width: 420px) {
    width: 80%;
  }
`;

const EndBtn = styled(Button)``;

const NextBtn = styled(Button)``;

const ScoreContainer = styled.div`
  font-size: 1.5em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: left;
`;

const PlayerMode = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainTitle = styled.div`
  margin-bottom: 2%;
  padding: 2%;
  font-size: 1.6em;
  font-family: Chalkduster;
  border-bottom: 2px solid black;
  background: black;
  color: white;
`;

const Title = styled.div`
  font-size: 1.5em;
`;

const ScoreHolder = styled.div`
  width: 50%;
  @media screen and (max-width: 420px) {
    width: 80%;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const UserButton = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;
  justify-content: space-between;

  @media screen and (max-width: 420px) {
    width: 80%;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  width: 65vw;
  margin: 1%;
  border: 1px solid black;
  border-radius: 20px;
  position: absolute;

  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;

  @media screen and (max-width: 420px) {
    width: 100vw;
    height: 90vh;
  }
  @media screen and (max-width: 400px) {
    height: 95vh;
  }
  @media screen and (max-width: 320px) {
    height: 110vh;
  }
`;

const ChatTitle = styled.div`
  font-size: 1.5em;
  color: white;
  background: linear-gradient(
    0deg,
    rgba(124, 123, 123, 0) 0%,
    rgba(0, 0, 0, 0.5872724089635855) 0%,
    rgba(0, 0, 0, 1) 100%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const HorizontalBar = styled.div`
border-left 4px solid black;
margin: 4% 0.1% ;
@media screen and (max-width: 420px) {
display:none;
}
`;
