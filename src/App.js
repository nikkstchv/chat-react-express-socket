import React, { useReducer, useEffect } from 'react';
import socket from './socket';

import reducer from './reducer';
import JoinBlock from './components/JoinBlock'

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null
  });

  const onLogin = (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
  };

  useEffect(() => {
    socket.on('ROOM:JOINED', users => {
      console.log('новый пользователь', users);
    })
  }, []);


  return (
    <div className="wrapper">
      {!state.joined && <JoinBlock onLogin={onLogin} />}
    </div>

  );
}

export default App;
