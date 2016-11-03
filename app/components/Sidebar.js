import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import styles from './Sidebar.css';
import RightHomePage from './RightHomePage';
import ProfilePage from './ProfilePage';

const net = require('net');
const fs = require('fs');
const os = require('os');
const parser = require('xml2js').parseString;

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 'RightHomePage',
      user: '',
      fileList: {},
      activeSocket: {},
      majorDownload: false
    };
    this.downloadWithTTH = this.downloadWithTTH.bind(this);
  }

  downloadWithTTH(TTH, filename) {
    this.setState({ majorDownload: true }, () => {
      const commandToSend = `$ADCGET file TTH/${TTH} 0 -1|`;
      const writeStream = fs.createWriteStream(`${os.tmpdir()}/${filename}`);
      this.state.activeSocket.on('data', (data) => {
        const split = data.toString().split('$')[1].trim().split(' ')[0].trim();
        if (split !== 'ADCSND') {
          writeStream.write(data);
        }
      });
      this.state.activeSocket.write(commandToSend);
    });
  }

  render() {
    return (
      <div>
        <Drawer open docked>
          <AppBar
            title={
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ page: 'RightHomePage' })}
              >
              ElectronDC
              </div>
            }
            showMenuIconButton = {false}
          />
          <List>
            <Subheader>Active Users</Subheader>
            {this.props.activeUsers.map((user, index) =>
              <ListItem
                key={`user-list-${index}`}
                primaryText={user}
                rightIcon={<CommunicationChatBubble />}
                onClick={(e) => {
                  this.setState({ fileList: {} });
                  this.setState({ page: 'profile' });
                  this.setState({ user });

                  let transferring = false;
                  let transferSize = 0;
                  let totalData = '';

                  const server = net.createServer((socket) => {
                    this.setState({ activeSocket: socket });
                    socket.on('data', (data) => {
                      const command = data.toString();
                      try {
                        const split = command.split('$')[1].trim().split(' ')[0].trim();
                        if (split === 'MyNick') {
                          const confirmationCommand = `${[
                            '$MyNick ashish_tocttou',
                            '$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.75',
                            '$Supports MiniSlots XmlBZList ADCGet TTHL TTHF ACTM GetZBlock ZLIG',
                            '$Direction Download 31604',
                            '$Key 011010110110010101111001'
                          ].join('|')}|`;
                          socket.write(confirmationCommand);
                        } else if (split === 'Supports') {
                          const downloadFileListCommand = '$ADCGET file files.xml 0 -1|';
                          socket.write(downloadFileListCommand);
                        } else if (split === 'ADCSND') {
                          transferring = true;
                          transferSize = command.split(' ')[4].split('|')[0];
                        }
                      } catch (err) {
                      }
                      try {
                        if (transferring && data.toString()[0] !== '$' && !this.state.majorDownload) {
                          totalData += data.toString();
                        }
                        if (totalData.length === parseInt(transferSize)) {
                          transferring = false;
                          transferSize = 0;
                          parser(totalData, (err, result) => {
                            if (result && typeof result !== 'undefined') {
                              this.setState({ fileList: result }, () => {
                                totalData = 0;
                              });
                            }
                          });
                        }
                      } catch (err) {
                      }
                    });
                  }).on('error', (err) => {
                    throw err;
                  });

                  server.listen(() => {
                    const initCommand = `$ConnectToMe ${user} 0.0.0.0:${server.address().port}|`;
                    this.props.client.write(initCommand);
                  });
                }}
              />
            )}
          </List>
        </Drawer>
        {this.state.page === 'RightHomePage' ?
          <RightHomePage
            publicMessages={this.props.publicMessages}
            client={this.props.client}
            user={this.state.user}
          />
          :
          <ProfilePage
            user={this.state.user}
            client={this.props.client}
            fileList={this.state.fileList}
            downloadWithTTH={this.downloadWithTTH}
          />
        }
      </div>
    );
  }
}

Sidebar.propTypes = {
  activeUsers: React.PropTypes.array,
  publicMessages: React.PropTypes.array,
  client: React.PropTypes.object
};

export default Sidebar;
