import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Save from '@material-ui/icons/Save';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SaveReportDialog from './components/Reports/SaveReportDialog';
import ChartFormFields from './components/Reports/ChartFormFields';
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects } from './fe-utils/fetchUtil';
import { fetchReport } from './fe-utils/reportsUtil.js';
import getDefaultStyles from './fe-utils/styleUtil';

const styles = theme => ({
  ...getDefaultStyles(theme),
  textInput: {
    marginTop: '8px',
    marginBottom: '8px'
  },
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
  textButton: {
    color: '#5790bd',
    textTransform: 'none',
  },
  formLabelRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  formLabelCol: {
    marginRight: '8px',
  },
  submitButton: {
    borderColor: '#5790bd',
    paddingTop: '11px',
    color: '#ffffff',
    backgroundColor: '#5790bd',
    marginLeft: '12px',
    marginTop: '12px',
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
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  paragraph: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
});

class EditReportPage extends React.Component {
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
      formDisabled: false,
      error: '',
      errorOpen: false,
      charts: [],
      labelInfoOpen: false,
      saveReportOpen: false,
      report: {},
      reportFormDisabled: false,
      reportName: '',
    };
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects();
      this.setState(getCounts({ acl }));
      const { mode, id } = this.props.report;
      if (mode === 'edit' && id) {
        const { charts, reportName } = await fetchReport({ id });
        this.setState({
          charts,
          reportName,
        });
      }
      this.setState({
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
  clearForm = (idx) => {
    this.setState(prevState => ({
      charts: prevState.charts.map((s, _idx) => {
        if (_idx !== idx) return s;
        return { 
          title: '',
          variableSingle: '',
          assessmentSingle: '',
          variableMulti: [],
          valueLabels: [],
        };
      })
    }));
  }
  handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ errorOpen: false });
  };
  saveReport = async (e) => {
    e.preventDefault();
    try { 
      this.setState({
        reportFormDisabled: true,
        formDisabled: true,
      });
      const body = { 
        reportName: this.state.reportName,
        charts: this.state.charts,
      };
      let url = '/api/v1/reports';
      let method = 'POST';
      const { mode, id } = this.props.report;
      if (mode === 'edit') {
        method = 'PATCH';
        url = `/api/v1/reports/${id}`;
      }
      const res = await window.fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw Error(res.statusText);
      }
      this.setState({
        error: 'Report saved successfully',
        errorOpen: true,
        formDisabled: false,
        reportFormDisabled: false,
      });
      if (mode !== 'edit') { 
        this.setState({ reportName: '' });
        this.handleCloseDialog('saveReportOpen');
      }
    } catch (err) {
      this.setState({
        error: err.message,
        errorOpen: true,
        formDisabled: false,
        reportFormDisabled: false,
      });
    }
  };
  addChart = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      charts: [...prevState.charts, {
        title: '',
        variableOptions: [],
        chartType: 'none',
        variableSingle: '',
        assessmentSingle: '',
        variableMulti: [],
        chartData: {},
        valueLabels: [],
      }]
    }));
  };
  removeChart = (e, idx) => {
    e.preventDefault();
    this.setState(prevState => ({
      charts: prevState.charts.filter((chart, _idx) => _idx !== idx),
    }));
  };
  handleChartChange = (idx, field, value) => {
    this.setState(prevState => ({
      charts: prevState.charts.map((s, _idx) => {
        if (_idx !== idx) return s;
        return { ...s, [field]: value };
      })
    }));
  };
  handleReportNameChange = (e) => {
    e.preventDefault();
    this.setState({
      reportName: e.target.value,
    });
  }
  handleOpenDialog = (dialogState) => {
    this.setState({ [dialogState]: true });
  };
  handleCloseDialog = (dialogState) => {
    this.setState({ [dialogState]: false });
  };

  render() {
    const { classes, theme, user, report } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    return (
      <div
        className={classes.root}
      >
        <Header
          handleDrawerToggle={this.handleDrawerToggle}
          title={report.mode === 'edit' ? this.state.reportName : 'Create report'}
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
              <form onSubmit={(e) => e.preventDefault()}>
                {this.state.charts && this.state.charts.length === 0 && (
                  <Typography
                    className={classes.paragraph}
                    variant="body2"
                    component="p"
                  >
                    This report currently does not contain any charts. Add charts by 
                    clicking the button below.
                  </Typography>
                )}
                {this.state.charts && this.state.charts.map((chart, idx) => (
                  <>
                    <ChartFormFields
                      chart={chart}
                      chartIndex={idx}
                      key={`chart${idx}`}
                      classes={classes}
                      styles={selectStyles}
                      clearForm={() => this.clearForm(idx)}
                      handleChartChange={({ field, value }) => this.handleChartChange(idx, field, value)}
                      handleOpenDialog={this.handleOpenDialog}
                      handleCloseDialog={this.handleCloseDialog}
                      labelInfoOpen={this.state.labelInfoOpen}
                      removeChart={(e) => this.removeChart(e, idx)}
                      disabled={this.state.formDisabled}
                    />
                    {idx < (this.state.charts.length - 1) && (
                      <Divider className={classes.divider} />
                    )}
                  </>
                ))}
                <Button
                  variant="outlined"
                  type="button"
                  onClick={this.addChart}
                  className={classes.submitButton}
                  disabled={this.state.formDisabled}
                >
                  + Add a chart
                </Button>
              </form>
            </div>
            <div
              className={classes.bottomRight}
            >
              <Tooltip title="Save report">
                <Button
                  variant="fab"
                  color="secondary"
                  focusRipple
                  onClick={(e) => {
                    if (report.mode === 'edit') {
                      this.saveReport(e);
                    } else {
                      this.handleOpenDialog('saveReportOpen');
                    }
                  }}
                >
                  <Save />
                </Button>
              </Tooltip>
              <SaveReportDialog
                open={this.state.saveReportOpen}
                reportName={this.state.reportName}
                saveReport={this.saveReport}
                textInputClass={classes.textInput}
                handleFormChange={this.handleReportNameChange}
                disabled={this.state.reportFormDisabled}
                onClose={() => this.handleCloseDialog('saveReportOpen')}
              />
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
  report: state.report,
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(EditReportPage);
