import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects } from './fe-utils/fetchUtil';
import getDefaultStyles from './fe-utils/styleUtil';

const styles = theme => ({
  ...getDefaultStyles(theme),
  contentPadded: {
    padding: '12px',
    marginTop: '64px',
    overflow: 'scroll',
  },
  bottomRight: {
    right: 4,
    bottom: 4,
    position: 'fixed'
  },
  paragraph: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
});

class ReportsListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      width: 0,
      height: 0,
      marginHeight: 72,
      marginWidth: 24,
      totalStudies: 0,
      totalSubjects: 0,
      totalDays: 0,
      mobileOpen: false,
      loading: true,
      formsDisabled: false,
      error: '',
      errorOpen: false,
      reports: [],
    };
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects();
      this.setState(getCounts({ acl }));
      const reports = await this.fetchReports();
      this.setState({
        reports,
        loading: false,
      })
    } catch (err) {
      console.error(err.message);
      this.setState({
        loading: false,
        error: err.message,
        errorOpen: true,
       });
    }
    this.setState({
      width: window.innerWidth - this.state.marginWidth,
      height: window.innerHeight - this.state.marginHeight,
      avatar: getAvatar({ user: this.props.user })
    })
    /* Resize listener register */
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ errorOpen: false });
  };
  fetchReports = async () => {
    const reportsRes = await window.fetch('/api/v1/reports', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
    });
    if (!reportsRes.ok) {
      throw Error(reportsRes.statusText);
    }
    const reportsJson = await reportsRes.json();
    const { reports } = reportsJson;
    return reports;
  };
  deleteReport = async (report) => {
    if (window.confirm(`Are you sure you want to delete the report "${report.reportName}"?`)) {
      try { 
        this.setState({
          formsDisabled: true,
        });
        const res = await window.fetch(`/api/v1/reports/${report._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
        });
        if (!res.ok) {
          throw Error(res.statusText);
        }
        const reports = await this.fetchReports();
        this.setState({
          error: 'Report deleted successfully',
          reports: reports !== null ? reports : [],
          errorOpen: true,
          formsDisabled: false,
        });
      } catch (err) {
        this.setState({
          error: err.message,
          errorOpen: true,
          formsDisabled: false,
        });
      }
    }
  };

  render() {
    const { classes, user } = this.props;
    return (
      <div
        className={classes.root}
      >
        <Header
          handleDrawerToggle={this.handleDrawerToggle}
          title={'Reports'}
          isAccountPage={false}
        />
        <Sidebar
          avatar={this.state.avatar}
          handleDrawerToggle={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
          totalDays={this.state.totalDays}
          totalStudies={this.state.totalStudies}
          totalSubjects={this.state.totalSubjects}
          user={user}
        />
        {this.state.loading && (
          <div
            className={`${classes.content} ${classes.contentPadded}`}
          >
            <Typography
              className={classes.paragraph}
              variant="body2"
              component="p"
            >
              Loading...
            </Typography>
          </div>
        )}
        {!this.state.loading && (
          <>
            <div
              className={`${classes.content} ${classes.contentPadded}`}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.reports && this.state.reports.map(report => (
                    <TableRow key={report._id}>
                      <TableCell component="th" scope="row">
                        <Button
                          type="button"
                          color="primary"
                          disabled={this.state.formsDisabled}
                          href={`/reports/${report._id}/edit`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>{report.reportName}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="text"
                          onClick={() => this.deleteReport(report)}
                          disabled={this.state.formsDisabled}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div
              className={classes.bottomRight}
            >
              <Tooltip title="Create report">
                <Button
                  variant="fab"
                  color="secondary"
                  focusRipple
                  href="/reports/new"
                >
                  <Add />
                </Button>
              </Tooltip>
            </div>
          </>
        )}
        <Snackbar
          open={this.state.errorOpen}
          message={this.state.error}
          autoHideDuration={4000}
          onClose={this.handleCloseError}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(ReportsListPage);
