// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RightHomePage.css';
import ChatBar from './ChatBar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

class RightHomePage extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          {this.props.publicMessages.map((message, index) =>
            <div
              key={`public-message-${index}`}
            >
              <Paper
                className={styles.messagebox}
                zDepth={1}
              >
                <Subheader>{message.from}</Subheader>
                <div className={styles.messagetext}>
                  {message.text}
                </div>
              </Paper>
              <br />
            </div>
          )}
          <ChatBar
            hintText="Public Message"
            client={this.props.client}
          />
        </div>
      </div>
    );
  }
}


RightHomePage.propTypes = {
  publicMessages: React.PropTypes.array,
  client: React.PropTypes.object
};

export default RightHomePage;
