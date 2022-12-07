import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import AssessmentIcon from '@material-ui/icons/Assessment'
import Home from '@material-ui/icons/Home'
import Person from '@material-ui/icons/Person'
import ColorLens from '@material-ui/icons/ColorLens'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Settings from '@material-ui/icons/Settings'
import { ShowChart } from '@material-ui/icons'
import { Assignment } from '@material-ui/icons'

import { colors } from '../../constants/styles'
import { routes } from '../routes/routes'

class DrawerComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidUpdate() {}
  render() {
    return (
      <div>
        <div
          style={{
            padding: '4px',
          }}
        >
          <div
            style={{
              height: '12px',
            }}
          ></div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '18px',
            }}
          >
            <img
              style={{ height: '100%' }}
              src={`${routes.basePath}/img/dpdash.png`}
            />
          </div>
          <div
            style={{
              height: '16px',
            }}
          ></div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            {this.props.avatar}
          </div>
          <div
            style={{
              height: '8px',
            }}
          ></div>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography noWrap={true}>
              {this.props.name ? this.props.name : this.props.user.uid}
            </Typography>
          </div>
          <div
            style={{
              height: '12px',
            }}
          ></div>
          <div
            style={{
              width: '100%',
            }}
          >
            <table
              style={{
                width: '100%',
                padding: '4px',
                textAlign: 'center',
              }}
            >
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {this.props.totalStudies}
                    </Typography>
                  </td>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {this.props.totalSubjects}
                    </Typography>
                  </td>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {this.props.totalDays}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                      }}
                    >
                      {'studies'}
                    </Typography>
                  </td>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                      }}
                    >
                      {'participants'}
                    </Typography>
                  </td>
                  <td style={{ width: '30%' }}>
                    <Typography
                      noWrap={true}
                      style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                      }}
                    >
                      {'days'}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Divider />
        <List dense={true}>
          <ListItem button={true} component="a" href={routes.home}>
            <ListItemIcon>
              <Home style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button={true} component="a" href={routes.charts}>
            <ListItemIcon>
              <ShowChart style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Charts" />
          </ListItem>
          <ListItem button={true} component="a" href={routes.configure}>
            <ListItemIcon>
              <ColorLens style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Configure" />
          </ListItem>
          <ListItem button={true} component="a" href={routes.userAccount}>
            <ListItemIcon>
              <Person style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
          {this.props.user.role == 'admin' ? (
            <ListItem button={true} component="a" href={routes.admin}>
              <ListItemIcon>
                <Settings style={{ color: colors.dark_sky_blue }} />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItem>
          ) : null}
          <ListItem button={true} component="a" href={routes.logout}>
            <ListItemIcon>
              <ExitToApp style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
})

export default compose(connect(mapStateToProps))(DrawerComponent)
