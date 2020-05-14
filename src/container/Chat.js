import React, { Component } from "react";
import ChatInput from "../component/ChatInput";
import ChatMessage from "../component/ChatMessage";
import { connect } from "react-redux";
// import UserJoined from "../component/UserJoined";
import { Element, animateScroll } from "react-scroll";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import styled from "styled-components";
import { setJoined, setUser, setUserColor } from "../action/action";
import Radio from "@material-ui/core/Radio";

import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import beepMp3 from "../sounds/clearly.mp3";
import UIfx from "uifx";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class Chat extends Component {
  state = {
    username: "",
    name: "",
    userJoined: "",
    messages: [],
    isChatLoaded: false,
    checked: "red",
    isVolume: true,
  };

  ws = new WebSocket(URL);

  componentDidMount() {
    // this.ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log("connected");
    //   this.props.setConnection(true);
    // };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      // const message = JSON.parse(evt.data);
      const message = JSON.parse(evt.data);
      console.log(message.type);

      switch (message.type) {
        case "chat":
          this.addMessage(message);
          break;
        case "join":
          this.addMessage(message);
          break;
        case "spymaster":
          this.addMessage(message);
          break;
        case "player":
          this.addMessage(message);
          break;
      }
    };

    // this.ws.onclose = () => {
    //   console.log("disconnected");
    //   // automatically try to reconnect on connection loss
    //   this.setState({
    //     ws: new WebSocket(URL),
    //     name: this.props.details.username,
    //   });
    // };
  }

  addMessage = (message) => {
    console.log(message);
    let obj = this.state.messages;
    obj.push(message);
    this.setState({
      message: obj,
    });
    // this.setState((state) => ({ messages: [message, ...this.state.messages] }));
    console.log(this.state.message);
    this.scrollToBottom();
  };

  submitMessage = (messageString) => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = {
      type: "chat",
      name: this.state.username,
      message: messageString,
      color: this.props.getColor,
    };
    this.ws.send(JSON.stringify(message));
    // this.addMessage(message);
  };

  joinChat = () => {
    if (this.state.username) {
      const message = {
        type: "join",
        name: this.state.username,
        color: this.state.checked,
      };
      this.ws.send(JSON.stringify(message));
      this.props.setUserColor(this.state.checked);
      this.props.setJoined(true);
      this.props.setUser(this.state.username);
    } else {
      alert("Error,  fill your username");
    }
  };

  displayJoin = () => {
    return (
      <JoinWrapper>
        <h2 style={{ textDecoration: "underline" }}>Join chatroom</h2>
        <TextField
          label="Username"
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
          value={this.state.username}
        />
        <p>Choose a team color</p>
        <RadioContainer>
          <Radio
            style={{ color: "red" }}
            checked={this.state.checked == "red"}
            onClick={() => {
              this.setState({ checked: "red" });
            }}
          />
          <Radio
            style={{ color: "blue" }}
            checked={this.state.checked == "blue"}
            onClick={() => {
              this.setState({ checked: "blue" });
            }}
          />
        </RadioContainer>
        <JoinRoom variant="outlined" onClick={this.joinChat}>
          Join
        </JoinRoom>
      </JoinWrapper>
    );
  };
  displayChat = () => {
    return (
      <Element
        id="message"
        style={{
          position: "relative",
          height: "50vh",
          width: "100%",
          overflow: "scroll",
          margin: "3% 5%",
        }}
      >
        {this.state.messages.map((message, index) => (
          <ChatMessage
            onClick={this.scrollToBottom()}
            key={index}
            type={message.type}
            message={message.message}
            name={message.name}
            color={message.color}
          />
        ))}
      </Element>
    );
  };

  scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "message",
    });
  };

  beep = new UIfx(beepMp3);

  updateVolume = () => {
    let setVolume = 0;
    if (this.state.isVolume) {
      setVolume = 0;
    } else {
      setVolume = 1;
    }

    this.beep.setVolume(setVolume);
    this.setState({ isVolume: !this.state.isVolume });
  };

  render() {
    return (
      <Wrapper>
        <VolumeContainer>
          <Button onClick={this.updateVolume}>
            {this.state.isVolume ? <VolumeUp /> : <VolumeOff />}
          </Button>
        </VolumeContainer>
        <JoinContainer>
          {this.props.isJoined ? this.displayChat() : this.displayJoin()}
        </JoinContainer>

        <Bar />
        <ChatInput
          onload={this.props.isJoined ? this.beep.play() : null}
          ws={this.ws}
          onSubmitMessage={(messageString) => this.submitMessage(messageString)}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    details: state.userDetail,
    isJoined: state.isJoined,
    getColor: state.userColor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setJoined: (info) => {
      dispatch(setJoined(info));
    },
    setUser: (info) => {
      dispatch(setUser(info));
    },
    setUserColor: (info) => {
      dispatch(setUserColor(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const Wrapper = styled.div`
  height: 40vh;
`;

const JoinRoom = styled(Button)``;

const JoinWrapper = styled.div`
  padding: 4%;
  margin: 5%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const JoinContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-right: 1px solid black;
  border-left: 1px solid black;
`;

const Bar = styled.div`
  border-bottom: 4px solid black;
  margin-bottom: 1% 0;
`;

const VolumeContainer = styled.div`
  text-align: left;
  border-right: 1px solid black;
  border-left: 1px solid black;
`;
