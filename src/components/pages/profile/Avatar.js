import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Upload, Icon, message,Button} from 'antd/lib/index';
import {editUserAvatar} from '../../../store/auth/actions';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}


class Avatar extends Component {

    static propTypes = {
        editUserAvatar: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.user && nextProps.auth.user.avatar !== this.props.auth.user.avatar){
            this.setState({
                imageUrl: nextProps.auth.user.avatar
            });
        }
    }

    constructor(props) {
        super();
        this.state = {
            loading: false,
            imageUrl: props.auth.user.avatar || '/images/avatars/default-avatar.png',
        };
    }


    handleChange = info => {

        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            info.file.originFileObj.userId = this.props.auth.user._id;
            getBase64(info.file.originFileObj, imageUrl =>
                    this.setState({
                    imageUrl,
                    loading: false,
                    selectedFile: info.file.originFileObj
                }),
            );
        }
    };

    submit = () => {
        if(this.state.selectedFile) {
            const file = new FormData();
            file.append('file', this.state.selectedFile);
            this.props.editUserAvatar(file, this.props.auth.user._id);
        }
        else{
            message.error('Please select avatar at first!');
        }
    };

    render() {
        const { imageUrl, loading } = this.state;
        const uploadButton = (
            <div>
                <Icon type='loading'/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    name="data"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/preview-avatar"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    {!loading ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
                <Button type="primary" shape="round" icon="download" size='large' onClick={this.submit}>
                   Update avatar
                </Button>
            </div>


        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {editUserAvatar})(Avatar)