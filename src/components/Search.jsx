import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', username));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setUser(doc.data());
        });
        setErr(false); // Clear error if user is found
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 3000); // Clear error after 3 seconds
      }
    } catch (err) {
      setErr(true);
      setTimeout(() => setErr(false), 3000); // Clear error after 3 seconds
      console.error('Error searching for user:', err); // Log the error for debugging
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [`${combinedId}.date`]: serverTimestamp()
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [`${combinedId}.date`]: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Error selecting user:', err); // Log the error for debugging
    }

    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span className="errorMessage">User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
