import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  };
  state = {
    message: "",
  };

  render() {
    return (
      <form
        action="."
        onSubmit={(e) => {
          e.preventDefault();
          this.props.onSubmitMessage(this.state.message);
          this.setState({ message: "" });
        }}
      >
        <input
          type="text"
          placeholder={"Enter message..."}
          value={this.state.message}
          onChange={(e) => this.setState({ message: e.target.value })}
        />

        <input type="submit"></input>
      </form>
    );
  }
}

export default ChatInput;
