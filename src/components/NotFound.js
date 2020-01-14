import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => (
    <div className="container">
        <div className="row">
            <div className="col-md-12 d-flex justify-content-sm-center">
                Page not find
            </div>
        </div>
        <div className="row">
            <div className="col-md-12 d-flex justify-content-sm-center">
                <Link to="/">Return to Home Page</Link>
            </div>
        </div>
    </div>
);
export default NotFound;
