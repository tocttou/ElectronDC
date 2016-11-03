// @flow
import React, { PropTypes } from 'react';
import styles from './ProfilePage.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import { List, ListItem } from 'material-ui/List';

class ProfilePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: '',
      open: false,
      fileList: {}
    };
    this.toggleAlert = this.toggleAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.state.user) {
      this.setState({ user: nextProps.user });
    }

    if (nextProps.fileList !== this.state.fileList) {
      this.setState({ fileList: nextProps.fileList });
    }
  }

  toggleAlert() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const actions = [
      <RaisedButton
        key="alert-button-1"
        label="OK"
        primary
        onTouchTap={this.toggleAlert}
      />
    ];

    return (
      <div>
        <div className={styles.container}>
          <p className={styles.username}>
            {this.state.user}
          </p>
          {Object.keys(this.state.fileList).length > 0 &&
          <List>
            {
              this.state.fileList.FileListing.Directory.map((dir, index) =>
                <ListItem
                  key={`list-item-1-${index}`}
                  leftIcon={<FolderIcon />}
                  initiallyOpen
                  primaryTogglesNestedList
                  primaryText={dir.$.Name}
                  nestedItems={typeof dir.File !== 'undefined' && dir.File.map((file, index2) =>
                   <ListItem
                    key={`list-item-2-${index2}`}
                    leftIcon={<FileIcon />}
                    initiallyOpen
                    primaryTogglesNestedList
                    primaryText={`${file.$.Name} (${(parseInt(file.$.Size) / 1048576).toFixed(2)} MB)`}
                    onClick={() => {
                      this.props.downloadWithTTH(file.$.TTH, file.$.Name);
                    }}
                   />
                  )}
                />)
            }
          </List>
          }
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.toggleAlert}
        >
          User not available at the moment.
        </Dialog>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  user: PropTypes.string,
  client: React.PropTypes.object,
  fileList: React.PropTypes.object,
  downloadWithTTH: React.PropTypes.func
};

export default ProfilePage;
