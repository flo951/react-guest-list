/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

const buttonStyles = css`
  border-radius: 20px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
  color: #109dcc;
  font-weight: bold;
`;

export default function DeleteGuest(props) {
  const baseUrl = 'http://localhost:4000';

  const deleteGuest = async ({
    setFirstName,
    setLastName,
    firstName,
    lastName,
    id,
  }) => {
    const response = await fetch(`${baseUrl}/guests/${props.id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <button
        css={buttonStyles}
        onClick={deleteGuest}
        aria-label="Remove <firstName> <lastName>"
      >
        Remove
      </button>
    </div>
  );
}
