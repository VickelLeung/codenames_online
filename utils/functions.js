export const sendMessage = () => {
  wss.clients.forEach(function each(client) {
    // if (client !== ws && client.readyState === WebSocket.OPEN) {
    data.type = "chat";
    client.send(data);
    // }
  });
};
