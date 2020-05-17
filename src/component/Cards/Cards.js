import React, { PureComponent } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";

import { connect } from "react-redux";
import styled from "styled-components";
import { setTurn, setRedScore, setBlueScore } from "../../action/action";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class Cards extends PureComponent {
  ws = new WebSocket(URL);

  componentDidMount = () => {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");

      this.pong();
    };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages

      const message = JSON.parse(evt.data);
      switch (message.type) {
        case "getRedScore":
          this.props.setRedScore(message.redScore);
          break;
        case "getBlueScore":
          this.props.setBlueScore(message.blueScore);
        case "ping":
          setTimeout(() => {
            this.pong();
          }, 40000);
          break;
      }
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL);
    };
  };

  pong = () => {
    // console.log("pong sent");
    const message = {
      type: "pong",
    };
    this.ws.send(JSON.stringify(message));
  };

  getColors = () => {
    let color = "";
    if (this.props.type == "red") {
      color = "#FF8E8E";
    } else if (this.props.type == "blue") {
      color = "#8C9FED";
    } else if (this.props.type == "neutral") {
      color = "#A8E89E";
    } else if (this.props.type == "death") {
      color = "#818581";
    }
    return color;
  };

  endTurn = () => {
    const message = {
      type: "endTurn",
    };
    this.ws.send(JSON.stringify(message));
    // console.log("end");
  };

  sendToServer = () => {
    // console.log(this.props.color);
    let message = {};
    if (this.props.color == "green") {
      this.endTurn();
    } else {
      if (this.props.color == "red" && this.props.currentTurn == "red") {
        message = {
          type: "redScore",
        };
      } else if (
        this.props.color == "red" &&
        this.props.currentTurn == "blue"
      ) {
        message = {
          type: "redScore",
        };
        this.endTurn();
      }

      if (this.props.color == "blue" && this.props.currentTurn == "blue") {
        message = {
          type: "blueScore",
        };
      } else if (
        this.props.color == "blue" &&
        this.props.currentTurn == "red"
      ) {
        message = {
          type: "blueScore",
        };

        this.endTurn();
      }
      // console.log(message);
      this.ws.send(JSON.stringify(message));
    }

    this.props.onClick(this.props.children);
  };

  displaySpymaster = { color: this.props.color };

  displayPlayer = { margin: "1%", width: "15%", boxSizing: " border-box" };

  displaySelect = {
    background: this.getColors(),
    margin: "1%",
    width: "15%",
    boxSizing: " border-box",
  };

  render() {
    return (
      <CardItem
        style={this.props.isChecked ? this.displaySelect : this.displayPlayer}
      >
        <CardActionArea
          disabled={this.props.spy || this.props.isChecked}
          onClick={() => {
            this.sendToServer();
          }}
        >
          <CardContent>
            <Word style={this.props.spy ? this.displaySpymaster : null}>
              {this.props.children}
            </Word>
          </CardContent>
        </CardActionArea>
      </CardItem>
    );
  }
}

const mapStateToProps = (state) => {
  return {
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
    setRedScore: (info) => {
      dispatch(setRedScore(info));
    },
    setBlueScore: (info) => {
      dispatch(setBlueScore(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);

const Word = styled.p`
  font-weight: bold;
`;

const CardItem = styled(Card)`
  transition: background-color 2000ms linear;
`;
