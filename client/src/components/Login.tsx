import '../styles/Login.css';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5050/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🍽️ Eatelligent</h1>
        <p className="tagline">Smart ingredient management, zero food waste</p>
        
        <button onClick={handleGoogleLogin} className="google-login-btn">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
          />
          Sign in with Google
        </button>
        
        <p className="privacy-text">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}