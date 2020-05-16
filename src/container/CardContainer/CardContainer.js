import React, { PureComponent } from "react";

import Cards from "../../component/Cards/Cards";
import CardSkeleton from "../CardSkeleton/CardSkeleton";

import styled from "styled-components";

const URL = "wss://thecodenamebackend.herokuapp.com/";

class CardContainer extends PureComponent {
  ws = new WebSocket(URL);
  state = {
    cards: [],
    skeletonSize: 25,
  };
  update = (data) => {
    console.log(data);

    const message = {
      type: "updateCards",
      name: data,
    };
    this.ws.send(JSON.stringify(message));
  };

  componentDidMount = () => {
    console.log("Card loaded");

    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      // this.props.setConnection(true);
      const message = {
        type: "getCards",
      };
      this.ws.send(JSON.stringify(message));
    };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      console.log("testing");
      const message = JSON.parse(evt.data);
      console.log(message);
      switch (message.type) {
        case "getCards":
          this.addCards(message.cards);
          break;
      }
    };
  };

  addCards = (card) => {
    this.setState({ cards: card });
  };

  render() {
    return (
      <Wrapper>
        {this.state.cards
          ? null
          : Array(this.state.skeletonSize).fill(<CardSkeleton />)}
        {this.state.cards.map((items, index) => (
          <Cards
            key={index}
            onClick={this.update}
            type={items.type}
            color={items.color}
            isChecked={items.isChecked}
          >
            {items.name}
          </Cards>
        ))}
      </Wrapper>
    );
  }
}

export { CardContainer };

const Wrapper = styled.div`
  background: #f8f8f8;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: 1px solid #f8f8f8;
  margin: 2% 5%;
  padding: 2%;
`;
