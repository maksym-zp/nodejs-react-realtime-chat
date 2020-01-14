import React, {Component} from 'react';
import {connect} from "react-redux";
import {getUsers} from "../../../../store/users/actions";
import {axiosController} from "../../../../utils/axiosController";
import {Collapse, List} from 'antd/lib/index';
import User from './User';

const {Panel} = Collapse;

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: this.props.all || []
        };
    }

    componentDidMount() {
        if (axiosController.isGetToken() && this.state.users.length === 0) {
            this.props.getUsers().then((result) => {
                if (result.data.users) {
                    this.setState({users: result.data.users})
                }
            });
        }
    }

    render() {
        return (
            <Collapse defaultActiveKey={['1']} className="mt-md-2">
                <Panel header="ALL USERS:" key="1">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.users}
                        renderItem={user => (
                            <List.Item>
                                <User user={user}/>
                            </List.Item>
                        )}
                    />
                </Panel>
            </Collapse>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.users.all
});
export default connect(mapStateToProps, {getUsers})(Users);