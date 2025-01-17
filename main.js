// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBjWjF0pnXJHX951_4IuUnAqnttF285Idw",
    authDomain: "spectracell-fc1c9.firebaseapp.com",
    projectId: "spectracell-fc1c9",
    storageBucket: "spectracell-fc1c9.firebasestorage.app",
    messagingSenderId: "724943149356",
    appId: "1:724943149356:web:c1dd30730feb23214d3489",
    measurementId: "G-HLV9DKTHM3"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Login function
  async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error");
  
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Fetch token and claims
      const idTokenResult = await user.getIdTokenResult();
      localStorage.setItem("authToken", idTokenResult.token); // Save to localStorage
  
      if (idTokenResult.claims.role === "admin") {
        window.location.href = "restricted.html";
      } else {
        window.location.href = "protected.html";
      }
    } catch (error) {
      errorElement.textContent = error.message;
    }
  }
  
  // Logout function
  function logout() {
    auth.signOut().then(() => {
      localStorage.removeItem("authToken"); // Remove token from localStorage
      window.location.href = "index.html";
    });
  }
  
  // Protect route based on user role
  async function protectRoute(requiredRole = null) {
    const authToken = localStorage.getItem("authToken"); // Get token from localStorage
    const errorElement = document.getElementById("error");
  
    if (!authToken) {
      // Redirect to login if the user is not logged in
      window.location.href = "index.html";
      return;
    }
  
    try {
      // Use Firebase's onAuthStateChanged to monitor user authentication state
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          // No user signed in, redirect to login page
          window.location.href = "index.html";
          return;
        }
  
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role;
  
        console.log(role);
  
        // Redirect based on user role
        if (requiredRole && role !== requiredRole) {
          alert("You do not have permission to access this page.");
          window.location.href = "protected.html";
        }
      });
    } catch (error) {
      errorElement.textContent = error.message;
      console.error("Authentication error:", error);
    }
  }
  
  // Call protectRoute() on page load for restricted.html
  if (window.location.pathname.includes("restricted.html")) {
    protectRoute("admin"); // Only allow users with the "admin" role
  } else if (window.location.pathname.includes("protected.html")) {
    protectRoute(); // Allow any logged-in user
  }
  