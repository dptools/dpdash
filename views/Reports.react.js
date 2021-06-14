import React from 'react';
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
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
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
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects, fetchStudies } from './fe-utils/fetchUtil';
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
      variableOptions: [],
      reportType: 'bar',
      variableSingle: '',
      variableMulti: [],
      studiesOptions: [],
      studies: [],
      studySingle: '',
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
  handleFormChange = (e) => {
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
    console.log(choices);
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
  loadPreset = () => {
    console.log('load preset');
  }
  savePreset = () => {
    console.log('save preset');
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
          <form>
            <InputLabel id="reportType-label">Report type</InputLabel>
            <Select
              labelId="reportType-label"
              name="reportType" 
              value={this.state.reportType}
              onChange={this.handleFormChange}
              fullWidth
              required
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
              />
            )}
            {['bar', 'study-line'].includes(this.state.reportType) && (
              <TextField
                className={classes.textInput}
                label="Variable"
                name="variableSingle"
                value={this.state.variableSingle}
                onChange={this.handleFormChange}
                fullWidth
                required
              />
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
              />
            )}
          </form>
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
