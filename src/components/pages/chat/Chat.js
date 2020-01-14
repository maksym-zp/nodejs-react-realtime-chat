import {connect} from "react-redux";
import React, {Component} from 'react';
import  Messages from './messages/Messages';
import  Users from './users/Users';
import  NewMessage from './messages/NewMessage';

class Chat extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="row mt-5">
                    <div className="col-md-3">
                        <Users/>
                    </div>
                    <div className="col-md-9">
                        <NewMessage/>
                        <Messages/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Chat);
