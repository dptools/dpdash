import React, {Component} from 'react';
import {render} from 'react-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {compose} from 'redux';
import moment from 'moment';
import { Column, Table } from 'react-virtualized';
import * as _ from 'lodash';

import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    marginTop: theme.spacing.unit * 4,
    overflowX: 'auto',
    boxShadow: 'none',
    backgroundColor: '#fefefe'
  },
  table: {
    backgroundColor: '#fefefe'
  },
  th : {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    backgroundColor: '#fefefe'
  },
  td : {
  },
  cell: {
    padding: 'dense'
  },
});
const drawerWidth = 200;
class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            marginHeight: 48,
            marginWidth: 5,
            sortBy: '',
            sortDirection: 'ASC',
            preferences: {},
            data: []
        };
    }
    componentDidUpdate() {
    }
    componentDidMount() {
        this.setState({
            width: window.innerWidth - this.state.marginWidth,
            height: window.innerHeight - this.state.marginHeight,
        });
        window.addEventListener('resize', this.handleResize)
    }
    handleResize = (event) => {
        this.setState({
            width: window.innerWidth - this.state.marginWidth,
            height: window.innerHeight - this.state.marginHeight
        })
    }
    componentWillMount() {
        //this.fetchPreferences(this.props.user.uid);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    babyProofPreferences = (preferences) => {
        let preference = {};
        preference['star'] = 'star' in preferences ? preferences['star'] : {};
        preference['sort'] = 'sort' in preferences ? preferences['sort'] : 0;
        preference['config'] = 'config' in preferences ? preferences['config'] : '';
        return preference;
    }
    updateUserPreferences = (index) => {
        let uid = this.state.user.uid;
        let preference = this.babyProofPreferences({'sort': index});

        return window.fetch('/api/v1/users/' + uid + '/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                preferences: preference
            })
        }).then((response) => {
            this.setState({
                preferences: preference
            });
        });
    }
    fetchPreferences = (uid) => {
        return window.fetch('/api/v1/users/' + uid + '/preferences', {
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
                preferences: this.babyProofPreferences(response)
            });
        });
    }
    sort = ({sortBy, sortDirection}) => {
        const sortedList = this.sortList({sortBy, sortDirection})
        this.setState({
            sortBy: sortBy,
            sortDirection: sortDirection,
        })
    }
    sortList = ({sortBy, sortDirection}) => {
        let list = _.map(this.state.data, _.clone)
        return _.orderBy(list, [sortBy], sortDirection.toLowerCase())
    }
    rowClassName = ({index}) => {
        if (index < 0) {
            return 'headerRow'
        } else {
            return index % 2 === 0 ? 'evenRow' : 'oddRow'
        }
    }
    render() {
        const { classes } = this.props;
        const momentSetting = {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MM/DD/YYYY'};
        const nowT = moment().local();

        /*
        this.state.data.filter((row) => {
            var key = row.study + row.subject;
            var filter = this.props.filter.map(f => f.value);
            if(filter.length > 0 && filter.indexOf(key) === -1) {
                return false;
            } else {
                return true;
            }
        })*/
        //var pref = this.state.preferences;
        return (
            <Paper className={classes.root}>
              {this.props.data.length > 0 ?
                <Table
                    width={this.state.width < 960 ? this.state.width : this.state.width - drawerWidth}
                    height={this.state.height}
                    headerHeight={48}
                    headerStyle={{
                        fontFamily: '"Roboto", sans-serif',
                        paddingTop: '24px',
                        height: '48px',
                        color: 'rgba(0, 0, 0, 0.54)',
                        fontWeight: '500',
                        fontSize: '0.75rem'
                    }}
                    rowStyle={{
                        fontFamily: '"Roboto", sans-serif',
                        height: '40px',
                        fontSize: '0.8125rem',
                        fontWeight: '400',
                        color: 'rgba(0, 0, 0, 0.87)'
                    }}
                    rowHeight={48}
                    rowCount={2}
                    rowGetter={({ index }) => this.props.data[index]}
                    rowClassName={this.rowClassName}
                    sort={this.sort}
                    sortBy={this.state.sortBy}
                    sortDirection={this.state.sortDirection}
                >
                    <Column
                        label='Complete'
                        cellRenderer={
                            <Checkbox
                                className={classes.td}
                                disableRipple={true}
                                icon={<CheckBoxOutlineBlankIcon/>}
                                checkedIcon={
                                    <CheckBoxIcon style={{ color: '#14c1c7' }} />
                                }
                            />
                        }
                        dataKey='synced'
                        width={this.state.width / 6}
                    />
                </Table> : null}
            </Paper>
        );
    }
}
const mapStateToProps = (state) => ({
    user: state.user
});

export default compose(
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps)
)(TableComponent);
