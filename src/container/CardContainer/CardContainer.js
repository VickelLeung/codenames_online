import React, { PureComponent } from "react";

import Cards from "../../component/Cards/Cards";
import CardSkeleton from "../CardSkeleton/CardSkeleton";
import { connect } from "react-redux";
import styled from "styled-components";

import { URL } from "../../constant/constant";

class CardContainer extends PureComponent {
  ws = new WebSocket(URL.base);
  state = {
    cards: [],
    skeletonSize: 25,
  };
  update = (data) => {
    // console.log(data.item);

    const message = {
      type: "updateCards",
      name: data.item,
      user: this.props.username,
    };

    this.ws.send(JSON.stringify(message));
  };

  componentDidMount = () => {
    // console.log("Card loaded");

    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      // this.props.setConnection(true);
      const message = {
        type: "getCards",
      };
      this.ws.send(JSON.stringify(message));
      this.pong();
    };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      switch (message.type) {
        case "getCards":
          this.addCards(message.cards);
        case "ping":
          setTimeout(() => {
            this.pong();
          }, 40000);
          break;
      }
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL.base);
    };
  };

  pong = () => {
    const message = {
      type: "pong",
    };
    this.ws.send(JSON.stringify(message));
  };

  addCards = (card) => {
    this.setState({ cards: card });
  };

  render() {
    return (
      <Wrapper>
        {this.state.cards.length != 0
          ? null
          : Array(this.state.skeletonSize).fill(<CardSkeleton />)}
        {this.state.cards.map((items, index) => (
          <CardItem
            key={index}
            onClick={this.update}
            type={items.type}
            color={items.color}
            isChecked={items.isChecked}
          >
            {items.name}
          </CardItem>
        ))}
      </Wrapper>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps, null)(CardContainer);

const Wrapper = styled.div`
  background: #f8f8f8;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: 1px solid #f8f8f8;
  margin: 2% 5%;
  padding: 2%;

  @media screen and (max-width: 420px) {
    margin: 0px;
    padding: 0px;
  }
`;

const CardItem = styled(Cards)`
  .MuiCardContent-root {
    padding: 0;
  }
`;
