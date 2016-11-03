// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import Sidebar from './Sidebar';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: true
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          <Sidebar
            activeUsers={this.props.activeUsers}
            publicMessages={this.props.publicMessages}
            client={this.props.client}
          />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  activeUsers: React.PropTypes.array,
  publicMessages: React.PropTypes.array,
  client: React.PropTypes.object
};

export default Home;
