import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {axiosController} from '../utils/axiosController';
import {connect} from 'react-redux';
import {STATE_STATUSES} from '../utils/stateStatuses';
import Chat from "./pages/chat/Chat";

class Home extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
    };
    componentDidMount() {
        var token = axiosController.isGetToken();
        if (!token) {
            if (this.props.history) {
                this.props.history.push('/login')
            }
        }
    }

    render() {

        const {isAuthenticated,status} = this.props.auth;
        const guestView = (
            <h2>Hello, guest. Please login first ;-)</h2>
        );
        const authView = (
            <React.Fragment>
                <Chat />
            </React.Fragment>
        );
        return (
            <div className="container">
                {status === STATE_STATUSES.READY ? (isAuthenticated ? authView : guestView) : ''}
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect( mapStateToProps )(Home);