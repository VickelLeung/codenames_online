import React, { PureComponent } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { setUser } from "../action/action";
import { Link, withRouter } from "react-router-dom";

const URL = "ws://localhost:3030";

class Setting extends PureComponent {
  state = {
    username: "Bobby",
    displayUser: "",
  };

  ws = new WebSocket(URL);

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
    };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      console.log(message);
      // let obj = JSON.parse(message);
      console.log(message.username);
      this.setState({ displayUser: message.username });

      //this.addMessage(message);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
        name: "john",
        //this.props.details.username,
      });
    };
  }

  addMessage = (message) => {
    let obj = JSON.parse(message);
    console.log(obj.username);
    this.setState({ displayUser: obj.username });
    // console.log(this.state.displayUser);
  };

  // submitMessage = (messageString) => {
  //   // on submitting the ChatInput form, send the message, add it to the list and reset the input
  //   const message = {
  //     name: this.props.details.username,
  //     message: messageString,
  //   };
  //   this.ws.send(JSON.stringify(message));
  //   this.addMessage(message);
  // };

  StartGame = () => {
    const user = { username: this.state.username };
    console.log("user: " + user);
    this.props.setUser(user);
    this.props.history.push("/game");
  };

  render() {
    return (
      <div>
        <h1>Setting</h1>
        <MainWrapper>
          <SettingContainer>
            <AvatarContainer></AvatarContainer>
            <UsernameContainer>
              <TextField
                label="Username"
                onChange={(e) => {
                  this.setState({ username: e.target.value });
                  //this.ws.send(JSON.stringify({ username: e.target.value }));
                }}
                value={this.state.username}
              />
            </UsernameContainer>
          </SettingContainer>
          <MenuContainer>
            <p>me: {this.state.username}</p>
            <p>{this.state.displayUser}</p>
            {/* <AvatarList>
              <p>Rick</p>
            </AvatarList> */}
            {/* onClick generate random room and transfer everyone there */}
            <Button onClick={this.StartGame}>Start Game</Button>
          </MenuContainer>
        </MainWrapper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (info) => {
      dispatch(setUser(info));
    },
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Setting));

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SettingContainer = styled.div`
  border: 1px solid black;
  padding: 2%;
  margin: 0 2%;
`;

const MenuContainer = styled.div`
  border: 1px solid black;
  margin: 0 2%;
`;

const AvatarContainer = styled.div``;

const AvatarList = styled.div`
  display: flex;
  flex-direction: row;
`;

const UsernameContainer = styled.div``;
