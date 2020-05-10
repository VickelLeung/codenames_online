const initialState = {
  currentTurn: "RED",
  isSpymaster: false,
  isWin: false,
  isDeath: false,
  redScore: 10,
  blueScore: 10,
  userDetail: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      console.log("test");
      return { ...state, userDetail: action.payload };
    case "SET_TURN":
      return { ...state, currentTurn: action.payload };
    case "SET_REDSCORE":
      return { ...state, redScore: action.payload };
    case "SET_BLUESCORE":
      return { ...state, blueScore: action.payload };
    case "ALTERNATE_SPYMASTER":
      console.log("asd");
      return { ...state, isSpymaster: action.payload };
    case "SET_DEATH":
      return { ...state, isDeath: true };
    default:
      return state;
  }
}
