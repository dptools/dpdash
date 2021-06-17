import React, { createRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ReactSelect from 'react-select';
import MultiSelectCreatable from 'react-select/lib/Creatable';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Clear from '@material-ui/icons/Clear';
import Save from '@material-ui/icons/Save';
import TuneIcon from '@material-ui/icons/Tune';
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
import EnrollmentBarChart from './components/EnrollmentBarChart';
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects, fetchStudies } from './fe-utils/fetchUtil';
import { fetchDataForChart } from './fe-utils/reportsUtil';
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
    alignItems: 'middle',
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
});

class ReportsPage extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
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
      title: '',
      variableOptions: [],
      reportType: 'bar',
      variableSingle: '',
      assessmentSingle: '',
      variableMulti: [],
      studiesOptions: [],
      studies: [],
      studySingle: '',
      chartData: {},
      valueLabels: [],
      labelInfoOpen: false,
      targets: [],
    };
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects();
      this.setState(getCounts({ acl }));
      const studies = await fetchStudies();
      this.setState({
        studiesOptions: studies.map(study => ({ label: study, value: study })),
        loading: false,
      })
    } catch (err) {
      console.error(err.message);
      this.setState({ loading: false });
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
  clearForm = () => {
    this.setState({
      variableSingle: '',
      assessmentSingle: '',
      variableMulti: [],
      studies: [],
      studySingle: '',
      valueLabels: [],
    });
  }
  handleFormChange = (e) => {
    e.persist();
    if (e.target.name === 'reportType') {
      this.clearForm();
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSelectChange = (name) => (choice) => {
    this.setState({
      [name]: choice.value,
    });
  }
  handleMultiSelectChange = (name) => (choices) => {
    this.setState({
      [name]: choices.map(choice => choice.value),
    });
  };
  isValidNewOption = (inputValue, selectValue, selectOptions) => !(
    !inputValue ||
    selectOptions.some(option => (
      option.value.toLowerCase() === inputValue.toLowerCase()
    ))
  );
  handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ errorOpen: false });
  };
  loadPreset = () => {
    console.log('load preset');
  };
  savePreset = () => {
    console.log('save preset');
  };
  addValueLabel = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      valueLabels: [...prevState.valueLabels, {
        value: '',
        label: '',
      }]
    }));
  };
  removeValueLabel = (e, idx) => {
    e.preventDefault();
    this.setState(prevState => ({
      valueLabels: prevState.valueLabels.filter((s, _idx) => _idx !== idx),
    }));
  };
  handleValueLabelChange = (e, idx, field) => {
    e.persist();
    const valueToUse = e.target.value;
    this.setState(prevState => ({
      valueLabels: prevState.valueLabels.map((s, _idx) => {
        if (_idx !== idx) return s;
        return { ...s, [field]: valueToUse };
      })
    }));
  };
  handleOpenLabelInfo = () => {
    this.setState({ labelInfoOpen: true });
  };
  handleCloseLabelInfo = () => {
    this.setState({ labelInfoOpen: false });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({
        formDisabled: true,
      });
      const formValues = { 
        reportType: this.state.reportType,
        varName: this.state.variableSingle,
        assessment: this.state.assessmentSingle,
        variables: this.state.variableMulti,
        studies: this.state.studies,
        studySingle: this.state.studySingle,
        valueLabels: this.state.valueLabels,
      };
      const data = await fetchDataForChart(formValues);
      this.setState({
        formDisabled: false,
        chartData: {
          title: this.state.title,
          data,
        }
      });
      this.chartRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      this.setState({
        formDisabled: false,
        error: err.message,
        errorOpen: true,
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
        <div
          className={`${classes.content} ${classes.contentPadded}`}
        >
          <form onSubmit={this.handleSubmit}>
            <InputLabel id="reportType-label">Report type</InputLabel>
            <Select
              labelId="reportType-label"
              name="reportType" 
              value={this.state.reportType}
              onChange={this.handleFormChange}
              fullWidth
              required
              disabled={this.state.formDisabled}
            >
              <MenuItem value="bar">Bar chart</MenuItem>
              <MenuItem value="study-line">Line chart (by study)</MenuItem>
              <MenuItem value="category-line">Line chart (by variable)</MenuItem>
              <MenuItem value="table">Milestones table</MenuItem>
              <MenuItem value="demo-table">Demographics table</MenuItem>
            </Select>
            <FormHelperText>
              {this.state.reportType === 'bar' && (
                <>
                  A bar chart with <strong>studies</strong> on the X-axis
                  and actual values for a <strong>single variable</strong> on the Y-axis,
                  shown as percentages of defined target values.
                </>
              )}
              {this.state.reportType === 'study-line' && (
                <>
                  A line chart with <strong>time</strong> on the X-axis, values for
                  a <strong>single variable</strong> on the Y-axis, and colors
                  to indicate <strong>studies</strong>.
                </>
              )}
              {this.state.reportType === 'category-line' && (
                <>
                  A line chart with <strong>time</strong> on the X-axis, values for
                  a <strong>single study</strong> on the Y-axis, and colors
                  to indicate <strong>variables</strong>.
                </>
              )}
              {this.state.reportType === 'table' && (
                <>
                  A table with <strong>dates</strong> as columns,
                  and actual values for <strong>variables</strong> as rows, optionally
                  also including percentages of defined target values.
                </>
              )}
              {this.state.reportType === 'demo-table' && (
                <>
                  A preset table showing total recruitment by racial, ethnic, and
                  gender demographics.
                </>
              )}
            </FormHelperText>
            <TextField
              className={classes.textInput}
              label="Title"
              name="title"
              value={this.state.title}
              onChange={this.handleFormChange}
              fullWidth
              required
              disabled={this.state.formDisabled}
            />
            {this.state.reportType !== 'category-line' && (
              <ReactSelect
                classes={classes}
                styles={selectStyles}
                name="studies"
                options={this.state.studiesOptions}
                components={{
                  Control,
                  Menu,
                  MultiValue,
                  NoOptionsMessage,
                  Option,
                  Placeholder,
                  SingleValue,
                  ValueContainer,
                }}
                value={this.state.studies.map(study => ({
                  value: study, label: study,
                }))}
                onChange={this.handleMultiSelectChange('studies')}
                placeholder="Studies"
                isMulti
                isDisabled={this.state.formDisabled}
              />
            )}
            {this.state.reportType === 'category-line' && (
              <ReactSelect
                classes={classes}
                styles={selectStyles}
                name="studySingle"
                options={this.state.studiesOptions}
                components={{
                  Control,
                  Menu,
                  MultiValue,
                  NoOptionsMessage,
                  Option,
                  Placeholder,
                  SingleValue,
                  ValueContainer,
                }}
                value={this.state.studySingle === '' ? null : { label: this.state.studySingle, value: this.state.studySingle }}
                onChange={this.handleSelectChange('studySingle')}
                placeholder="Study"
                isDisabled={this.state.formDisabled}
              />
            )}
            { ['bar', 'study-line', 'category-line'].includes(this.state.reportType) && (
              <TextField
                className={classes.textInput}
                label="Assessment"
                name="assessmentSingle"
                value={this.state.assessmentSingle}
                onChange={this.handleFormChange}
                fullWidth
                required
                disabled={this.state.formDisabled}
              />
            )}
            {['bar', 'study-line'].includes(this.state.reportType) && (
              <>
                <TextField
                  className={classes.textInput}
                  label="Variable"
                  name="variableSingle"
                  value={this.state.variableSingle}
                  onChange={this.handleFormChange}
                  fullWidth
                  required
                  disabled={this.state.formDisabled}
                />
                {this.state.valueLabels.length > 0 && 
                  this.state.valueLabels.map((valueLabel, idx) => (
                  <div key={idx} className={classes.formLabelRow}>
                    <TextField
                      label="Value"
                      value={valueLabel?.value}
                      onChange={(e) => this.handleValueLabelChange(e, idx, 'value')}
                      disabled={this.state.formDisabled}
                      className={classes.formLabelCol}
                    />
                    <TextField
                      label="Label/Group"
                      value={valueLabel?.label}
                      onChange={(e) => this.handleValueLabelChange(e, idx, 'label')}
                      disabled={this.state.formDisabled}
                      className={classes.formLabelCol}
                    />
                    <Button
                      variant="outlined"
                      type="button"
                      onClick={(e) => this.removeValueLabel(e, idx)}
                    >
                      <Clear />
                    </Button>
                    <br />
                  </div>
                ))}
                <Button
                  variant="text"
                  type="button"
                  className={classes.textButton}
                  onClick={this.addValueLabel}
                  disabled={this.state.formDisabled}
                >
                  + Add label/grouping(s) for variable value(s)
                </Button>
                <Button
                  variant="text"
                  type="button"
                  onClick={this.handleOpenLabelInfo}
                >
                  <HelpOutline />
                </Button>
                <Dialog
                  open={this.state.labelInfoOpen}
                  onClose={this.handleCloseLabelInfo}
                  aria-labelledby="labelinfo-dialog-title"
                  aria-describedby="labelinfo-dialog-description"
                >
                  <DialogTitle id="labelinfo-dialog-title">
                    Add label/grouping(s) for variable value(s)
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="labelinfo-dialog-description">
                      <p>
                        Sometimes, the raw values for a variable do not give enough
                        information on their own for the purposes of making charts.
                      </p>
                      <p>
                        To remedy this, you may add labels for any possible raw value(s)
                        of a variable by clicking the &ldquo;Add label/grouping(s) for
                        variable value(s)&rdquo; button. You may group multiple values
                        together by using the same label for multiple values (though the
                        label must be identical, case-sensitive, for each value you want
                        grouped together).
                      </p>
                      <p>
                        If you do not add labels, the labels on the chart will simply be
                        populated with the raw values from the original data.
                      </p>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCloseLabelInfo} color="primary" autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
                <br />
              </>
            )}
            {this.state.reportType === 'category-line' && (
              <MultiSelectCreatable
                classes={classes}
                styles={selectStyles}
                name="variableMulti"
                options={this.state.variableOptions}
                components={{
                  Control,
                  Menu,
                  MultiValue,
                  NoOptionsMessage,
                  Option,
                  Placeholder,
                  SingleValue,
                  ValueContainer,
                }}
                value={this.state.variableMulti.map(v => ({value: v, label: v }))}
                onChange={this.handleMultiSelectChange('variableMulti')}
                formatCreateLabel={(inputValue) => inputValue}
                noOptionsMessage={() => 'Enter a variable name, then select it\
                  from the dropdown or press enter'}
                isValidNewOption={this.isValidNewOption}
                placeholder="Variable(s)"
                isMulti
                isDisabled={this.state.formDisabled}
              />
            )}
            <Button
              variant="outlined"
              type="submit"
              className={classes.submitButton}
              disabled={this.state.formDisabled}
            >
              Submit
            </Button>
          </form>
          {this.state.chartData && Object.keys(this.state.chartData).length > 1 && (
            <div ref={this.chartRef}>
              <EnrollmentBarChart 
                chartData={this.state.chartData}
              />
            </div>
          )}
        </div>
        <div
          className={classes.bottomRight}
        >
          <Button
            variant="fab"
            color="secondary"
            focusRipple
            onClick={this.loadPreset}
          >
            <Tooltip title="Load preset">
              <TuneIcon />
            </Tooltip>
          </Button>
          <Button
            variant="fab"
            color="secondary"
            focusRipple
            onClick={this.savePreset}
          >
            <Tooltip title="Save preset">
              <Save />
            </Tooltip>
          </Button>
        </div>
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
  user: state.user
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(ReportsPage);
