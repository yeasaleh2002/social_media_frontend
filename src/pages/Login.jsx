import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import { toast } from 'react-toastify';
import { authClient } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/src/assets/images/shape1.svg" alt="shape" className="_shape_img" />
        <img src="/src/assets/images/dark_shape.svg" alt="shape" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/src/assets/images/shape2.svg" alt="shape" className="_shape_img" />
        <img src="/src/assets/images/dark_shape1.svg" alt="shape" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/src/assets/images/shape3.svg" alt="shape" className="_shape_img" />
        <img src="/src/assets/images/dark_shape2.svg" alt="shape" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src="/src/assets/images/login.png" alt="Image" className="_left_img" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b28">
                  <img src="/src/assets/images/logo.svg" alt="Image" className="_left_logo" />
                </div>
                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                <button type="button" className="_social_login_content_btn _mar_b40" onClick={handleGoogleSignIn}>
                  <img src="/src/assets/images/google.svg" alt="Image" className="_google_img" /> <span>Or sign-in with google</span>
                </button>
                <div className="_social_login_content_bottom_txt _mar_b40"> <span>Or</span>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ fontSize: '14px', padding: '10px' }}>
                    {error}
                  </div>
                )}

                <form className="_social_login_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className={`form-control _social_login_input ${formErrors.email ? 'is-invalid' : ''}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                          }}
                        />
                        {formErrors.email && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Password <span className="text-danger">*</span></label>
                        <input
                          type="password"
                          placeholder="Enter your password"
                          className={`form-control _social_login_input ${formErrors.password ? 'is-invalid' : ''}`}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formErrors.password) setFormErrors({ ...formErrors, password: null });
                          }}
                        />
                        {formErrors.password && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input className="form-check-input _social_login_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                        <label className="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">Remember me</label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="_social_login_form_left">
                        <p className="_social_login_form_left_para">Forgot password?</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className=" _social_login_form_btn_link _btn1" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">Dont have an account? <Link to="/register">Create New Account</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
