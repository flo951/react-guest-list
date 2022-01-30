/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const cardDivStyles = css`
  margin-top: 2rem;
  display: flex;
  justify-content: center;

  color: white;
  background-color: #8f8f8f;
`;
const guestDivStyles = css`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  color: white;
  background-color: #109dcc;
  padding: 2rem 4rem;
  border-radius: 1rem;
  margin: 2rem 0;
`;
const buttonStyles = css`
  border-radius: 20px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;

  color: #109dcc;
  font-weight: bold;
  width: 13rem;
`;

const formStyles = css`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin: 2rem 0;
  background-color: #109dcc;
  padding: 2rem 4rem;
  border-radius: 1rem;
`;
const divCenter = css`
  display: flex;
  justify-content: center;
`;
const inputStyles = css`
  margin-left: 1rem;
`;
const listStyles = css`
  list-style-type: none;
`;
const trueAttStyles = css`
  background-color: green;
  padding: 10px;
`;
const falseAttStyles = css`
  background-color: red;
  padding: 10px;
`;

function List({ children }) {
  return <ul>{children}</ul>;
}

function Guest(props) {
  return (
    <div>
      <li css={listStyles} key={props.id}>
        Name: {props.firstName} {props.lastName}
      </li>
    </div>
  );
}
const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

export default function NewGuest() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [remove, setRemove] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = 'http://localhost:4000';
  // make different component for each task
  // try to send data to api
  // get back data to display guests on website

  // send data to api
  const sendGuest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        attending: isChecked,
      }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    // clean inputs
    setFirstName('');
    setLastName('');
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // get all Guests

  useEffect(() => {
    const getGuests = async () => {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuests(allGuests);
    };
    getGuests();
  }, [firstName, lastName, remove, isChecked]);

  // Remove guest by id

  const handleRemove = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    setRemove(!remove);
    // clean inputs
    setFirstName('');
    setLastName('');
  };

  // Remove all attending guests

  const handleRemoveAll = async () => {
    // add part for only attending guests
    guests.forEach((element) => {
      if (element.attending) {
        handleRemove(element.id);
      }
    });
  };
  // change attending status

  // set attending

  const handleAttending = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !isChecked }),
    });
    const updatedGuest = await response.json();
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div></div>
      <div css={cardDivStyles} data-test-id="guest">
        <form css={formStyles} onSubmit={sendGuest}>
          <div css={divCenter}>
            <h2>Guest List</h2>
          </div>
          <label>
            First Name
            <input
              css={inputStyles}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />{' '}
          </label>

          <div className="form-control">
            <label>
              Last Name
              <input
                css={inputStyles}
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

          <button css={buttonStyles} value="Add">
            Add
          </button>
        </form>
      </div>
      <div css={cardDivStyles}>
        {isLoading ? (
          <p>Loading ...</p>
        ) : (
          <List>
            {guests.map((guest) => {
              return (
                <div
                  key={guest.id + guest.firstName + guest.lastName}
                  css={guestDivStyles}
                >
                  <Guest
                    key={guest.firstName + guest.lastName}
                    firstName={guest.firstName}
                    lastName={guest.lastName}
                    id={guest.id}
                  />
                  <button
                    aria-label="Remove"
                    onClick={() => handleRemove(guest.id)}
                    css={buttonStyles}
                  >
                    Remove {guest.firstName}
                  </button>
                  <label>
                    {guest.attending ? 'Is Attending' : 'Is not Attending'}
                    <input
                      aria-label="Attending"
                      css={inputStyles}
                      type="checkbox"
                      checked={guest.attending}
                      onChange={(e) => {
                        setIsChecked(e.currentTarget.checked);
                        handleAttending(guest.id);
                      }}
                    />
                  </label>
                </div>
              );
            })}
            <button
              aria-label="Remove all"
              onClick={() => handleRemoveAll(guests.id)}
              css={buttonStyles}
            >
              Remove All Attending Guests
            </button>
          </List>
        )}
      </div>
    </>
  );
}

{
}

//onChange={() => handleChecked(guest.id)}
/* <Checkbox
                  aria-label="Attending"
                  value={!isChecked}
                  onChange={(e) => {
                    setIsChecked(e.target.value);
                    handleChecked(guest.id);
                  }}
                /> */
