import React, { PureComponent } from "react";

import Cards from "../../component/Cards/Cards";

import styled from "styled-components";

class CardContainer extends PureComponent {
  clicked = () => {
    console.log("click");
  };

  render() {
    return (
      <Wrapper>
        <Cards color="red">Fan</Cards>
        <Cards onClick={this.clicked} color="blue">
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
        </Cards>
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
