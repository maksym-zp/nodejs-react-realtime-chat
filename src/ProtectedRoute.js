import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {STATE_STATUSES} from './utils/stateStatuses';

export const ProtectedRoute = ({ component: Comp, auth, path, ...rest }) => {
    return (
        <Route
            path={path}
            {...rest}
            render={props => {
                if(auth.status !==  STATE_STATUSES.INIT){
                    return auth.isAuthenticated ? (
                        <Comp {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    prevLocation: path,
                                    error: "You need to login first!",
                                },
                            }}
                        />
                    );
                }

            }}
        />
    );
};