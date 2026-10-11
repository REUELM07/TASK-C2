import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(event) {
    event.preventDefault();

    setMessage('');

    //check that both fields have been entered
    if (!email || !password) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      const cleanEmail = email.toLowerCase().trim();

      //find the user with the entered email
      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', cleanEmail)
      );

      const userResults = await getDocs(userQuery);

      //check whether the email exists
      if (userResults.empty) {
        setMessage('No account found with this email.');
        return;
      }

      const userData = userResults.docs[0].data();

      //compare the entered password with the stored password hash
      const passwordMatch = await bcrypt.compare(
        password,
        userData.password
      );

      //check whether the password is correct
      if (!passwordMatch) {
        setMessage('Incorrect password. Please try again.');
        return;
      }

      //save the user's login state
      login({
        fullName: userData.fullName,
        email: userData.email
      });

      //go to the home page after successful login
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-heading">
          <h2>Login to your DEV@Deakin account</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="login-field">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message && (
            <p className="login-message-text">{message}</p>
          )}

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <div className="signup-message">
          <span>Don't have an account?</span>{' '}
          <Link to="/signup">Sign up</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;