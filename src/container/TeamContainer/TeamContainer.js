import React, { PureComponent } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class TeamContainer extends PureComponent {
  state = {
    blueTeam: [
      { name: "Bruce Lee" },
      { name: "George Bush" },
      { name: "Bruce Lee" },
      { name: "George Bush" },
      { name: "Bruce Lee" },
      { name: "George Bush" },
    ],
    redTeam: [{ name: "Rick James" }, { name: "John Cena" }],
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
        case "getRedTeams":
          this.addMessage(message);
          break;
        case "getBlueTeams":
          this.addMessage(message);
          break;
      }
    };
  }

  addMessage = (message) => {
    console.log(message);
    let obj = this.state.messages;
    obj.push(message.teams);

    if (message.type == "getRedTeams") {
      this.setState({
        redTeam: obj,
      });
    } else if (message.type == "getBlueTeams") {
      this.setState({
        blueTeam: obj,
      });
    }
    console.log(this.state.message);
  };

  render() {
    return (
      <Wrapper>
        {/* https://www.npmjs.com/package/react-avatar */}
        <BlueContainer>
          {this.state.blueTeam.map((items) => {
            return (
              <Tooltip Tooltip title={items.name} placement="top" arrow>
                <Button style={{ margi: "0" }}>
                  <Avatar
                    style={{ margin: "0 1%" }}
                    color="#99b3ff"
                    size="35"
                    name={items.name}
                  />
                </Button>
              </Tooltip>
            );
          })}
        </BlueContainer>
        <RedContainer>
          {this.state.redTeam.map((items) => {
            return (
              <Tooltip Tooltip title={items.name} placement="top" arrow>
                <Button style={{ margi: "0" }}>
                  <Avatar
                    style={{ margin: "0 1%" }}
                    color="#ff9999"
                    size="35"
                    name={items.name}
                  />
                </Button>
              </Tooltip>
            );
          })}
        </RedContainer>
      </Wrapper>
    );
  }
}

export default TeamContainer;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const BlueContainer = styled.div`
  width: 50%;
`;

const RedContainer = styled.div`
  width: 50%;
`;
