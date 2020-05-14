const express = require("express");

const mongoose = require("mongoose");
let Cards = require("./Model/CardModel");
const PORT = process.env.PORT || 3001;
require("dotenv").config();

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

// latest 100 messages
let history = [];
let loadingCard = [];

// score of teams
let redScoreVal = 10;
let blueScoreVal = 10;
let currentTurn = "red";

mongoose.connect(process.env.uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("connection established");
});

// const WebSocket = require("ws");
const { Server } = require("ws");
const wss = new Server({ server });

// const wss = new WebSocket.Server({ port: port });

wss.on("connection", function connection(ws) {
  ws.room = [];

  ws.on("message", function incoming(data) {
    let getData = JSON.parse(data);

    const sendMessage = () => {
      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        data.type = "chat";
        client.send(data);
        // }
      });
    };

    const joinChatroom = () => {
      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        data.type = "join";
        client.send(data);
        // }
      });
    };

    alternateTurn = () => {
      if ((currentTurn = "red")) {
        currentTurn = "blue";
      } else if (currentTurn == "blue") {
        currentTurn = "red";
      }
    };

    const endTurn = () => {
      // let getData = JSON.parse(data);
      // console.log("end turn" + getData.currentTurn);

      this.alternateTurn();

      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        let sendObj = {
          type: "endTurn",
          currentTurn: currentTurn,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    const getTurn = () => {
      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        let sendObj = {
          type: "getTurn",
          currentTurn: currentTurn,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    const redScore = () => {
      let getData = JSON.parse(data);

      if (redScoreVal == 0) {
        sendWin("redWon");
      } else {
        wss.clients.forEach(function each(client) {
          // if (client !== ws && client.readyState === WebSocket.OPEN) {
          // console.log(getData);

          let sendObj = {
            type: "redScore",
            redScore: redScoreVal - 1,
          };
          client.send(JSON.stringify(sendObj));
          // }
        });
      }
    };

    const blueScore = () => {
      if (blueScoreVal == 0) {
        sendWin("blueWon");
      } else {
        wss.clients.forEach(function each(client) {
          // if (client !== ws && client.readyState === WebSocket.OPEN) {
          let sendObj = {
            type: "blueScore",
            blueScore: blueScoreVal - 1,
          };
          client.send(JSON.stringify(sendObj));
          // }
        });
      }
    };

    const sendWin = (x) => {
      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        let sendObj = {
          type: x,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    const getCards = () => {
      wss.clients.forEach(function each(client) {
        // if (client.readyState === WebSocket.OPEN) {
        let sendObj = {
          type: "getCards",
          cards: loadingCard,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    const updateCards = () => {
      //find name and update it
      let getData = JSON.parse(data);
      for (let i = 0; i < loadingCard.length; i++) {
        if (loadingCard[i].name == getData.name) {
          loadingCard[i].isChecked = true;
          break;
        }
      }

      wss.clients.forEach(function each(client) {
        // if (client.readyState === WebSocket.OPEN) {

        let sendObj = {
          type: "getCards",
          cards: loadingCard,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    const nextGame = () => {
      redScore = 10;
      blueScore = 10;
      generateCards();
      getCards();
    };

    const updateSpymaster = () => {
      let getData = JSON.parse(data);
      let returnType = "";

      if (getData.isActive) {
        returnType = "spymaster";
      } else if (!getData.isActive) {
        returnType = "player";
      }
      console.log(getData.player);
      wss.clients.forEach(function each(client) {
        // if (client !== ws && client.readyState === WebSocket.OPEN) {
        let sendObj = {
          type: returnType,
          name: getData.player,
        };
        client.send(JSON.stringify(sendObj));
        // }
      });
    };

    switch (getData.type) {
      case "chat":
        sendMessage();
        break;
      case "join":
        joinChatroom();
        break;
      case "getTurn":
        getTurn();
        break;
      case "endTurn":
        endTurn();
        break;
      case "redScore":
        redScore();
        break;
      case "blueScore":
        blueScore();
        break;
      case "getCards":
        getCards();
        break;
      case "nextGame":
        nextGame();
        break;
      case "updateCards":
        updateCards();
        break;
      case "spymaster":
        updateSpymaster();
        break;
    }
  });
});

const generateCards = () => {
  Cards.find()
    .then((obj) => {
      let randomNumbers = [];
      let cardContainer = [];

      // generate 25 random numbers
      for (let i = 0; i < 25; i++) {
        let rand = Math.floor(Math.random() * obj.length);
        if (!randomNumbers.includes(rand)) {
          randomNumbers.push(rand);
        } else {
          i--;
        }
      }

      //assign 4 as neutral
      for (let i = 0; i < 4; i++) {
        let card = {
          name: obj[randomNumbers[i]].name,
          type: "neutral",
          color: "green",
          isChecked: false,
        };
        cardContainer.push(card);
      }

      //assign 1 as death cards
      for (let i = 4; i < 5; i++) {
        let card = {
          name: obj[randomNumbers[i]].name,
          type: "death",
          color: "black",
          isChecked: false,
        };
        cardContainer.push(card);
      }

      //assign 10 blue cards
      for (let i = 5; i < 15; i++) {
        let card = {
          name: obj[randomNumbers[i]].name,
          type: "blue",
          color: "blue",
          isChecked: false,
        };
        cardContainer.push(card);
      }
      //assign 10 red cards
      for (let i = 15; i < 25; i++) {
        let card = {
          name: obj[randomNumbers[i]].name,
          type: "red",
          color: "red",
          isChecked: false,
        };
        cardContainer.push(card);
      }

      //shuffle array with Fisher-Yates:

      for (let i = cardContainer.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cardContainer[i];
        cardContainer[i] = cardContainer[j];
        cardContainer[j] = temp;
      }

      loadingCard = [];

      loadingCard = loadingCard.concat(cardContainer);
    })
    .catch((err) => console.log(err));
};

generateCards();
