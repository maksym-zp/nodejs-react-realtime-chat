import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {login} from '../../../store/auth/actions';
import classnames from 'classnames';

class Login extends Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        errors: PropTypes.object
    };

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
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
            email: this.state.email,
            password: this.state.password,
        };
        this.props.login(user);
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if (nextProps.auth.exception.errors) {
            this.setState({
                errors: nextProps.auth.exception.errors
            });
        }
    }

    render() {
        const {errors} = this.state;
        return (
            <div className="container mt-5 w-75">
                <h2 className="mb-4"> Login</h2>
                <form onSubmit={ this.handleSubmit }>
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
                        {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
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
                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                        {errors.credentials ? <div className="text-danger">{errors.credentials}</div> : null}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Login User
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export  default connect(mapStateToProps, {login})(Login)