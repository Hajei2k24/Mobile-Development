import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from '@firebase/firestore';
// Make sure the path is correct - adjust this based on your actual file structure


const firebaseConfig = {
  apiKey: "AIzaSyA-0OXNcjj-gKHXplIDaW3MDVIWqZWzOSc",
  authDomain: "carolin-199fc.firebaseapp.com",
  projectId: "carolin-199fc",
  storageBucket: "carolin-199fc.firebasestorage.app",
  messagingSenderId: "182873934459",
  appId: "1:182873934459:web:e3999392b559cc6d98f0de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LoginScreen = ({ email, setEmail, password, setPassword, handleAuthentication, switchToSignUp, loginError }) => {
  return (
    <View style={styles.authContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Carolin.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        
        {loginError ? (
          <Text style={styles.errorText}>{loginError}</Text>
        ) : null}
        
        <TouchableOpacity onPress={() => console.log("Forgot password")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleAuthentication}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconText}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconText}>t</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an Account? </Text>
          <TouchableOpacity onPress={switchToSignUp}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const SignUpScreen = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleSignUp, 
  switchToLogin, 
  firstName,
  setFirstName,
  lastName,
  setLastName,
  confirmPassword, 
  setConfirmPassword,
  signupError 
}) => {
  return (
    <View style={styles.authContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Carolin.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sign Up</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            autoCapitalize="words"
          />
          
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            autoCapitalize="words"
          />
        </View>
        
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        
        {signupError ? (
          <Text style={styles.errorText}>{signupError}</Text>
        ) : null}
        
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an Account? </Text>
          <TouchableOpacity onPress={switchToLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const AuthenticatedScreen = ({ user, handleAuthentication, userData }) => {
  const displayName = userData ? 
    `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : 
    (user.displayName || 'User');
    
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Name:</Text>
        <Text style={styles.userInfoText}>{displayName}</Text>
      </View>
      
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Email:</Text>
        <Text style={styles.userInfoText}>{user.email}</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleAuthentication}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};


export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [userData, setUserData] = useState(null); // Store additional user data
  const [currentScreen, setCurrentScreen] = useState('login'); // login, signup, signupSuccess, authenticated
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  // Store credentials temporarily for the success screen
  const [savedCredentials, setSavedCredentials] = useState({ email: '', password: '' });
  // Flag to ignore auth state change during specific operations
  const [ignoreAuthChange, setIgnoreAuthChange] = useState(false);

  const auth = getAuth(app);

  // Clear all input fields
  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
  };

  // Fetch user data from Firestore when user is authenticated
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log("No user data found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Skip auth state changes if we're in the middle of a custom flow
      if (ignoreAuthChange) {
        return;
      }
      
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data when user is authenticated
        fetchUserData(currentUser.uid);
        
        // Only auto-navigate to authenticated screen if not on signupSuccess screen
        if (currentScreen !== 'signupSuccess') {
          setCurrentScreen('authenticated');
        }
      }
    });

    return () => unsubscribe();
  }, [auth, ignoreAuthChange, currentScreen]);

  const switchToSignUp = () => {
    setCurrentScreen('signup');
    setLoginError('');
    clearInputs();
  };
  
  const switchToLogin = () => {
    setCurrentScreen('login');
    setSignupError('');
    clearInputs();
  };

  // Function to sign in after successful account creation
  const signInAndGoToWelcome = async (email, password) => {
    try {
      // Temporarily ignore auth state changes to prevent auto-navigation
      setIgnoreAuthChange(true);
      
      // Sign in with saved credentials
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in after account creation');
      
      // Explicitly set the screen to authenticated
      setCurrentScreen('authenticated');
      
      // Clear saved credentials
      setSavedCredentials({ email: '', password: '' });
      
      // Resume watching auth state changes
      setIgnoreAuthChange(false);
      
      // Clear all inputs
      clearInputs();
    } catch (error) {
      console.error('Auto-login error after signup:', error);
      // If login fails, go back to login screen
      setIgnoreAuthChange(false);
      switchToLogin();
    }
  };
  
  const handleSignUp = async () => {
    // Clear previous errors
    setSignupError('');
    
    // Sign up validation
    if (!firstName.trim()) {
      setSignupError('First name is required.');
      return;
    }
    
    if (!lastName.trim()) {
      setSignupError('Last name is required.');
      return;
    }
    
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match. Please try again.');
      return;
    }
    
    if (password.length < 6) {
      setSignupError('Password should be at least 6 characters long.');
      return;
    }
    
    try {
      // Start ignoring auth state changes
      setIgnoreAuthChange(true);
      
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name as full name
      const fullName = `${firstName} ${lastName}`;
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      // Save credentials for later use in success screen
      setSavedCredentials({ email, password });
      
      // Log user out to prepare for manual sign-in from success screen
      await signOut(auth);
      
      // Navigate to success screen - use 'signupSuccess' to match our conditional check
      setCurrentScreen('signupSuccess');
      console.log("Setting current screen to signupSuccess");
      
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        setSignupError('Email is already in use. Please use a different email.');
      } else if (error.code === 'auth/invalid-email') {
        setSignupError('Invalid email format. Please check your email.');
      } else if (error.code === 'auth/weak-password') {
        setSignupError('Password is too weak. Please use a stronger password.');
      } else {
        setSignupError('Signup failed: ' + error.message);
      }
      
      // Re-enable auth state change listener
      setIgnoreAuthChange(false);
    }
  };
  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
        setCurrentScreen('login');
        clearInputs();
      } else {
        // Sign in
        setLoginError('');
        
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
          clearInputs();
          // Auth state change will handle navigation
        } catch (error) {
          console.error('Login error:', error.code, error.message);
          
          // Handle specific Firebase auth errors
          if (error.code === 'auth/user-not-found') {
            setLoginError('Account does not exist. Please sign up first.');
          } else if (error.code === 'auth/wrong-password') {
            setLoginError('Incorrect password. Please try again.');
          } else if (error.code === 'auth/invalid-email') {
            setLoginError('Invalid email format. Please check your email.');
          } else if (error.code === 'auth/invalid-credential') {
            setLoginError('Invalid email or password. Please try again.');
          } else {
            setLoginError('Login failed: ' + error.message);
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  // Render the appropriate screen based on currentScreen state
 const renderScreen = () => {
  console.log("Current screen:", currentScreen); // Debug log to check current screen state
  
  // Handle the signup success screen specifically
  if (currentScreen === 'signupSuccess') {
    return (
      <AccountCreatedScreen 
        onContinue={() => signInAndGoToWelcome(savedCredentials.email, savedCredentials.password)} 
      />
    );
  }
  
  // Show authenticated screen if user is logged in and we're on authenticated screen
  if (user && currentScreen === 'authenticated') {
    return (
      <AuthenticatedScreen 
        user={user} 
        userData={userData} 
        handleAuthentication={handleAuthentication} 
      />
    );
  }
  
  // Otherwise show the appropriate screen based on currentScreen value
  switch (currentScreen) {
    case 'login':
      return (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
          switchToSignUp={switchToSignUp}
          loginError={loginError}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSignUp={handleSignUp}
          switchToLogin={switchToLogin}
          signupError={signupError}
        />
      );
    default:
      return (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
          switchToSignUp={switchToSignUp}
          loginError={loginError}
        />
      );
  }
};


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {renderScreen()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#fff",
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%', // Slightly less than 50% to account for spacing
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#666",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#F47B20",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "#F47B20",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e1e1e1",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#666",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialIconText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#333",
  },
  signupLink: {
    color: "#F47B20",
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#333",
  },
  loginLink: {
    color: "#F47B20",
    fontWeight: "600",
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#F47B20",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    marginTop: 20,
    width: '80%',
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 10,
    width: '100%',
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  userInfoText: {
    fontSize: 16,
    flex: 1,
  }
});