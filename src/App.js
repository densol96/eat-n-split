/* eslint-disable no-confusing-arrow */
import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    if (!showAddFriend) setSelectedFriend(null);
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    if (!selectedFriend) setShowAddFriend(false);
    // eslint-disable-next-line no-confusing-arrow
    setSelectedFriend((curFriend) =>
      curFriend?.id === friend.id ? null : friend
    );
  }

  function onSplitBill(valueToAdd) {
    setFriends((friends) => {
      return friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + valueToAdd }
          : friend
      );
    });
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          friends={friends}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          onSplitBill={onSplitBill}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          selectedFriend={selectedFriend}
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend === friend;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmitNewFriend(e) {
    e.preventDefault();

    if (!name || !image)
      return alert('You have to input name and image for this form!');

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      balance: 0,
      image: `${image}?u=${id}`,
      id,
    };

    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend">
      <label>😜 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🔗 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button onClick={handleSubmitNewFriend}>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return alert('Form is ivalid');
    const addToFriendBalance =
      whoIsPaying === 'user' ? paidByFriend : -1 * paidByUser;
    onSplitBill(addToFriendBalance);
  }

  return (
    <form onSubmit={handleSubmit} className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🤷‍♂️ Your expense </label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(e.target.value > bill ? bill : +e.target.value)
        }
      />

      <label>🫂 {selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
