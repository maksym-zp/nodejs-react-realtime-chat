import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { editUser } from '../../../store/auth/actions';
import classnames from 'classnames';
import { message } from 'antd/lib/index';
import Avatar from "./Avatar";


class Profile extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
        errors: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    handleInputChange = e => {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({user});
    };

    handleSubmit = e => {
        e.preventDefault();
        let user = this.state.user;
        user._id = this.props.auth.user._id;
        delete user.avatar;
        this.props.editUser(user);
    };

    componentDidMount() {
        if(this.props.auth.user && this.props.auth.user._id){
            this.setUserData();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.auth.user && this.props.auth.user._id !== prevProps.auth.user._id) {
            this.setUserData();
        }
        this.setMessageStatus(prevProps);
        this.showMessage();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.exception.errors) {
            this.setState({
                errors: nextProps.auth.exception.errors
            });
        }
    }

    getInitialState = (props) => {
        return {
            user: {
                name: '',
                email: '',
            },
            errors: {},
            messageStatus: null
        };
    };
    setUserData = () => {
            let user = this.state.user;
            user = this.props.auth.user;
            this.setState({user});
    };

    setMessageStatus = (prevProps) => {
        if( this.props.auth.message && this.props.auth.message !== prevProps.auth.message){
            let mes = this.props.auth.message;
            this.setState({messageStatus: mes});
        }
    };

    showMessage = () => {
        if(this.state.messageStatus === 'success' ){
            message.config({ duration: 1, maxCount: 1 });
            message.success('Profile updated successfully', 1 , this.clearMessageStatus);
        }
    };

    clearMessageStatus = () => {
        this.setState({messageStatus: null});
    };

    render() {
        const { errors, user } = this.state;
        return(
            <div className="container mt-5 w-75">
                <h2 className="mb-4">Profile</h2>
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="userName">Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.name
                            })}
                            name="name"
                            id="userName"
                            onChange={ this.handleInputChange }
                            value={user.name || ''}
                        />
                        {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                    </div>
                    <div className="form-group">
                        <label htmlFor="userEmail">Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.email
                            })}
                            name="email"
                            id="userEmail"
                            onChange={ this.handleInputChange }
                            value={ user.email || ''}
                        />
                        {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Update User
                        </button>
                    </div>
                </form>
                <Avatar />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
const mapDispatchToProps = ({
    editUser,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))