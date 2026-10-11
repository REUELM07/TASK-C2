import { createContext, useContext, useEffect, useState } from 'react';

//create the authentication context
const AuthContext = createContext();

//access authentication details from other components
export function useAuth() {
  return useContext(AuthContext);
}

//provide authentication details to the application
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //restore the logged-in user when the application opens
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Unable to restore user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    setLoading(false);
  }, []);

  //save the user details after login
  function login(userData) {
    const loggedInUser = {
      fullName: userData.fullName,
      email: userData.email
    };

    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setCurrentUser(loggedInUser);
  }

  //clear the current login session
  function logout() {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}