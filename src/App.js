import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Register from './components/pages/auth/Register';
import Login from './components/pages/auth/Login';
import Home from './components/Home';
import Profile from './components/pages/profile/Profile';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'antd/dist/antd.css';
import {axiosController} from "./utils/axiosController";
import {connect} from "react-redux";
import {fetchAuthUser} from "./store/auth/actions";
import {ProtectedRoute} from "./ProtectedRoute";
import NotFound from './components/NotFound';

class App extends Component {

    componentDidMount() {
        const {auth, fetchAuthUser} = this.props;
        if (axiosController.isGetToken() && !auth.isAuthenticated) {
            fetchAuthUser().catch(() => {
                axiosController.deleteToken();
            });
        }
    }
    render() {
        return (
            <BrowserRouter>
                <Navbar/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    <ProtectedRoute path="/profile" auth={this.props.auth} component={Profile} />
                    <Route path="*" component={NotFound}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {fetchAuthUser})(App);