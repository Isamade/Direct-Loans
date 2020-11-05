import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initialState = {
    name: '',
    email: '',
    password: '',
    avatar: '',
    companyEmail: '',
    phone: '',
    description: '',
    interestRate: '',
    duration: '',
    maxAmount: '',
    website: ''
};

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if(!profile) getCurrentProfile();
    if(!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  console.log(formData);

  const {
    name,
    email,
    password,
    avatar,
    companyEmail,
    phone,
    description,
    interestRate,
    duration,
    maxAmount,
    website
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile({
      name,
      email,
      password,
      avatar,
      companyEmail,
      phone,
      description,
      interestRate,
      duration,
      maxAmount,
      website
    }, history, profile ? true : false); 
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Add some changes to your profile
      </p>
      <form className="form" onSubmit={onSubmit} action="/api/users/signUp" method="post" enctype="multipart/form-data">
      <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <label for="avatar">profile image: </label>
        <input type="file" name="avatar" onChange={(e)=>setFormData({ ...formData, [e.target.name]: e.target.files[0] })} />
        <div className="form-group">
          <input
            type="email"
            placeholder="Company Email"
            name="companyEmail"
            value={companyEmail}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            value={phone}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Description of company or loan"
            name="description"
            value={description}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Interest Rate"
            name="interestRate"
            value={interestRate}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Duration of Loan"
            name="duration"
            value={duration}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Maximum amount available for loan"
            name="maxAmount"
            value={maxAmount}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={onChange}
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
