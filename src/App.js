/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import './App.css';
import NewGuest from './NewGuest';

function App() {
  const [guests, setGuests] = useState([]);

  const addGuest = (guest) => {
    console.log(guest);
  };

  return (
    <div>
      <NewGuest onAdd={addGuest} />
    </div>
  );
}

export default App;
