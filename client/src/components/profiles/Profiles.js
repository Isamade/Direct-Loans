import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Lenders</h1>
          <p className='lead'>
            <i className='far fa-money-bill-alt' /> Browse and find a lender
            that meets your criteria
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No lenders found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);


/*const [data, setData] = useState({ search: "" });

  const { search } = data;

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const onSubmit = e => {
    e.preventDefault();
    getProfiles(search);
  }
  <form onSubmit={onSubmit}>
    <input type='search' name='search' onChange={onChange} value={search}/>
    <input type='submit'/>
  </form>
*/