import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import 'whatwg-fetch';
import update from 'immutability-helper';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Person from '@material-ui/icons/Person';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ColorLens from '@material-ui/icons/ColorLens';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase';
import Snackbar from '@material-ui/core/Snackbar';

import {compose} from 'redux';
import { withStyles } from '@material-ui/core/styles';
import DrawerComponent from './Drawer.react';
import Drawer from '@material-ui/core/Drawer';
const drawerWidth = 200;
import Hidden from '@material-ui/core/Hidden';
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
    marginTop: '64px',
  }
});

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            _id: '',
            uid: '',
            display_name : '',
            title: '',
            department: '',
            company: '',
            mail: '',
            ldap: '',
            icon: '',
            totalStudies: 0,
            totalSubjects: 0,
            totalDays : 0,
            snackTime: false,
            mobileOpen: false
        };
    }
    componentDidUpdate() {
    }
    componentWillMount() {
        this.fetchUserInfo(this.props.user.uid);
        this.setState({
            user : this.props.user
        });
        this.fetchSubjects();
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };
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
                this.autocomplete(response)
            });
        });
    }
    getAvatar = (icon) => {
        var username = this.state.display_name;
        var uid = this.state.uid;
        if(icon == '' || icon == undefined) {
            if(username == '' || username == undefined) {
                if(uid && uid.length > 0) {
                    return (
                            <Avatar style={{width: 60, height: 60}}>
                                {uid[0]}
                            </Avatar>
                    );
                } else {
                    return (
                            <Avatar style={{width: 60, height: 60, backgroundColor: '#c0d9e1'}}>
                                <Person />
                            </Avatar>
                    );
                }
            } else {
                return (
                        <Avatar style={{width: 60, height: 60, backgroundColor: '#c0d9e1'}}>
                            {username[0]}
                        </Avatar>
                );
            }
        } else {
            return (
                    <Avatar style={{width: 60, height: 60}} src={icon}></Avatar>
            );
        }
    }
    autocomplete = (acl) => {
        var options = [];
        for(var study = 0; study < acl.length; study++) {
            Array.prototype.push.apply(options, acl[study].subjects);
        }
        this.setState({
            totalStudies: acl.length,
            totalSubjects: options.length,
            totalDays: Math.max.apply(Math, options.map(function(o) { return o.days; }))
        });
    }
    fetchUserInfo = (uid) => {
        return window.fetch('/api/v1/users/' + uid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            return response.json();
        }).then((response) => {
            this.setState({
                _id: response['_id'],
                uid: response['uid'],
                display_name : response['display_name'],
                title: response['title'],
                department: response['department'],
                company: response['company'],
                mail: response['mail'],
                ldap: response['ldap'],
                icon: response['icon']
            });
        });
    }
    handleChange = (event, key) => {
        this.setState({
            [key]: event.target.value,
        });
    };
    editUserInfo = () => {
        let uid = this.state.uid;
        let user = {};
        user['uid'] = uid;
        user['display_name'] = this.state.display_name;
        user['title'] = this.state.title;
        user['department'] = this.state.department;
        user['company'] = this.state.company;
        user['mail'] = this.state.mail;
        user['icon'] = this.state.icon;

        return window.fetch('/api/v1/users/' + uid, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                user: user
            })
        }).then((response) => {
            return response;
        }).then(data => {
            this.setState({
                snackTime: true
            });
            return data;
        }).catch(error => {
            return error;
        });
    }
    openNewWindow = (uri) => {
        window.open(uri, '_self');
    }
    scaleDownImage = () => {
        let image = this.refs.userSubmittedAvatar;
        let canvas = this.refs.canvas;
        let ctx = canvas.getContext('2d');

        canvas.height = 200;
        canvas.width = 200;

        let sx = 0;
        let sy = (image.naturalHeight - image.naturalWidth) / 2;
        let swidth = image.naturalWidth;
        let sheight = image.naturalWidth;

        if(image.naturalHeight < image.naturalWidth) {
            sy = 0;
            sx = (image.naturalWidth - image.naturalHeight) / 2;
            swidth = image.naturalHeight;
            sheight = image.naturalHeight;
        }

        let x = 0;
        let y = 0;

        ctx.drawImage(image, sx, sy, swidth, sheight, x, y, 200, 200);

        let dataURL = canvas.toDataURL('image/png');
        this.setState({ icon : dataURL}, ()=> {
            this.editUserInfo();
            ctx.clearRect(0,0,canvas.width,canvas.height);
        });
    }
    handleChangeIcon = (event) => {
        let accepted_files = event.target.files;
        if (accepted_files.length > 0) {
            let reader = new FileReader();
            reader.readAsDataURL(accepted_files[0]);
            reader.onload = (e) => {
                this.setState({
                    baseURL : e.target.result
                });
            };
        }
    }
    handleCrumbs =()=> {
        this.setState({
            snackTime: false
        });
    }
    render() {
        const { classes, theme } = this.props;
        return (
              <div className={classes.root}>
                <AppBar
                    style={{
                        backgroundColor: '#ffffff',
                        boxShadow: 'none',
                    }}
                    className={classes.appBar}
                >
                    <Toolbar
                        style={{paddingLeft: '16px'}}
                    >
                        <IconButton
                            color="rgba(0, 0, 0, 0.54)"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <img width='24px' height='24px' src='/img/favicon.png'/>
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
                            Account
                        </Typography>
                        <IconButton
                            onClick={() => this.openNewWindow('/u/configure')}
                        >
                            <ColorLens color='rgba(0,0,0,0.4)'/>
                        </IconButton>
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
                            avatar={this.getAvatar(this.state.icon)}
                            totalStudies={this.state.totalStudies}
                            totalSubjects={this.state.totalSubjects}
                            totalDays={this.state.totalDays}
                            user={this.state.user}
                            name={this.state.display_name}
                        />
                    </Drawer>
                </Hidden>
                <Hidden
                smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <DrawerComponent
                            avatar={this.getAvatar(this.state.icon)}
                            totalStudies={this.state.totalStudies}
                            totalSubjects={this.state.totalSubjects}
                            totalDays={this.state.totalDays}
                            user={this.state.user}
                            name={this.state.display_name}
                        />
                    </Drawer>
                </Hidden>
                <div
                    className={classes.content}
                    style={{
                        height: '100%',
                        padding: '12px',
                        overflow: 'scroll'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            marginBottom: '12px'
                        }}
                    >
                        <input
                            accept="image/*"
                            id="raised-button-file"
                            multiple
                            type="file"
                            style={{display: 'none'}}
                            onChange={this.handleChangeIcon}
                        />
                        <label htmlFor="raised-button-file">
                            <ButtonBase
                                component="span"
                                style={{
                                    width: '100%',
                                    margin: '0 auto'
                                }}
                                focusRipple
                            >
                                <Tooltip title="Edit Profile Photo">
                                    {this.getAvatar(this.state.icon)}
                                </Tooltip>
                            </ButtonBase>
                        </label> 
                    </div>
                                    <TextField
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '8px'
                                        }}
                                        label="Full Name"
                                        name="display_name"
                                        value={this.state.display_name}
                                        onChange={(e) => this.handleChange(e, 'display_name')}
                                        fullWidth={true}
                                    />
                                    <TextField
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '8px'
                                        }}
                                        label="Email"
                                        type="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                        name="email"
                                        value={this.state.mail}
                                        fullWidth={true}
                                        onChange={(e) => this.handleChange(e, 'mail')}
                                    />
                                    <TextField
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '8px'
                                        }}
                                        label="Title"
                                        name="title"
                                        value={this.state.title}
                                        fullWidth={true}
                                        onChange={(e) => this.handleChange(e, 'title')}
                                    />
                                    <TextField
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '8px'
                                        }}
                                        label="Department"
                                        name="department"
                                        value={this.state.department}
                                        fullWidth={true}
                                        onChange={(e) => this.handleChange(e, 'department')}
                                    />
                                    <TextField
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '8px'
                                        }}
                                        label="Company"
                                        name="company"
                                        value={this.state.company}
                                        fullWidth={true}
                                        onChange={(e) => this.handleChange(e, 'company')}
                                    />
                                <div
                                    style={{
                                        textAlign: 'right'
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        type="submit"
                                        onClick={this.editUserInfo}
                                        style={{
                                            borderColor: '#5790bd',
                                            paddingTop: '11px',
                                            color: '#ffffff',
                                            backgroundColor: '#5790bd',
                                            marginLeft: '12px'
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                        </div>
                <Snackbar
                    open={this.state.snackTime}
                    message="Your account has been updated."
                    autoHideDuration={2000}
                    onRequestClose={this.handleCrumbs}
                />
                <img
                    style={{
                        display: 'none'
                    }}
                    ref="userSubmittedAvatar"
                    onLoad={this.scaleDownImage}
                    src={this.state.baseURL}
                />
                <canvas ref="canvas" style={{display:'none'}}></canvas>
              </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default compose(
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps)
)(AccountPage);
