// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './ChatBar.css';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

class ChatBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      message: ''
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
  }

  sendMessage() {
    this.props.client.write(`<ashish_tocttou> ${this.state.message}|`);
    this.setState({ message: '' });
  }

  onMessageChange(e) {
    this.setState({ message: e.target.value });
  }

  render() {

    return (
      <div>
        <div className={styles.container}>
          <Divider />
          <TextField
            hintText={this.props.hintText}
            fullWidth
            onChange={this.onMessageChange}
          />
          <RaisedButton
            style={{ margin: '10px', float: 'right' }}
            label="Send"
            primary
            onTouchTap={this.sendMessage}
          />
        </div>
      </div>
    );
  }
}

ChatBar.propTypes = {
  hintText: React.PropTypes.string,
  client: React.PropTypes.object
};

export default ChatBar;
