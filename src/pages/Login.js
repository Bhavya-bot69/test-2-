import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../utils/authHelpers";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.msg || "Invalid email or password" });
        setLoading(false);
        return;
      }

      // ✅ Save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate("/admin/events");
    } catch (error) {
      console.error(error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message" style={{ textAlign: "center" }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
