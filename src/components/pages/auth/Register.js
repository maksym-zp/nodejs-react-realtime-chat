import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { register } from '../../../store/auth/actions';
import classnames from 'classnames';

class Register extends Component {

    static propTypes = {
        register: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: {}
        };
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };
        this.props.register(user);
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.auth.exception.errors) {
            this.setState({
                errors: nextProps.auth.exception.errors
            });
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    render() {
        const { errors } = this.state;
        return(
            <div className="container mt-5 w-75">
                <h2 className="mb-4">Registration</h2>
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.name
                            })}
                            name="name"
                            onChange={ this.handleInputChange }
                            value={ this.state.name }
                        />
                        {errors.name && (<div className="invalid-feedback">{errors.name.message}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.email
                            })}
                            name="email"
                            onChange={ this.handleInputChange }
                            value={ this.state.email }
                        />
                        {errors.email && (<div className="invalid-feedback">{errors.email.message}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.password
                            })}
                            name="password"
                            onChange={ this.handleInputChange }
                            value={ this.state.password }
                        />
                        {errors.password && (<div className="invalid-feedback">{errors.password.message}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.password_confirmation
                            })}
                            name="password_confirmation"
                            onChange={ this.handleInputChange }
                            value={ this.state.password_confirmation }
                        />
                        {errors.password_confirmation && (<div className="invalid-feedback">{errors.password_confirmation.message}</div>)}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Register User
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});
const mapDispatchToProps = ({
    register,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register))