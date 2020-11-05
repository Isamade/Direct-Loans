import React from 'react';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    name,
    phone,
    companyEmail,
    website,
    description,
    interestRate,
    duration,
    maxAmount
  }
}) => {
  return (
    <div className='profile bg-light'>
      <img src={`/api/auth/${name}/image`} alt='' className='round-img img-item' />
      <div>
        <h2>Name:{name}</h2>
        <p className='my-1'><b>Duration:</b> {duration && <span> {duration} </span>}</p>
        <p className='my-1'><b>Interest Rate:</b> {interestRate && <span>  {interestRate}</span>}</p>
        <p className='my-1'><b>Company Email:</b> {companyEmail && <span>{companyEmail}</span>}</p>
        <p className='my-1'><b>Phone:</b> {phone && <span>{phone}</span>}</p>
        <p className='my-1'><b>Max Amount:</b> {maxAmount && <span>{maxAmount}</span>}</p>
        <p className='my-1'><b>Description:</b> {description && <span>{description}</span>}</p>
        <a href={website} className='btn btn-primary'>
          Visit Website
        </a>
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
