import React, { PureComponent } from "react";

import Cards from "../../component/Cards/Cards";

import styled from "styled-components";

const URL = "ws://thecodenamebackend.herokuapp.com/";

class CardContainer extends PureComponent {
  ws = new WebSocket(URL);
  state = {
    cards: [],
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
        {/* {this.state.cards.map((items) => {
          <Cards onClick={this.update} type={items.type} color={items.color}>
            {items.name}
          </Cards>;
        })} */}

        {/* <Cards onClick={this.update} color="red">
          Fan
        </Cards>
        <Cards onClick={this.update} color="blue">
          Blue
        </Cards>
        <Cards type="red" color="red" isChecked={true}>
          Red
        </Cards>
        <Cards type="blue" color="blue" isChecked={true}>
          Note
        </Cards>
        <Cards type="red" color="red">
          Fan
        </Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="red">Fan</Cards>
        <Cards color="blue">Note</Cards>
        <Cards color="blue">Note</Cards>

        <Cards type="neutral" color="green" isChecked={true}>
          Neutral
        </Cards>
        <Cards type="neutral" color="green">
          Neutral
        </Cards>
        <Cards type="neutral" color="green">
          Neutral
        </Cards>
        <Cards type="neutral" color="green">
          Neutral
        </Cards>
        <Cards type="death" color="black" isChecked={true}>
          Death
        </Cards> */}
      </Wrapper>
    );
  }
}

export { CardContainer };

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
