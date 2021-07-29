const reducer = (state, action) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        roomId: action.payload.userName,
        userName: action.payload.roomId,

      };
  
    default:
      return state;
  }
}
export default reducer;