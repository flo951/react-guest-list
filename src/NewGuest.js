/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const cardDivStyles = css`
  margin: 2rem 2rem;
  display: flex;

  color: white;
  background-color: #8f8f8f;
  border-radius: 1rem;
`;

const formDivStyles = css`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  color: white;
  background-color: #8f8f8f;
`;

const listDivStyles = css`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;
  color: black;
`;
const guestDivStyles = css`
  margin-top: 1rem;
  display: flex;
  width: 29vw;
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
  width: 10rem;
  height: 3rem;
`;
const addButtonStyles = css`
  border-radius: 20px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
  color: #109dcc;
  font-weight: bold;
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
const fieldsetStyles = css`
  border: 0;
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

export default function NewGuest() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [remove, setRemove] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = 'http://localhost:4000';
  // make different component for each task
  // try to send data to api
  // get back data to display guests on website

  // useEffect maybe for first render with timeout?

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
    console.log(deletedGuest);
    setRemove(!remove);
    // clean inputs
    setFirstName('');
    setLastName('');
  };

  // Remove all attending guests

  const handleRemoveAttending = () => {
    // add part for only attending guests
    guests.forEach((element) => {
      if (element.attending) {
        handleRemove(element.id);
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
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div></div>
      <div css={formDivStyles} data-test-id="guest">
        <fieldset css={fieldsetStyles} disabled={isLoading ? 'disabled' : ''}>
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

            <button css={addButtonStyles} value="Add">
              Add
            </button>
            <button
              aria-label="Remove all"
              onClick={() => handleRemoveAttending(guests.id)}
              css={buttonStyles}
            >
              Remove All Attending Guests
            </button>
          </form>
        </fieldset>
      </div>
      <div css={cardDivStyles}>
        {isLoading ? (
          <h2>Loading ...</h2>
        ) : (
          <List>
            {guests.map((guest) => {
              return (
                <div
                  key={guest.id + guest.firstName + guest.lastName}
                  css={guestDivStyles}
                >
                  <div>
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
                      Remove
                    </button>
                  </div>

                  <label>
                    {guest.attending ? 'Is Attending' : 'Is not Attending'}
                    <input
                      aria-label="Attending"
                      css={inputStyles}
                      type="checkbox"
                      checked={guest.attending}
                      onClick={() => {
                        handleAttending(guest.id, guest.attending);
                      }}
                    />
                  </label>
                </div>
              );
            })}
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
