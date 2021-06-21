import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Save from '@material-ui/icons/Save';
import TuneIcon from '@material-ui/icons/Tune';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SavePresetDialog from './components/Reports/SavePresetDialog';
import LoadPresetsDialog from './components/Reports/LoadPresetsDialog';
import ChartFormFields from './components/Reports/ChartFormFields';
import getAvatar from './fe-utils/avatarUtil';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects } from './fe-utils/fetchUtil';
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
  separator: {
    marginTop: '8px',
    marginBottom: '8px',
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
      formDisabled: false,
      error: '',
      errorOpen: false,
      charts: [],
      labelInfoOpen: false,
      loadPresetOpen: false,
      savePresetOpen: false,
      presetFormDisabled: false,
      presetName: '',
      presets: [],
    };
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects();
      this.setState(getCounts({ acl }));
      const presets = await this.fetchPresets();
      this.setState({
        presets: presets !== null ? presets : [],
        loading: false,
      });
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
  fetchPresets = async () => {
    const presetsRes = await window.fetch('/api/v1/charts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
    });
    const presetsJson = await presetsRes.json();
    const { foundCharts } = presetsJson;
    return foundCharts;
  };
  loadPreset = (preset) => {
    this.setState({
      title: preset.title,
      chartType: preset.chartType,
      variableSingle: preset.varName,
      assessmentSingle: preset.assessment,
      variableMulti: preset.variables,
      valueLabels: preset.valueLabels,
    });
    this.handleCloseDialog('loadPresetOpen');
  };
  deletePreset = async (preset) => {
    if (window.confirm(`Are you sure you want to delete the preset "${preset.presetName}"?`)) {
      try { 
        this.setState({
          formDisabled: true,
        });
        const res = await window.fetch(`/api/v1/charts/${preset._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
        });
        if (!res.ok) {
          throw Error(res.statusText);
        }
        const presets = await this.fetchPresets();
        this.setState({
          error: 'Preset deleted successfully',
          presets: presets !== null ? presets : [],
          errorOpen: true,
          formDisabled: false,
        });
        this.handleCloseDialog('loadPresetOpen');
      } catch (err) {
        this.setState({
          error: err.message,
          errorOpen: true,
          formDisabled: false,
        });
      }
    }
  };
  savePreset = async (e) => {
    e.preventDefault();
    try { 
      this.setState({
        presetFormDisabled: true,
      });
      const body = { 
        presetName: this.state.presetName,
        charts: this.state.charts,
      };
      const res = await window.fetch('/api/v1/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw Error(res.statusText);
      }
      const presets = await this.fetchPresets();
      this.setState({
        error: 'Preset saved successfully',
        errorOpen: true,
        presetFormDisabled: false,
        presetName: '',
        presets: presets !== null ? presets : [],
      });
      this.handleCloseDialog('savePresetOpen');
    } catch (err) {
      this.setState({
        error: err.message,
        errorOpen: true,
        presetFormDisabled: false,
      });
    }
  };
  addChart = (e) => {
    e.preventDefault();
    console.log(e);
    this.setState(prevState => ({
      charts: [...prevState.charts, {
        title: '',
        variableOptions: [],
        chartType: '',
        variableSingle: '',
        assessmentSingle: '',
        variableMulti: [],
        chartData: {},
        valueLabels: [],
      }]
    }));
    console.log(this.state.charts);
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
  handleOpenDialog = (dialogState) => {
    this.setState({ [dialogState]: true });
  };
  handleCloseDialog = (dialogState) => {
    this.setState({ [dialogState]: false });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
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
            {this.state.charts && this.state.charts.length === 0 && (
              <p>
                This report currently does not contain any charts. Add as many charts
                as you wish by clicking the button below.
              </p>
            )}
            {this.state.charts && this.state.charts.map((chart, idx) => (
              <>
                <ChartFormFields
                  chart={chart}
                  key={`chart${idx}`}
                  classes={classes}
                  styles={selectStyles}
                  clearForm={() => this.clearForm(idx)}
                  handleChartChange={({ field, value }) => this.handleChartChange(idx, field, value)}
                  handleOpenDialog={this.handleOpenDialog}
                  handleCloseDialog={this.handleCloseDialog}
                  labelInfoOpen={this.state.labelInfoOpen}
                  disabled={this.state.formDisabled}
                />
                <hr className={classes.separator} />
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
          <Tooltip title="Load preset">
            <Button
              variant="fab"
              color="secondary"
              focusRipple
              onClick={() => this.handleOpenDialog('loadPresetOpen')}
            >
              <TuneIcon />
            </Button>
          </Tooltip>
          <LoadPresetsDialog
            open={this.state.loadPresetOpen}
            presets={this.state.presets}
            disabled={this.state.formDisabled}
            loadPreset={this.loadPreset}
            deletePreset={this.deletePreset}
            onClose={() => {
              this.handleCloseDialog('loadPresetOpen');
            }}
          />
          <Tooltip title="Save preset">
            <Button
              variant="fab"
              color="secondary"
              focusRipple
              onClick={() => this.handleOpenDialog('savePresetOpen')}
            >
              <Save />
            </Button>
          </Tooltip>
          <SavePresetDialog
            open={this.state.savePresetOpen}
            presetName={this.state.presetName}
            savePreset={this.savePreset}
            textInputClass={classes.textInput}
            handleFormChange={this.handleFormChange}
            disabled={this.state.presetFormDisabled}
            onClose={() => {
              this.handleCloseDialog('savePresetOpen');
              this.setState({
                presetName: '',
              });
            }}
          />
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
