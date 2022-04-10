/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const cardDivStyles = css`
  margin: 2rem;
  color: white;
  border-radius: 1rem;
`;

const formDivStyles = css`
  margin: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: white;
  border-radius: 1rem;
`;

const listDivStyles = css`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;
  color: black;
`;

const guestDivStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  gap: 1rem;
  color: white;
  background-color: #109dcc;
  border: 2px solid black;
  padding: 1rem 1rem;
  border-radius: 1rem;
  margin: 1rem 0;
`;
const buttonStyles = css`
  border-radius: 10px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  color: #109dcc;
  font-weight: bold;
  padding: 10px;
`;
const addButtonStyles = css`
  border-radius: 10px;
  margin: 1rem;
  padding: 6px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
  color: #109dcc;
  font-weight: bold;
`;
const buttonSetStyles = css`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem;
`;

const formStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
  margin: 1rem 0;
  background-color: #109dcc;
  padding: 1rem 2rem;
  border-radius: 1rem;
  width: 30vw;
  border: 2px solid black;
`;

const inputStyles = css`
  margin-left: 1rem;
  padding: 6px;
  font-size: 14px;
`;
const listStyles = css`
  list-style-type: none;
`;

function List({ children }) {
  return <ul css={listDivStyles}>{children}</ul>;
}

type Props = {
  id: number;
  firstName: string;
  lastName: string;
};

function Guest(props: Props) {
  return (
    <li css={listStyles} key={props.id}>
      Name: {props.firstName} {props.lastName}
    </li>
  );
}

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [copyGuests, setCopyGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = 'https://guest-list-random951.herokuapp.com';

  // get all Guests on page load
  useEffect(() => {
    const getGuests = async () => {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuests(allGuests);
      setCopyGuests(allGuests);
      setIsLoading(false);
    };
    getGuests().catch((err) => console.log(err));
  }, []);

  // send data to api
  const sendGuest = async (e) => {
    if (firstName === '' || lastName === '') {
      e.preventDefault();
      setError('No valid Input');
      return;
    }
    e.preventDefault();

    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();

    // clean inputs
    setFirstName('');
    setLastName('');
    const createdGuests = [...guests, createdGuest];
    setGuests(createdGuests);
    setCopyGuests(createdGuests);
  };

  // Remove guest by id
  const handleRemove = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();

    const copyGuestList = [...guests];
    const guestFind = copyGuestList.find(
      (guest) => guest.id === deletedGuest.id,
    );
    const guestsToDisplay = guests.filter((guest) => guest.id !== guestFind.id);
    setGuests(guestsToDisplay);
    setCopyGuests(guestsToDisplay);
  };

  const handleRemoveAllAttending = () => {
    guests.map(async (guest) => {
      guest.attending &&
        (await fetch(`${baseUrl}/guests/${guest.id}`, {
          method: 'DELETE',
        }));

      return !guest.attending && guest;
    });
    const notAttendingGuests = guests.filter((guest) => !guest.attending);
    setGuests(notAttendingGuests);
  };

  // set attending & change attending status
  const handleAttending = async (id, attending) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attending }),
    });
    const updatedGuest = await response.json();
    const copyGuestList = [...guests];
    const guestFind = copyGuestList.find((guest) => guest.id === id);
    guestFind.attending = updatedGuest.attending;
    setGuests(copyGuestList);
  };

  const handleShowAttending = () => {
    const attendingGuests = guests.filter((guest) => guest.attending);
    setGuests(attendingGuests);
  };

  const handleShowNonAttending = () => {
    const notAttendingGuests = guests.filter((guest) => !guest.attending);
    setGuests(notAttendingGuests);
  };

  const handleShowAll = () => {
    setGuests(copyGuests);
  };
  return (
    <>
      <div css={formDivStyles}>
        <form css={formStyles} onSubmit={sendGuest}>
          <h2>Guest List</h2>

          <label>
            First name
            <input
              css={inputStyles}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading && 'disabled'}
            />{' '}
          </label>

          <label>
            Last name
            <input
              css={inputStyles}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading && 'disabled'}
            />
          </label>
          <button css={addButtonStyles} value="Add">
            Add Guest
          </button>
          <p>{error}</p>
        </form>
        <div css={buttonSetStyles}>
          <button
            aria-label="Show Attending Guests"
            onClick={() => handleShowAttending(guests.id)}
            css={buttonStyles}
          >
            Show only Attending Guests
          </button>
          <button
            aria-label="Show Non-Attending Guests"
            onClick={() => handleShowNonAttending(guests.id)}
            css={buttonStyles}
          >
            Show Non Attending Guests
          </button>
          <button
            aria-label="Show All Guests"
            css={buttonStyles}
            onClick={() => handleShowAll(guests.id)}
          >
            Show All Guests
          </button>
          <button
            aria-label="Show All Guests"
            css={buttonStyles}
            onClick={() => handleRemoveAllAttending()}
          >
            Remove Attending
          </button>
        </div>
      </div>
      <div css={cardDivStyles}>
        {isLoading ? (
          'Loading...'
        ) : (
          <List>
            {guests.map((guest) => {
              return (
                <div
                  key={guest.id + guest.firstName + guest.lastName}
                  css={guestDivStyles}
                  data-test-id="guest"
                >
                  <Guest
                    key={guest.firstName + guest.lastName}
                    firstName={guest.firstName}
                    lastName={guest.lastName}
                    id={guest.id}
                  />

                  <label>
                    {guest.attending ? 'Is Attending' : 'Is not Attending'}
                    <input
                      aria-label="attending status"
                      css={inputStyles}
                      type="checkbox"
                      checked={guest.attending}
                      onChange={(e) => {
                        handleAttending(
                          guest.id,
                          e.currentTarget.checked,
                        ).catch((err) => console.log(err));
                      }}
                    />
                  </label>
                  <button
                    aria-label="Remove"
                    onClick={() => handleRemove(guest.id)}
                    css={buttonStyles}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </List>
        )}
      </div>
    </>
  );
}
