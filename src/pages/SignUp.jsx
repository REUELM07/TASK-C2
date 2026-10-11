import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

import { db } from '../firebase';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignUp(event) {
    event.preventDefault();

    setMessage('');

    //check that all fields have been entered
    if (!fullName || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    //check that the email contains an @ symbol
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }

    //check password length
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    //check that both passwords are the same
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const cleanEmail = email.toLowerCase().trim();

      //check whether this email is already registered
      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', cleanEmail)
      );

      const existingUsers = await getDocs(userQuery);

      if (!existingUsers.empty) {
        setMessage('An account with this email already exists.');
        return;
      }

      //create a secure hash of the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      //store the new user in Firestore
      await addDoc(collection(db, 'users'), {
        fullName: fullName.trim(),
        email: cleanEmail,
        password: hashedPassword,
        createdAt: serverTimestamp()
      });

      //redirect to login after successful registration
      navigate('/login');

    } catch (error) {
      console.error('Sign up error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
      
    

        <div className="signup-heading">
          <h1>Create your account</h1>
        </div>

        <form className="signup-form" onSubmit={handleSignUp}>

          <div className="signup-field">
            <label htmlFor="fullName">Full name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
        

          <div className="signup-field">
            <label htmlFor="signupEmail">Email address</label>
            <input
              type="email"
              id="signupEmail"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signupPassword">Password</label>
            <input
              type="password"
              id="signupPassword"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {message && (
            <p className="signup-message-text">{message}</p>
          )}

          <button type="submit" className="signup-button">
            Create Account
          </button>

        </form>

        <div className="login-message">
          <span>Already have an account?</span>{' '}
          <Link to="/login">Login</Link>
        </div>


      </div>
    </div>
  );
}

export default SignUp;