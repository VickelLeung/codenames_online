import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
// import SendIcon from "@material-ui/icons/Send";
import styled from "styled-components";
import Button from "@material-ui/core/Button";

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
            <TextField
              style={{ height: "100%", width: "80%", color: "black" }}
              rows={2}
              disabled={!this.props.isJoined}
              type="text"
              placeholder={"Enter message..."}
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
            />

            <Button disabled={!this.props.isJoined} type="submit">
              Send
            </Button>
          </InputContainer>
        </form>
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

export default connect(mapStateToProps, null)(ChatInput);

const Wrapper = styled.div``;

const Send = styled.input`
  width: 20%;
  padding: 24% 50%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
