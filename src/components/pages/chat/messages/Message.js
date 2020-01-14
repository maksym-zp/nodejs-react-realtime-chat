import React, {Component} from 'react';
import {connect} from "react-redux";
import { Comment, Avatar, Modal, Input, Icon } from 'antd/lib/index';
import {deleteMessage, editMessage} from "../../../../store/messages/actions";
var moment = require('moment');
const { confirm } = Modal;

class Message extends Component{

    constructor(props) {
        super(props);
        this.state = {
            message: props.message || {},
            edit: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.message._id === this.props.message._id &&  prevProps.message.content !== this.props.message.content) {
          let message = this.state.message;
          delete message.newContent;
          message.content = this.props.message.content;
          this.setState({message, edit: false});
      }
    }
    delete = () => {
        confirm({
            title: 'Do you want to delete this message?',
            onOk: () => {
                if(this.state.message._id){
                    this.props.deleteMessage(this.state.message._id);
                }
            },
            onCancel() {},
        });
    };

    editStatus = () => {
        let message = this.state.message;
        delete message.newContent;
        this.setState({message, edit: !this.state.edit});
    };

    editMessage = () => {

        let message = this.state.message;
        if(message.newContent){
            let editMessage = {...message};
            editMessage.content = message.newContent;
            this.props.editMessage(editMessage, editMessage._id);
        }

    };

    handleInputChange = (e) => {
        let message = this.state.message;
        message['newContent'] = e.target.value;
        this.setState({message});
    };
    getActions = () => {
        return  this.props.user._id === this.state.message.user._id ?
            [
                <span key="comment-edit" onClick={this.editStatus}>Edit</span>,
                <span key="comment-delete" onClick={this.delete}>Delete</span>
            ] :
            [
                <span key="comment-nested-reply-to">Reply to</span>
            ]
    };

    getTimestamps = message => {
        return (message.createdAt === message.updatedAt)
            ?
            "Created: " + moment(message.createdAt).format("DD.MM.YYYY HH:mm")
            :
            "Updated: " + moment(message.updatedAt).format("DD.MM.YYYY HH:mm");
    };

    render() {
        const {message, edit} = this.state;
        return (
            <Comment
                actions={this.getActions()}
                author={<a>{message.user.name}</a>}
                avatar={
                    <Avatar
                        src={message.user.avatar}
                        alt={message.user.name}
                    />
                }
                content={
                    edit ? <Input addonAfter={<Icon type="edit" onClick={this.editMessage} />}
                                  name="content"
                                  defaultValue={message.content}
                                  onChange={this.handleInputChange}
                        /> :
                    <p>
                        {this.props.message.content}
                    </p>
                }
                datetime={this.getTimestamps(this.props.message)}
            >
            </Comment>
        )
    }
}

const mapStateToProps = (state) => ({
    messages: state.messages,
    user: state.auth.user,
});
export default connect(mapStateToProps, {deleteMessage, editMessage})(Message);