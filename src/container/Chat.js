import React, { Component } from "react";
import ChatInput from "../component/ChatInput";
import ChatMessage from "../component/ChatMessage";
import { connect } from "react-redux";
// import UserJoined from "../component/UserJoined";
import { Element } from "react-scroll";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { setConnection, setUser } from "../action/action";
import Radio from "@material-ui/core/Radio";

const URL = "ws:https://thecodenamebackend.herokuapp.com/";

class Chat extends Component {
  state = {
    username: "",
    name: "",
    userJoined: "",
    messages: [],
    isChatLoaded: false,
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
    this.addMessage(message);
  };

  joinChat = () => {
    if (this.state.username) {
      const message = {
        type: "join",
        name: this.state.username,
      };
      this.ws.send(JSON.stringify(message));
      this.props.setUser(this.state.username);
    } else {
      alert("error, enter fill your username");
    }
  };

  render() {
    return (
      <div>
        <TextField
          label="Username"
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
          value={this.state.username}
        />
        <Radio />
        <Radio />
        <JoinRoom onClick={this.joinChat}>Join</JoinRoom>
        <Element
          style={{
            position: "relative",
            height: "50vh",
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
  return { details: state.userDetail };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConnection: (info) => {
      dispatch(setConnection(info));
    },
    setUser: (info) => {
      dispatch(setUser(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const JoinRoom = styled(Button)``;
