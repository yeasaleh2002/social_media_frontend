import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import { toast } from 'react-toastify';
import { authClient } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== repeatPassword) {
      errors.repeatPassword = 'Passwords do not match';
    }
    
    if (!agreed) {
      errors.agreed = 'You must agree to terms & conditions';
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
      const response = await api.post('/auth/register', { firstName, lastName, email, password });
      login(response.data.token, response.data.user);
      toast.success('Registration successful!');
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
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
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/src/assets/images/registration.png" alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/src/assets/images/registration1.png" alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/src/assets/images/logo.svg" alt="Image" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                <button type="button" className="_social_registration_content_btn _mar_b40" onClick={handleGoogleSignIn}>
                  <img src="/src/assets/images/google.svg" alt="Image" className="_google_img" /> <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40"> <span>Or</span>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert" style={{ fontSize: '14px', padding: '10px' }}>
                    {error}
                  </div>
                )}
                
                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Enter your first name"
                          className={`form-control _social_registration_input ${formErrors.firstName ? 'is-invalid' : ''}`}
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (formErrors.firstName) setFormErrors({...formErrors, firstName: null});
                          }}
                        />
                        {formErrors.firstName && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.firstName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Enter your last name"
                          className={`form-control _social_registration_input ${formErrors.lastName ? 'is-invalid' : ''}`}
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (formErrors.lastName) setFormErrors({...formErrors, lastName: null});
                          }}
                        />
                        {formErrors.lastName && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email <span className="text-danger">*</span></label>
                        <input 
                          type="email" 
                          placeholder="Enter your email"
                          className={`form-control _social_registration_input ${formErrors.email ? 'is-invalid' : ''}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) setFormErrors({...formErrors, email: null});
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
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password <span className="text-danger">*</span></label>
                        <input 
                          type="password" 
                          placeholder="Enter your password"
                          className={`form-control _social_registration_input ${formErrors.password ? 'is-invalid' : ''}`}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formErrors.password) setFormErrors({...formErrors, password: null});
                          }}
                        />
                        {formErrors.password && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.password}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password <span className="text-danger">*</span></label>
                        <input 
                          type="password" 
                          placeholder="Repeat your password"
                          className={`form-control _social_registration_input ${formErrors.repeatPassword ? 'is-invalid' : ''}`}
                          value={repeatPassword}
                          onChange={(e) => {
                            setRepeatPassword(e.target.value);
                            if (formErrors.repeatPassword) setFormErrors({...formErrors, repeatPassword: null});
                          }}
                        />
                        {formErrors.repeatPassword && (
                          <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                            {formErrors.repeatPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check mb-0">
                        <input 
                          className={`form-check-input _social_registration_form_check_input ${formErrors.agreed ? 'is-invalid' : ''}`} 
                          type="checkbox" 
                          id="flexRadioDefault2" 
                          checked={agreed}
                          onChange={(e) => {
                            setAgreed(e.target.checked);
                            if (formErrors.agreed) setFormErrors({...formErrors, agreed: null});
                          }}
                        />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="flexRadioDefault2">I agree to terms & conditions</label>
                      </div>
                      {formErrors.agreed && (
                        <div className="invalid-feedback d-block" style={{ fontSize: '13px', marginTop: '5px' }}>
                          {formErrors.agreed}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className="_social_registration_form_btn_link _btn1" disabled={loading}>
                          {loading ? 'Registering...' : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">Already have an account? <Link to="/login">Login Here</Link>
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
