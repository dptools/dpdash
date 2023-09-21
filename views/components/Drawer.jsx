import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import Home from '@material-ui/icons/Home'
import Person from '@material-ui/icons/Person'
import ColorLens from '@material-ui/icons/ColorLens'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Settings from '@material-ui/icons/Settings'
import { ShowChart } from '@material-ui/icons'

import { colors } from '../../constants/styles'
import { routes } from '../routes/routes'
import getAvatar from '../fe-utils/avatarUtil'

const DrawerComponent = (props) => {
  return (
    <>
      <div className={props.classes.logoContainer}>
        <img style={{ height: '100%' }} src={'/img/dpdash.png'} />
      </div>
      <div className={props.classes.avatarContainer}>
        {getAvatar({ user: props.user })}
      </div>

      <Typography
        noWrap={true}
        className={props.classes.userName}
        variant="subheading"
      >
        {props.user.name ? props.user.name : props.user.uid}
      </Typography>
      <table className={props.classes.statsContainer}>
        <tbody>
          <tr>
            <td>
              <Typography noWrap={true} className={props.classes.statTitle}>
                {props.totalStudies}
              </Typography>
            </td>
            <td>
              <Typography noWrap={true} className={props.classes.statTitle}>
                {props.totalSubjects}
              </Typography>
            </td>
            <td>
              <Typography noWrap={true} className={props.classes.statTitle}>
                {props.totalDays}
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography noWrap={true} className={props.classes.statData}>
                {'studies'}
              </Typography>
            </td>
            <td>
              <Typography noWrap={true} className={props.classes.statData}>
                {'participants'}
              </Typography>
            </td>
            <td>
              <Typography noWrap={true} className={props.classes.statData}>
                {'days'}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
      <Divider />
      <List dense={true}>
        <ListItem>
          <RouterLink to={routes.main} className={props.classes.routerLink}>
            <ListItemIcon>
              <Home style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </RouterLink>
        </ListItem>
        <ListItem>
          <RouterLink to={routes.charts} className={props.classes.routerLink}>
            <ListItemIcon>
              <ShowChart style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Charts" />
          </RouterLink>
        </ListItem>
        <ListItem>
          <RouterLink to={routes.configs} className={props.classes.routerLink}>
            <ListItemIcon>
              <ColorLens style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Configure" />
          </RouterLink>
        </ListItem>
        <ListItem>
          <RouterLink
            to={routes.userAccount}
            className={props.classes.routerLink}
          >
            <ListItemIcon>
              <Person style={{ color: colors.dark_sky_blue }} />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </RouterLink>
        </ListItem>
        {props.user.role === 'admin' ? (
          <ListItem>
            <RouterLink to={routes.admin} className={props.classes.routerLink}>
              <ListItemIcon>
                <Settings style={{ color: colors.dark_sky_blue }} />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </RouterLink>
          </ListItem>
        ) : null}
        <ListItem button={true} onClick={() => props.onLogout()}>
          <ListItemIcon>
            <ExitToApp style={{ color: colors.dark_sky_blue }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  )
}

export default DrawerComponent
