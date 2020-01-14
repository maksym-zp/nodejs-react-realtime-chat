import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {signOut} from '../store/auth/actions';
import { Avatar } from 'antd';
class Navbar extends Component {

    static propTypes = {
        signOut: PropTypes.func,
        auth: PropTypes.object
    };

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = user ? (
            <ul className="navbar-nav ml-auto">
                <li>
                    <Avatar src={user.avatar}/>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <a href="" className="nav-link" onClick={this.props.signOut}>
                    {user.name} Logout
                </a>
            </ul>
        ) : "";
        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
            </ul>
        );
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="nav-link" to="/">Chat</Link>
                    <button className="navbar-toggler" type="button"
                            data-toggle="collapse"
                            data-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    signOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);