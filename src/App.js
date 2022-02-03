/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const cardDivStyles = css`
  margin: 1rem;
  display: flex;
  color: white;
  background-color: #8f8f8f;
  border-radius: 1rem;
`;

const formDivStyles = css`
  margin: 1rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  color: white;
  background-color: #8f8f8f;
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
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  width: 275px;
  gap: 1rem;
  color: white;
  background-color: #109dcc;
  padding: 1rem 1rem;
  border-radius: 1rem;
  margin: 1rem 0;
`;
const buttonStyles = css`
  border-radius: 20px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  color: #109dcc;
  font-weight: bold;
  height: 3rem;
`;
const addButtonStyles = css`
  border-radius: 20px;
  width: 15rem;
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
  flex-basis: 100%;
`;
const guestRowStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
  border-radius: 1rem;
`;

const inputStyles = css`
  margin-left: 1rem;
`;
const listStyles = css`
  list-style-type: none;
`;

const fieldsetStyles = css`
  border: 0;
  display: flex;
  flex-direction: column;

  align-items: center;
`;

function List({ children }) {
  return <ul css={listDivStyles}>{children}</ul>;
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

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  // const [newGuests, setNewGuests] = useState([]);
  // const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = 'https://guest-list-random951.herokuapp.com';
  // make different component for each task
  // try to send data to api
  // get back data to display guests on website

  // get all Guests on page load
  useEffect(() => {
    const getGuests = async () => {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuests(allGuests);
      setIsLoading(false);
    };
    getGuests().catch((error) => console.log(error));
  }, []);

  // // render page after status change
  // useEffect(() => {
  //   const getGuests = async () => {
  //     const response = await fetch(`${baseUrl}/guests`);
  //     const allGuests = await response.json();
  //     setGuests(allGuests);
  //   };
  //   getGuests().catch((error) => console.log(error));
  // }, [isChecked]);

  // send data to api
  const sendGuest = async (e) => {
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
    console.log(createdGuest);
    // clean inputs
    setFirstName('');
    setLastName('');
    const createdGuests = [...guests, createdGuest];
    setGuests(createdGuests);
  };

  // Remove guest by id
  // add another state variable to update removed or filtered guests
  const handleRemove = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    const copyGuestList = [...guests];
    const guestFind = copyGuestList.find((guest) => guest.id === id);
    const guestsToDisplay = guests.filter((guest) => guest.id !== guestFind.id);
    setGuests(guestsToDisplay);
  };

  // Remove all attending guests

  const handleRemoveAttending = () => {
    // add part for only attending guests
    guests.forEach((element) => {
      if (element.attending) {
        handleRemove(element.id).catch((error) => console.log(error));
      }
    });
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
    console.log(updatedGuest);
    // const existingGuests = [...guests];

    //  const filterGuests = guests.filter(
    //    (guest) => guest.id === guestFind.id,
    //  );
    // console.log(filterGuests);
    // remember to copy state zitat jose

    // console.log(updatedGuests);

    // // setGuests(updatedGuests);
    // setGuests(updatedGuests);
    const copyGuestList = [...guests];
    const guestFind = copyGuestList.find((guest) => guest.id === id);
    guestFind.attending = attending;
    setGuests(copyGuestList);
  };

  // const handleUpdateAttending = async (id, attending) => {
  //   const copyGuestList = [...guests];
  //   const guestFind = copyGuestList.find((guest) => guest.id === id);
  //   guestFind.attending = attending;
  //   await handleAttending(guestFind);
  //   setGuests(copyGuestList);
  // };

  const handleShowAttending = () => {
    const attendingGuests = guests.filter((guest) => !guest.attending);
    console.log(attendingGuests);
    // setNewGuests(attendingGuests);
  };

  const handleShowNonAttending = () => {
    const attendingGuests = guests.filter((guest) => guest.attending);
    console.log(attendingGuests);
    // setNewGuests(attendingGuests);
  };

  // const handleShowAll = () => {};
  return (
    <div css={formDivStyles}>
      <fieldset css={fieldsetStyles}>
        <form css={formStyles} onSubmit={sendGuest}>
          <h2>Guest List</h2>

          <label>
            First name
            <input
              css={inputStyles}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading ? 'disabled' : ''}
            />{' '}
          </label>

          <label>
            Last name
            <input
              css={inputStyles}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading ? 'disabled' : ''}
            />
          </label>
          <button css={addButtonStyles} value="Add">
            Add
          </button>
        </form>
        <div css={buttonSetStyles}>
          <button
            aria-label="Remove all"
            onClick={() => handleRemoveAttending(guests.id)}
            css={buttonStyles}
          >
            Remove All Attending Guests
          </button>
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
          <button aria-label="Show All Guests" css={buttonStyles}>
            Show All Guests
          </button>
        </div>
      </fieldset>

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
                  <div css={guestRowStyles}>
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
                          ).catch((error) => console.log(error));
                        }}
                        // onChangeAttending(guest.id, e.currentTarget.checked)
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
                </div>
              );
            })}
          </List>
        )}
      </div>
    </div>
  );
}
