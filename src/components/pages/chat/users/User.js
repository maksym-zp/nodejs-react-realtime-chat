import React, {Component} from 'react';
import {connect} from "react-redux";
import {getUsers} from "../../../../store/users/actions";
import { List, Avatar, Badge } from 'antd/lib/index';


class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user || {},
        }
        ;
    }

    checkOnLine = (email) => {
        let find = this.props.onLine.find( item => {
            return item.user.email === email;
        });
        return find ? true : false;
    };

    render() {
        const {user} = this.state;
        return (

            <List.Item.Meta
                avatar={<Badge dot status={this.checkOnLine(user.email) ? "success": "error"}><Avatar src={user.avatar ? user.avatar : '/images/avatars/default-avatar.png'} /></Badge>}
                title={user.name}
                description={this.checkOnLine(user.email) ? "on line" : ""}
            />
    )
    }
}

const mapStateToProps = (state) => ({
    onLine: state.users.onLine
});
export default connect(mapStateToProps, {getUsers})(User);