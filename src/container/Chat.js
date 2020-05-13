import React, { Component } from "react";
import ChatInput from "../component/ChatInput";
import ChatMessage from "../component/ChatMessage";
import { connect } from "react-redux";
// import UserJoined from "../component/UserJoined";
import { Element } from "react-scroll";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import styled from "styled-components";
import { setJoined, setUser } from "../action/action";
import Radio from "@material-ui/core/Radio";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class Chat extends Component {
  state = {
    username: "",
    name: "",
    userJoined: "",
    messages: [],
    isChatLoaded: false,
    checked: "red",
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
  };

  submitMessage = (messageString) => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = {
      type: "chat",
      name: this.state.username,
      message: messageString,
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
      this.props.setJoined(true);
      this.props.setUser(this.state.username);
    } else {
      alert("Error,  fill your username");
    }
  };

  displayJoin = () => {
    return (
      <JoinWrapper>
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

  render() {
    return (
      <div>
        <JoinContainer>
          {this.props.isJoined ? null : this.displayJoin()}
        </JoinContainer>
        <Element
          style={{
            position: "relative",
            height: "60vh",
            width: "100%",
            overflow: "scroll",
          }}
        >
          {/* <p>display history</p> */}
          {/* <UserJoined name={this.state.userJoined} /> */}

          {this.state.messages.map((message, index) => (
            <ChatMessage
              key={index}
              type={message.type}
              message={message.message}
              name={message.name}
            />
          ))}
        </Element>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={(messageString) => this.submitMessage(messageString)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { details: state.userDetail, isJoined: state.isJoined };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setJoined: (info) => {
      dispatch(setJoined(info));
    },
    setUser: (info) => {
      dispatch(setUser(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const JoinRoom = styled(Button)``;

const JoinWrapper = styled.div`
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
`;
