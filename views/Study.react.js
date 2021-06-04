import React, { Component } from 'react'
import GraphFactory from './components/GraphFactory'
import { connect } from 'react-redux'
import 'whatwg-fetch'

import { stringToDate, diffDates } from '../server/utils/dateConverter'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as _ from 'lodash'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import DrawerComponent from './components/Drawer';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

import getAvatar from './fe-utils/avatarUtil';

const drawerWidth = 200;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    borderRight: '0px'
  },
  content: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    flexGrow: 1,
    backgroundColor: '#fefefe',
    padding: theme.spacing.unit * 3,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    marginTop: theme.spacing.unit,
    position: 'absolute',
    width: '100%'
  },
});

class Study extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: {},
      graph: {},
      user: {},
      svgLink: {},
      startFromTheLastDay: false,
      graphWidth: window.innerWidth,
      width: 0,
      height: 0,
      marginHeight: 48,
      marginWidth: 24,
      graphHeight: -1,
      startDay: 1,
      lastDay: null,
      openAvatarDialog: null,
      openConfigDialog: null,
      openStatDialog: null,
      metadata: {},
      configurations: {
        colormap: []
      },
      data: {
        matrix: {}
      },
      timezone: {
        timeZone: 'America/New_York'
      },
      complete: {},
      today: '',
      todayDateObject: null,
      weeksToView: 4,
      totalStudies: 0,
      totalSubjects: 0,
      totalDays: 0,
      mobileOpen: false
    }
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  handleResize = () => {
    this.setState({
      width: window.innerWidth - this.state.marginWidth,
      height: window.innerHeight - this.state.marginHeight
    })
  }
  countSubjects = (acl) => {
    var options = [];
    for (var study = 0; study < acl.length; study++) {
      Array.prototype.push.apply(options, acl[study].subjects);
    }
    this.setState({
      totalStudies: acl.length,
      totalSubjects: options.length,
      totalDays: Math.max.apply(Math, options.map(function (o) { return o.days; }))
    });
  }
  fetchSubjects = () => {
    return window.fetch('/api/v1/studies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }).then((response) => {
      if (response.status !== 200) {
        return
      }
      return response.json()
    }).then((response) => {
      let studies = response ? response : [];
      window.fetch('/api/v1/subjects?q=' + JSON.stringify(studies), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
      }).then((response) => {
        if (response.status !== 200) {
          return
        }
        return response.json()
      }).then((response) => {
        this.countSubjects(response)
      });
    });
  }
  generateMatrices = (matrixDataList) => {
    let matrixList = []
    if (matrixDataList.length < 1) {
      return matrixList
    }

    for (var item in matrixDataList) {
      let maxDay = 1
      for (let dataIndex = 0; dataIndex < matrixDataList[item].matrixData.length; dataIndex++) {
        let maxObj = _.maxBy(matrixDataList[item].matrixData[dataIndex]['data'], function (o) { return o.day })
        if (maxObj == undefined) {
          continue
        }
        let day = maxObj['day']
        if (day > maxDay) {
          maxDay = day
        }
      }
      let consentDate = matrixDataList[item].consentDate
      let consentDateObject = stringToDate(consentDate, "yyyy-mm-dd", "-")

      let daysToView = this.state.weeksToView * 7

      let numOfDays = maxDay;
      let tempDateObj = new Date(consentDateObject.getTime());
      let completed = (matrixDataList[item].project in this.state.complete && this.state.complete[matrixDataList[item].project].indexOf(matrixDataList[item].subject) > -1);
      if (!completed) {
        numOfDays = diffDates(consentDateObject, this.state.todayDateObject);
        tempDateObj = new Date(this.state.todayDateObject.getTime())
      }
      tempDateObj.setDate(tempDateObj.getDate() - daysToView);

      let link = '/dashboard/' + matrixDataList[item].project + '/' + matrixDataList[item].subject
      matrixList.push(
        <div className="StudyView">
          {completed ? <a className="subjectID" style={{ fontFamily: '"Roboto", sans-serif', textDecoration: 'none', paddingBottom: '8px' }} target="_blank" href={link} rel="noreferrer"> {matrixDataList[item].subject + ' (Complete)'}</a> : <a className="subjectID" style={{ fontFamily: '"Roboto", sans-serif', textDecoration: 'none', paddingBottom: '8px' }} target="_blank" href={link} rel="noreferrer"> {matrixDataList[item].subject}</a>}
          <GraphFactory
            id="matrix"
            type="matrix"
            width={this.state.width < 960 ? this.state.width : this.state.width - drawerWidth}
            height={this.state.graphHeight}
            data={matrixDataList[item].matrixData}
            subject={matrixDataList[item].subject}
            study={matrixDataList[item].project}
            consentDate={tempDateObj.toISOString().substring(0, 10)}
            ref="matrix"
            configuration={this.state.configurations}
            startFromTheLastDay={this.state.startFromTheLastDay}
            startDay={(numOfDays > daysToView) ? (numOfDays - daysToView + 1) : 1}
            lastDay={(numOfDays > daysToView) ? numOfDays : null}
            cardSize={20}
            maxDay={maxDay}
            user={this.state.user.uid}
          />
          <Divider
            style={{
              marginTop: '4px',
              marginBottom: '16px'
            }}
          />
        </div>
      )
    }

    return matrixList
  }
  fetchUserPreferences = (uid) => {
    let star = this.state.star;
    let complete = this.state.complete;
    return fetch('/api/v1/users/' + uid + '/preferences', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }).then((response) => {
      if (response.status !== 200) {
        return
      }
      return response.json()
    }).then((response) => {
      if (response) {
        star = 'star' in response ? response['star'] : star;
        complete = 'complete' in response ? response['complete'] : complete;
      }
      this.setState({
        star: star,
        complete: complete,
        preferences: response
      });
      return;
    });
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    let today = new Date().toLocaleDateString('en-US', this.state.timezone)
    this.fetchSubjects();
    this.setState({
      todayDateObject: stringToDate(today, 'mm/dd/yyyy', '/'),
      subject: this.props.subject,
      user: this.props.user,
      configurations: this.props.graph.configurations
    });
    this.fetchUserPreferences(this.props.user.uid);
  }
  componentDidMount() {
    /* Resize listener register */
    window.addEventListener('resize', this.handleResize)
    this.setState({
      width: window.innerWidth - this.state.marginWidth,
      height: window.innerHeight - this.state.marginHeight,
      avatar: getAvatar({ user: this.props.user })
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar
            variant='dense'
            style={{
              paddingLeft: '16px'
            }}
          >
            <IconButton
              color="rgba(0, 0, 0, 0.54)"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <img width='24px' height='24px' src='/img/favicon.png' />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              style={{
                color: 'rgba(0,0,0,0.4)',
                fontSize: '18px',
                letterSpacing: '1.25px',
                flexGrow: 1
              }}
            >
              {this.props.subject.project}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden
          mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerComponent
              avatar={this.state.avatar}
              totalStudies={this.state.totalStudies}
              totalSubjects={this.state.totalSubjects}
              totalDays={this.state.totalDays}
              user={this.props.user}
              name={this.props.user.name}
            />
          </Drawer>
        </Hidden>
        <Hidden
          smDown implementation="css">
          <Drawer
            ref='permanentDrawer'
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <DrawerComponent
              avatar={this.state.avatar}
              totalStudies={this.state.totalStudies}
              totalSubjects={this.state.totalSubjects}
              totalDays={this.state.totalDays}
              user={this.props.user}
              name={this.props.user.name}
            />
          </Drawer>
        </Hidden>
        <div
          className={classes.content}
          style={{
            padding: '12px',
            marginTop: '48px',
            overflowY: 'scroll'
          }}
        >
          {this.generateMatrices(this.props.graph.matrixData)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  graph: state.graph,
  user: state.user,
  subject: state.subject
})

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(Study);
