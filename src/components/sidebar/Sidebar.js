import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  editProfile,
  getUserProfileDetails,
  getUserFollowers,
  getUserFollowing
} from '../../actions';
import ContentLoader, { Facebook } from 'react-content-loader';

import styled from 'styled-components';
import { customLayout, customWrapper } from '../mixins';
import Moment from 'react-moment';
import locationSvg from '../../assets/svg/location.svg';
import linkSvg from '../../assets/svg/link-symbol.svg';
import calendarSvg from '../../assets/svg/calendar.svg';
import axios from 'axios';
import { post as URL } from '../../services/baseURL';
import FollowingDropdown from '../utils/FollowingDropdown';
import FollowersDropdown from '../utils/FollowersDropdown';

const MyLoader = () => (
  <ContentLoader
    height={475}
    width={'100%'}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    // style={{
    //   minWidth: '100%',
    //   width: '25%',
    //   maxHeight: '300px',
    //   height: '400px'
    // }}
  >
    <circle cx="148" cy="73" r="56" />
    <rect x="118" y="425" rx="0" ry="0" width="0" height="0" />
    <rect x="17" y="144" rx="0" ry="0" width="364" height="300" />
  </ContentLoader>
);
class Sidebar extends Component {
  state = {
    followers: [],
    following: [],
    followingDropDownHeight: '0px',
    followersDropDownHeight: '0px'
  };
  componentDidMount() {
    this.props.getUserProfileDetails(this.props.auth.id);
    if (this.props.auth.id) {
      axios
        .get(`${URL}/api/users/followers?id=${this.props.auth.id}`)
        .then(res => this.setState({ followers: res.data }));
    }
    if (this.props.auth.id) {
      axios
        .get(`${URL}/api/users/following?id=${this.props.auth.id}`)
        .then(res => this.setState({ following: res.data }));
    }
  }
  handleFollowingDropdown = () => {
    this.setState({
      followingDropDownHeight:
        this.state.followingDropDownHeight === '300px' ? '0px' : '300px',
      followersDropDownHeight: '0px'
    });
  };
  handleFollowersDropdown = () => {
    this.setState({
      followersDropDownHeight:
        this.state.followersDropDownHeight === '300px' ? '0px' : '300px',
      followingDropDownHeight: '0px'
    });
  };
  render() {
    if (!this.props.user_details) {
      return <MyLoader />;
    }
    return (
      <Wrapper>
        <Profile>
          <div className="user">
            <img src={this.props.auth.profile_picture} alt="avatar" />
          </div>
          <div className="user-bio">
            <h3>{this.props.auth.display_name}</h3>
            <div className="profile-stats">
              <ul>
                <li>Posts</li>
                <li>{this.props.user_details.post_count}</li>
              </ul>
              <ul onClick={this.handleFollowingDropdown}>
                <li>Following</li>
                <li>{this.props.user_details.following_count}</li>
              </ul>
              <ul onClick={this.handleFollowersDropdown}>
                <li>Followers</li>
                <li>{this.props.user_details.followers_count}</li>
              </ul>
            </div>
            <FollowingDropdown
              following={this.state.following}
              height={this.state.followingDropDownHeight}
              handleFollowingDropdown={this.handleFollowingDropdown}
            />
            <FollowersDropdown
              followers={this.state.followers}
              height={this.state.followersDropDownHeight}
              handleFollowingDropdown={this.handleFollowersDropdown}
            />
            <p>{this.props.auth.bio ? this.props.auth.bio : 'Add bio'}</p>
            <p>
              <img src={locationSvg} alt="location-icon" />
              {this.props.auth.location
                ? this.props.auth.location
                : 'Add location'}
            </p>
            <p>
              <img src={linkSvg} alt="link-icon" />
              {this.props.auth.website_url
                ? this.props.auth.website_url
                : 'Add website URL'}
            </p>
            <p>
              <img src={calendarSvg} alt="calendar-icon" />
              Joined <Moment format="MMMM YYYY">{this.props.created_at}</Moment>
            </p>
            <div className="edit-profile-link">
              <Link to="/settings">Edit Profile</Link>
            </div>
          </div>
        </Profile>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  ${customWrapper('40%')}
  max-width: 300px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Profile = styled.div`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 5px;
  background: #fff;
  position: sticky;
  top: 100px;

  .user {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    padding: 20px 0;
    ${customLayout('center', 'center')}
    background-color: #4064f2;
    position: relative;
    height: 80px;
    margin-bottom: 50px;

    img {
      position: absolute;
      top: 30px;
      border: 3px solid #fff;
      border-radius: 50%;
      height: 100px;
      object-fit: cover;
      width: 100px;
    }
  }

  .user-bio {
    ${customLayout()}
    flex-direction: column;
    flex-wrap: wrap;
    padding: 15px 8%;
    margin: 0 auto;
    @media (max-width: 1350px) {
      width: 100%;
    }
    h3 {
      margin: 0 auto;
      font-size: 2.5rem;
      margin-bottom: 20px;
    }

    p {
      line-height: 25px;
      margin-bottom: 15px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
        margin-bottom: -3px;
      }
    }

    mark {
      background-color: transparent;
      color: #333;
    }

    .edit-profile-link {
      margin: 10px 0;
      a {
        font-size: 1.4rem;
        font-weight: 700;
        color: #6d767e;
        transition: 200ms ease-out;

        &:hover {
          color: #3f65f2;
          transition: 200ms ease-in;
        }
      }
    }
  }
  .profile-stats {
    display: flex;
    width: 100%;
    justify-content: space-between;
    @media (max-width: 1400px) {
      /* flex-direction: column; */
      flex-wrap: wrap;
    }
    ul {
      margin-bottom: 15px;
      cursor: pointer;
      transition: 200ms ease-out;
      :not(:last-child) {
        margin-right: 15px;
      }
      &:hover {
        color: #3f65f2;
        transition: 200ms ease-in;
        li:nth-of-type(2) {
          opacity: 1;
        }
      }
      li {
        margin-bottom: 5px;
      }
      li:nth-of-type(2) {
        opacity: 0.7;
        transition: 200ms ease-out;
      }
    }
  }
  .follow-stats-dropdown {
    position: absolute;
    top: 240px;
    left: 0;
    right: 0;
    background: #fff;
    width: 100%;
    overflow: auto;
    transition: 200ms height ease-in-out;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    border-radius: 0 0 5px 5px;
    .caret-up {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 3px;
      top: 10px;
      cursor: pointer;
    }
    a {
      margin: 15px 0;
      &:hover {
        h2 {
          opacity: 1;
          transition: 200ms ease-in;
        }
      }
    }
    .follow {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
    h2 {
      font-size: 1.8rem;
      opacity: 0.7;
      transition: 200ms ease-out;
    }
  }
`;

const mapStateToProps = ({ auth, user_details }) => {
  return {
    auth: auth,
    user_details: user_details
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { editProfile, getUserProfileDetails }
  )(Sidebar)
);
