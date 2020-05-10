import React, { PureComponent } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import styled from "styled-components";
import { setRedScore, setBlueScore } from "../../action/action";

const URL = "ws://localhost:3030";

class Cards extends PureComponent {
  ws = new WebSocket(URL);
  componentDidMount = () => {
    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages

      const message = JSON.parse(evt.data);
      switch (message.type) {
        case "redScore":
          this.props.setRedScore(message.redScore);
          break;
        case "blueScore":
          this.props.setBlueScore(message.blueScore);
          break;
      }
    };
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
      <Card
        style={this.props.isChecked ? this.displaySelect : this.displayPlayer}
      >
        <CardActionArea
          disabled={this.props.spy || this.props.isChecked}
          onClick={() => {
            if (this.props.color == "red") {
              const message = {
                type: "redScore",
                redScore: this.props.redScore,
              };
              this.ws.send(JSON.stringify(message));
            } else if (this.props.color == "blue") {
              const message = {
                type: "blueScore",
                blueScore: this.props.blueScore,
              };
              this.ws.send(JSON.stringify(message));
            }
            console.log("color: " + this.props.color);
            console.log(this.props.redScore + " " + this.props.blueScore);
          }}
        >
          <CardContent>
            <Word style={this.props.spy ? this.displaySpymaster : null}>
              {this.props.children}
            </Word>
          </CardContent>
        </CardActionArea>
      </Card>
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
