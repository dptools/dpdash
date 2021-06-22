import React, { createRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import ReactSelect from 'react-select';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { 
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
} from './components/MultiSelect';
import Chart from './components/Reports/Chart';
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects, fetchStudies } from './fe-utils/fetchUtil';
import { fetchReport, fetchDataForChart } from './fe-utils/reportsUtil.js';
import getDefaultStyles from './fe-utils/styleUtil';

const MultiSelectComponents =  {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const styles = theme => ({
  ...getDefaultStyles(theme),
  contentPadded: {
    padding: '12px',
    marginTop: '64px',
    overflow: 'scroll',
  },
  paragraph: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  textInput: {
    marginTop: '8px',
    marginBottom: '8px'
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
});

class ViewReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.singleStudyRef = createRef();
    this.multiStudyRef = createRef();
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
      error: '',
      errorOpen: false,
      formDisabled: false,
      reportName: '',
      charts: [],
      chartsData: [],
      studiesOptions: [],
      studies: [],
      studySingle: '',
      chartDataLoaded: false,
    };
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects();
      this.setState(getCounts({ acl }));
      const studies = await fetchStudies();
      this.setState({
        studiesOptions: studies.map(study => ({ label: study, value: study })),
      });
      const { id } = this.props.report;
      const { charts, reportName } = await fetchReport({ id });
      this.setState({
        charts,
        reportName,
        loading: false,
      });
      if (charts.length > 0) {
        if (!charts.every(chart => chart.chartType === 'category-line')) {
          this.multiStudyRef.current.select.inputRef.required = true;
        } 
        if (charts.some(chart => chart.chartType === 'category-line')) {
          this.singleStudyRef.current.select.inputRef.required = true;
        }
      }
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
  }
  handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ errorOpen: false });
  }
  handleSelectChange = (name) => (choice) => {
    this.setState({
      [name]: choice.value,
    });
    if (!choice.value) this.singleStudyRef.current.select.inputRef.required = true;
    else this.singleStudyRef.current.select.inputRef.required = false;
  }
  handleMultiSelectChange = (name) => (choices) => {
    this.setState({
      [name]: choices.map(choice => choice.value),
    });
    if (choices.length === 0) this.multiStudyRef.current.select.inputRef.required = true;
    else this.multiStudyRef.current.select.inputRef.required = false;
  }
  showCharts = async (e) => {
    e.preventDefault();
    try {
      this.setState({ formDisabled: true });
      const charts = this.state.charts;
      await Promise.all(
        charts.map(async (chart, idx) => {
          const formValues = { 
            chartType: chart.chartType,
            varName: chart.variableSingle,
            assessment: chart.assessmentSingle,
            variables: chart.variableMulti,
            studies: this.state.studies,
            studySingle: this.state.studySingle,
            valueLabels: chart.valueLabels,
          };
          const data = await fetchDataForChart(formValues);    
          const chartData = {
            title: chart.title,
            data,
          };
          this.setState(prevState => ({
            charts: prevState.charts.map((s, _idx) => {
              if (_idx !== idx) return s;
              return { ...s, chartData };
            })
          }));    
        })
      );
      this.setState({
        chartDataLoaded: true,
        formDisabled: false,
      });
    } catch (err) {
      this.setState({
        error: err.message,
        errorOpen: true,
        formDisabled: false,
      });
    }  
  }
  render() {
    const { classes, theme, user } = this.props;
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
          title={this.state.reportName}
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
              {this.state.charts.length > 0 && (
                <form onSubmit={this.showCharts}>
                  {!this.state.charts.every(chart => chart.chartType === 'category-line') && (
                    <ReactSelect
                      ref={this.multiStudyRef}
                      classes={classes}
                      styles={selectStyles}
                      name="studies"
                      options={this.state.studiesOptions}
                      components={MultiSelectComponents}
                      value={this.state.studies.map(study => ({
                        value: study, label: study,
                      }))}
                      onChange={this.handleMultiSelectChange('studies')}
                      placeholder="Studies"
                      isMulti
                      isDisabled={this.state.formDisabled}
                    />
                  )}
                  {this.state.charts.some(chart => chart.chartType === 'category-line') && (
                    <>
                      <FormHelperText>
                        Select one study for the chart(s) in this report that only use one study.
                      </FormHelperText>
                      <ReactSelect
                        ref={this.singleStudyRef}
                        classes={classes}
                        styles={selectStyles}
                        name="studySingle"
                        options={this.state.studiesOptions}
                        components={MultiSelectComponents}
                        value={this.state.studySingle === '' 
                          ? null 
                          : { label: this.state.studySingle, value: this.state.studySingle }}
                        onChange={this.handleSelectChange('studySingle')}
                        placeholder="Study"
                        isDisabled={this.state.formDisabled}
                      />
                    </>
                  )}
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    className={classes.textInput}
                    disabled={this.state.formDisabled}
                  >
                    Generate report
                  </Button>
                </form>
              )}
              {this.state.chartDataLoaded && (
                this.state.charts.map((chart) => (
                  <Chart
                    key={chart.title}
                    chart={chart}
                  />
                ))
              )}
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
)(ViewReportPage);
