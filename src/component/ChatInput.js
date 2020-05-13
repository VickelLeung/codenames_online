import React, { Component } from "react";
import PropTypes from "prop-types";
// import TextField from "@material-ui/core/TextField";
// import SendIcon from "@material-ui/icons/Send";
import styled from "styled-components";

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  };
  state = {
    message: "",
  };

  render() {
    return (
      <Wrapper>
        <form
          action="."
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmitMessage(this.state.message);
            this.setState({ message: "" });
          }}
        >
          <InputContainer>
            <Input
              type="text"
              placeholder={"Enter message..."}
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
            />

            <Send type="submit"></Send>
          </InputContainer>
        </form>
      </Wrapper>
    );
  }
}

export default ChatInput;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
`;

const Input = styled.input`
  height: 100%;
  width: 80%;
`;
const Send = styled.input`
  width: 20%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
