/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

function List({ children }) {
  return <p>{children}</p>;
}

export default function NewGuest({ onAdd }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const baseUrl = 'http://localhost:4000';
  // make different component for each task
  // try to send data to api
  // get back data to display guests on website

  const sendGuest = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/guests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
  };

  return (
    <>
      <List>{firstName}</List>
      <div data-test-id="guest">
        <form onSubmit={sendGuest}>
          <div>
            <label>
              First Name
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />{' '}
            </label>
          </div>
          <div className="form-control">
            <label>
              Last Name
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
          {/* <div className="form-control form-control-check">
        <label>Reminder</label>
        <input
          type="checkbox"
          checked={reminder}
          value={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div> */}
          <label>
            <input type="submit" value="Add" />
          </label>
        </form>
      </div>
    </>
  );
}
