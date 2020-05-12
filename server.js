const express = require("express");
const cors = require("cors");

// const app = express();

const mongoose = require("mongoose");
let Cards = require("./Model/CardModel");
const INDEX = "/index.html";
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// app.use(cors());
// app.use(express.json());

// app.listen(port2, () => console.log(`Example app listening on port ${port2}!`));

// app.get("/", function (req, res) {
//   res.send("hello world");
// });

// latest 100 messages
let history = [];
let loadingCard = [];
let gameState = [];
// set number of spymaster
let numSpymaster = 2;

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
    // console.log(getData.type);
    // console.log(loadingCard);

    const sendMessage = () => {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          data.type = "chat";
          client.send(data);
        }
      });
    };

    const joinChatroom = () => {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          data.type = "join";
          client.send(data);
        }
      });
    };

    const endTurn = () => {
      let getData = JSON.parse(data);
      // console.log("end turn" + getData.currentTurn);
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          let sendObj = {
            type: "endTurn",
            currentTurn: getData.currentTurn,
          };
          client.send(JSON.stringify(sendObj));
        }
      });
    };

    const redScore = () => {
      let getData = JSON.parse(data);

      if (getData.redScore == 0) {
        sendWin("redWon");
      } else {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log(getData);

            let sendObj = {
              type: "redScore",
              redScore: getData.redScore - 1,
            };
            client.send(JSON.stringify(sendObj));
          }
        });
      }
    };

    const blueScore = () => {
      let getData = JSON.parse(data);
      if (getData.blueScore == 0) {
        sendWin("blueWon");
      } else {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            let sendObj = {
              type: "blueScore",
              blueScore: getData.blueScore - 1,
            };
            client.send(JSON.stringify(sendObj));
          }
        });
      }
    };

    const sendWin = (x) => {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          let sendObj = {
            type: x,
          };
          client.send(JSON.stringify(sendObj));
        }
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
      generateCards();
      getCards();
    };

    const updateSpymaster = () => {
      let getData = JSON.parse(data);
      let returnType = "";
      if (numSpymaster >= 0) {
        if (getData.isActive) {
          numSpymaster - 1;
          returnType = "spymaster";
        } else if (!getData.isActive) {
          numSpymaster + 1;
          returnType = "player";
        }
        console.log(getData.player);
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            let sendObj = {
              type: returnType,
              name: getData.player,
            };
            client.send(JSON.stringify(sendObj));
          }
        });
      }
    };

    switch (getData.type) {
      case "chat":
        sendMessage();
        break;
      case "join":
        joinChatroom();
        break;
      case "endTurn":
        endTurn();
        break;
      case "redScore":
        console.log("redscore");
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
  // console.log("inside generate");

  Cards.find()
    .then((obj) => {
      let randomNumbers = [];
      let cardContainer = [];
      //get 25 cards from db

      // console.log(obj[0].name);

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
      // console.log("\n");
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

      // for (let i = 0; i < cardContainer.length; i++) {
      //   console.log(cardContainer[i]);
      // }
      loadingCard = [];

      loadingCard = loadingCard.concat(cardContainer);
    })
    .catch((err) => console.log(err));
};

generateCards();

// let getData = JSON.parse(data);

// switch (getData.type) {
//   case "chat":
//     console.log("Chat");
//     sendMessage();
//     break;
//   case "cards":
//     // getCards();
//     break;
// }

//getCards = () => {
//get 25 cards from db
//assign 4 as neutral
//assign 1 as death cards
//assign 10 blue cards
//assign 10 red cards
//send back to clients
// wss.clients.forEach(function each(client) {
//   if (client !== ws && client.readyState === WebSocket.OPEN) {
//     client.send(data);
//   }
// });
//};

// app.get("/", (req, res) => {
//   res.send("Hello there");
// });

// app.listen(port, () => {
//   console.log("Listening on " + port);
// });

// app.get("/", (req, res) => {
//   console.log("okay");
//   wss.on("connection", function connection(ws) {
//     console.log("generate pass");
//     ws.on("message", function incoming(data) {
//       wss.clients.forEach(function each(client) {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(data);
//         }
//       });
//     });
//   });
//   res.send("done");
// });

// // Port where we'll run the websocket server
// var webSocketsServerPort = 1337;
// // websocket and http servers
// var webSocketServer = require("websocket").server;
// var http = require("http");
// /**
//  * Global variables
//  */
// // latest 100 messages
// var history = [];
// // list of currently connected clients (users)
// var clients = [];
// /**
//  * Helper function for escaping input strings
//  */
// function htmlEntities(str) {
//   return String(str)
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }
// // Array with some colors
// var colors = ["red", "green", "blue", "magenta", "purple", "plum", "orange"];
// // ... in random order
// colors.sort(function (a, b) {
//   return Math.random() > 0.5;
// });
// /**
//  * HTTP server
//  */
// var server = http.createServer(function (request, response) {
//   // Not important for us. We're writing WebSocket server,
//   // not HTTP server
// });
// server.listen(webSocketsServerPort, function () {
//   console.log(
//     new Date() + " Server is listening on port " + webSocketsServerPort
//   );
// });
// /**
//  * WebSocket server
//  */
// var wsServer = new webSocketServer({
//   // WebSocket server is tied to a HTTP server. WebSocket
//   // request is just an enhanced HTTP request. For more info
//   // http://tools.ietf.org/html/rfc6455#page-6
//   httpServer: server,
// });
// // This callback function is called every time someone
// // tries to connect to the WebSocket server
// wsServer.on("request", function (request) {
//   console.log(new Date() + " Connection from origin " + request.origin + ".");
//   // accept connection - you should check 'request.origin' to
//   // make sure that client is connecting from your website
//   // (http://en.wikipedia.org/wiki/Same_origin_policy)
//   var connection = request.accept(null, request.origin);
//   // we need to know client index to remove them on 'close' event
//   var index = clients.push(connection) - 1;
//   var userName = false;
//   var userColor = false;
//   console.log(new Date() + " Connection accepted.");
//   // send back chat history
//   if (history.length > 0) {
//     connection.sendUTF(JSON.stringify({ type: "history", data: history }));
//   }
//   // user sent some message
//   connection.on("message", function (message) {
//     if (message.type === "utf8") {
//       // accept only text
//       // first message sent by user is their name
//       if (userName === false) {
//         // remember user name
//         userName = htmlEntities(message.utf8Data);
//         // get random color and send it back to the user
//         userColor = colors.shift();
//         connection.sendUTF(JSON.stringify({ type: "color", data: userColor }));
//         console.log(
//           new Date() +
//             " User is known as: " +
//             userName +
//             " with " +
//             userColor +
//             " color."
//         );
//       } else {
//         // log and broadcast the message
//         console.log(
//           new Date() +
//             " Received Message from " +
//             userName +
//             ": " +
//             message.utf8Data
//         );

//         // we want to keep history of all sent messages
//         var obj = {
//           time: new Date().getTime(),
//           text: htmlEntities(message.utf8Data),
//           author: userName,
//           color: userColor,
//         };
//         history.push(obj);
//         history = history.slice(-100);
//         // broadcast message to all connected clients
//         var json = JSON.stringify({ type: "message", data: obj });
//         for (var i = 0; i < clients.length; i++) {
//           clients[i].sendUTF(json);
//         }
//       }
//     }
//   });
//   // user disconnected
//   connection.on("close", function (connection) {
//     if (userName !== false && userColor !== false) {
//       console.log(
//         new Date() + " Peer " + connection.remoteAddress + " disconnected."
//       );
//       // remove user from the list of connected clients
//       clients.splice(index, 1);
//       // push back user's color to be reused by another user
//       colors.push(userColor);
//     }
//   });
// });
