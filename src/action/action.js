export const setUser = (userObj) => ({
  type: "SET_USER",
  payload: userObj,
});

export const setTurn = (userObj) => ({
  type: "SET_TURN",
  payload: userObj,
});

export const setRedScore = (userObj) => ({
  type: "SET_REDSCORE",
  payload: userObj,
});

export const setBlueScore = (userObj) => ({
  type: "SET_BLUESCORE",
  payload: userObj,
});

export const decrementRedScore = () => ({
  type: "DECREMENT_REDSCORE",
});

export const decrementBlueScore = () => ({
  type: "DECREMENT_BLUESCORE",
});

export const alternateSpymaster = (userObj) => ({
  type: "ALTERNATE_SPYMASTER",
  payload: userObj,
});

export const setConnection = (userObj) => ({
  type: "SET_CONNECTION",
  payload: userObj,
});

export const setJoined = (userObj) => ({
  type: "SET_JOINED",
  payload: userObj,
});
