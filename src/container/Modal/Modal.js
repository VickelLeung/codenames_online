import React, { PureComponent } from "react";
import Modal from "@material-ui/core/Modal";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

class ModalContainer extends PureComponent {
  state = { close: false };
  render() {
    return (
      <Modal open={this.props.isModal} onclose={true}>
        <Wrapper>
          <p>Welcome to Codenames, below is a video explaining the game</p>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=zQVHkl8oQEU"
            playing={false}
            volume={true}
            controls={true}
          />
          <LinkBtn to="/game">
            <Button variant="contained">Play now</Button>
          </LinkBtn>
        </Wrapper>
      </Modal>
    );
  }
}

export default ModalContainer;

const Wrapper = styled.div`
  text-align: center;
  margin: 2% 5%;
  color: white;
  height: 80vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LinkBtn = styled(Link)`
  margin: 4% 0;
  text-decoration: none;
`;
