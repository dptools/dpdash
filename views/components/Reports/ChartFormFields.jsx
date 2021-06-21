import React, { useState, useEffect } from 'react';
import MultiSelectCreatable from 'react-select/lib/Creatable';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Clear from '@material-ui/icons/Clear';
import {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
} from '../MultiSelect';
import LabelHelpDialog from './LabelHelpDialog';
import Button from '@material-ui/core/Button';

const isValidNewOption = (inputValue, selectValue, selectOptions) => !(
  !inputValue ||
  selectOptions.some(option => (
    option.value.toLowerCase() === inputValue.toLowerCase()
  ))
);

const ChartFormFields = ({
  chart,
  chartIndex,
  classes,
  styles,
  clearForm,
  handleChartChange,
  handleOpenDialog,
  handleCloseDialog,
  labelInfoOpen,
  removeChart,
  disabled,
}) => { 
  const [labelsState, setLabelsState] = useState({
    valueLabels: [],
  });
  const handleFormChange = (e) => {
    e.persist();
    if (e.target.name === 'chartType') {
      clearForm();
    }
    handleChartChange({ field: e.target.name, value: e.target.value });
  };
  const handleMultiSelectChange = (name) => (choices) => {
    handleChartChange({ field: name, value: choices.map(choice => choice.value) });
  };
  const addValueLabel = (e) => {
    e.preventDefault();
    setLabelsState(prevState => ({
      valueLabels: [...prevState.valueLabels, {
        value: '',
        label: '',
      }]
    }));
  };
  const removeValueLabel = (e, idx) => {
    e.preventDefault();
    setLabelsState(prevState => ({
      valueLabels: prevState.valueLabels.filter((s, _idx) => _idx !== idx),
    }));
  };
  const handleValueLabelChange = (e, idx, field) => {
    e.persist();
    const valueToUse = e.target.value;
    setLabelsState(prevState => ({
      valueLabels: prevState.valueLabels.map((s, _idx) => {
        if (_idx !== idx) return s;
        return { ...s, [field]: valueToUse };
      })
    }));
  };
  useEffect(() => {
    handleChartChange({ field: 'valueLabels', value: labelsState.valueLabels });
  }, [labelsState]);

  return (
    <>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {chart.title !== '' ? chart.title : `Chart ${chartIndex + 1}`} 
      </Typography>
      <InputLabel id="chartType-label">Chart type</InputLabel>
      <Select
        labelId="chartType-label"
        name="chartType" 
        value={chart.chartType}
        onChange={handleFormChange}
        fullWidth
        required
        disabled={disabled}
      >
        <MenuItem value="none" disabled>Select a chart type...</MenuItem>
        <MenuItem value="bar">Bar chart</MenuItem>
        {/* Remove "disabled" prop from these when functional: */}
        <MenuItem value="study-line" disabled>Line chart (by study)</MenuItem>
        <MenuItem value="category-line" disabled>Line chart (by variable)</MenuItem>
        <MenuItem value="table" disabled>Milestones table</MenuItem>
        <MenuItem value="demo-table" disabled>Demographics table</MenuItem>
      </Select>
      {chart.chartType !== 'none' && (
        <>
          <FormHelperText>
            {chart.chartType === 'bar' && (
              <>
                A bar chart with <strong>studies</strong> on the X-axis
                and actual values for a <strong>single variable</strong> on the Y-axis,
                shown as percentages of defined target values.
              </>
            )}
            {chart.chartType === 'study-line' && (
              <>
                A line chart with <strong>time</strong> on the X-axis, values for
                a <strong>single variable</strong> on the Y-axis, and colors
                to indicate <strong>studies</strong>.
              </>
            )}
            {chart.chartType === 'category-line' && (
              <>
                A line chart with <strong>time</strong> on the X-axis, values for
                a <strong>single study</strong> on the Y-axis, and colors
                to indicate <strong>variables</strong>.
              </>
            )}
            {chart.chartType === 'table' && (
              <>
                A table with <strong>dates</strong> as columns,
                and actual values for <strong>variables</strong> as rows, optionally
                also including percentages of defined target values.
              </>
            )}
            {chart.chartType === 'demo-table' && (
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
            value={chart.title}
            onChange={handleFormChange}
            fullWidth
            required
            disabled={disabled}
          />
          { ['bar', 'study-line', 'category-line'].includes(chart.chartType) && (
            <TextField
              className={classes.textInput}
              label="Assessment"
              name="assessmentSingle"
              value={chart.assessmentSingle}
              onChange={handleFormChange}
              fullWidth
              required
              disabled={disabled}
            />
          )}
          {['bar', 'study-line'].includes(chart.chartType) && (
            <>
              <TextField
                className={classes.textInput}
                label="Variable"
                name="variableSingle"
                value={chart.variableSingle}
                onChange={handleFormChange}
                fullWidth
                required
                disabled={disabled}
              />
              {chart.valueLabels.length > 0 && 
                chart.valueLabels.map((valueLabel, idx) => (
                <div key={idx} className={classes.formLabelRow}>
                  <Button
                    variant="outlined"
                    type="button"
                    className={classes.formLabelCol}
                    onClick={(e) => removeValueLabel(e, idx)}
                  >
                    <Clear />
                  </Button>
                  <TextField
                    label="Value"
                    value={valueLabel?.value}
                    onChange={(e) => handleValueLabelChange(e, idx, 'value')}
                    disabled={disabled}
                    className={classes.formLabelCol}
                    style={{ width: '33%' }}
                  />
                  <TextField
                    label="Label/Group"
                    value={valueLabel?.label}
                    onChange={(e) => handleValueLabelChange(e, idx, 'label')}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                  <br />
                </div>
              ))}
              <Button
                variant="text"
                type="button"
                className={classes.textButton}
                onClick={addValueLabel}
                disabled={disabled}
              >
                + Add label/grouping for variable value
              </Button>
              <Button
                variant="text"
                type="button"
                onClick={() => handleOpenDialog('labelInfoOpen')}
              >
                <HelpOutline />
              </Button>
              <LabelHelpDialog
                open={labelInfoOpen}
                onClose={() => handleCloseDialog('labelInfoOpen')}
              />
              <br />
            </>
          )}
          {chart.chartType === 'category-line' && (
            <MultiSelectCreatable
              classes={classes}
              styles={styles}
              name="variableMulti"
              options={chart.variableOptions}
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
              value={chart.variableMulti.map(v => ({value: v, label: v }))}
              onChange={handleMultiSelectChange('variableMulti')}
              formatCreateLabel={(inputValue) => inputValue}
              noOptionsMessage={() => 'Enter a variable name, then select it\
                from the dropdown or press enter'}
              isValidNewOption={isValidNewOption}
              placeholder="Variable(s)"
              isMulti
              isDisabled={disabled}
            />
          )}
        </>
      )}
      <Button
        type="button"
        onClick={removeChart}
        color="secondary"
        variant="outlined"
        className={classes.textInput}
        fullWidth
      >
        <Clear /> Remove
        {' '}
        {chart.title !== '' ? chart.title : `chart ${chartIndex + 1}`}
      </Button>
    </>
  );
};

export default ChartFormFields;
