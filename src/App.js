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

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(undefined);
  const [selectedFriend] = friends.filter(
    (friend) => friend.id === selectedFriendId
  );

  function toggleSelectedFriend(id) {
    if (id === selectedFriendId) return setSelectedFriendId(undefined);
    setSelectedFriendId(id);
  }

  function toggleAddFriendForm(e) {
    e.preventDefault();
    setAddFriendOpen((curBool) => !curBool);
  }

  function updateFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
  }

  function updateStats(id, newBalance) {
    const newFriends = friends.map((friend) => {
      if (friend.id === id) {
        friend.balance += newBalance;
      }
      return friend;
    });
    setFriends(newFriends);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <ul>
          {friends.map((friend) => (
            <FriendListItem
              selectedFriendId={selectedFriendId}
              friend={friend}
              onClick={toggleSelectedFriend}
            />
          ))}
        </ul>
        <AddFriendForm openStatus={addFriendOpen} onClick={updateFriends} />
        {addFriendOpen ? (
          <Button onClick={toggleAddFriendForm}>Close</Button>
        ) : (
          <Button onClick={toggleAddFriendForm}>Add friend</Button>
        )}
      </div>
      {selectedFriendId && (
        <SplitBillForm onSave={updateStats} selectedFriend={selectedFriend} />
      )}
    </div>
  );
}

function FriendListItem({ friend, selectedFriendId, onClick }) {
  const { image, balance, name, id } = friend;
  return (
    <li>
      <img src={image} alt="Testing img" />
      <h3>{name}</h3>
      <p className={balance === 0 ? '' : `${balance > 0 ? 'green' : 'red'}`}>
        {balance === 0
          ? `You and ${name} are even`
          : `${
              balance > 0 ? `${name} owes you` : `You owe ${name}`
            } $${Math.abs(balance)}`}
      </p>
      <Button onClick={() => onClick(id)}>
        {selectedFriendId === id ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function SplitBillForm({ selectedFriend, onSave }) {
  const [bill, setBill] = useState('');
  const [yourExpense, setYourExpense] = useState('');
  const [whoPays, setWhoPays] = useState('me');

  function calcFriendExpense() {
    if (isNaN(bill)) return '';
    if (isNaN(yourExpense)) return bill;
    return bill - yourExpense;
  }

  const friendExpense = calcFriendExpense();

  function payYourExpense(e) {
    if (+e.target.value > bill) {
      return setYourExpense(bill);
    }
    setYourExpense(+e.target.value);
  }

  function saveStatsToList(e) {
    e.preventDefault();
    const newBalance = whoPays === 'me' ? friendExpense : -1 * yourExpense;
    onSave(selectedFriend.id, newBalance);
    setBill('');
    setYourExpense('');
    setWhoPays('me');
  }

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>
      <TextInput value={bill} onChange={(e) => setBill(+e.target.value)}>
        💰 Bill value
      </TextInput>
      <TextInput value={yourExpense} onChange={payYourExpense}>
        🤷‍♂️ Your expense
      </TextInput>
      <TextInput value={friendExpense} readOnly={true}>
        🫂 {selectedFriend.name}'s expense
      </TextInput>
      <SelectInput
        onChange={(e) => setWhoPays(e.target.value)}
        whoPays={whoPays}
        name={selectedFriend.name}
      >
        😅 Who is paying the bill?
      </SelectInput>
      <Button onClick={saveStatsToList}>Split bill</Button>
    </form>
  );
}

function AddFriendForm({ onClick, openStatus }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  function addFriend(e) {
    e.preventDefault();
    onClick({
      name,
      image,
      balance: 0,
      id: Date.now(),
    });
    setName('');
    setImage('');
  }

  return (
    <form className={`form-add-friend ${openStatus ? '' : 'hidden'}`}>
      <label forName="new-name">😜 Friend name</label>
      <input
        id="new-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label forName="new-img">🔗 Image URL</label>
      <input
        id="new-img"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <button onClick={addFriend} className="button">
        Add
      </button>
    </form>
  );
}

function TextInput({ children, value, onChange, readOnly }) {
  return (
    <>
      <label>{children}</label>
      <input
        className={readOnly ? 'readOnly' : ''}
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      ></input>
    </>
  );
}

function SelectInput({ children, name, whoPays, onChange }) {
  return (
    <>
      <label>{children}</label>
      <select value={whoPays} onChange={onChange}>
        <option value="you">You</option>
        <option value="friend">{name}</option>
      </select>
    </>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
