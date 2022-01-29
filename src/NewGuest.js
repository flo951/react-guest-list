/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const cardDivStyles = css`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  color: white;
  background-color: #8f8f8f;
`;

const buttonStyles = css`
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
  background-color: #109dcc;
  color: white;
`;

function List({ children }) {
  return <ul>{children}</ul>;
}

function Guest(props) {
  return (
    <div>
      <li key={props.id}>
        Name: {props.firstName} {props.lastName}
      </li>
    </div>
  );
}

export default function NewGuest() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [remove, setRemove] = useState(false);

  const baseUrl = 'http://localhost:4000';
  // make different component for each task
  // try to send data to api
  // get back data to display guests on website

  // send data to api
  const sendGuest = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    // clean inputs
    setFirstName('');
    setLastName('');
  };

  // get all Guests

  useEffect(() => {
    const getGuests = async (e) => {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuests(allGuests);
    };
    getGuests();
  }, [firstName, lastName, remove]);

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

  // Remove all guests

  const handleRemoveAll = async () => {
    guests.forEach((element) => {
      handleRemove(element.id);
    });
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
      <div css={listStyles}>
        <List>
          {guests.map((guest) => {
            return (
              <div key={guest.id + guest.firstName}>
                <Guest
                  key={guest.firstName + guest.lastName}
                  firstName={guest.firstName}
                  lastName={guest.lastName}
                  id={guest.id}
                />
                <button
                  aria-label="Remove"
                  onClick={() => handleRemove(guest.id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            aria-label="Remove all"
            onClick={() => handleRemoveAll(guests.id)}
          >
            Remove All
          </button>
        </List>
      </div>
    </>
  );
}
