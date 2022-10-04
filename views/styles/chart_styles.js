import { colors } from '../../constants'

export const chartStyles = (theme) => ({
  textInput: {
    marginTop: '8px',
    marginBottom: '8px',
    width: '66%',
  },
  formLabel: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  formLabelRow: {
    display: 'flex',
  },
  formLabelCol: {
    marginRight: '8px',
  },
  addLabelContainer: {
    height: '60px',
    display: 'flex',
  },
  variableListInput: {
    width: '20%',
  },
  colorLabel: {
    alignSelf: 'center',
    marginLeft: '10px',
    fontSize: '18px',
    marginRight: '15px',
  },
  deleteContainer: {
    marginLeft: '30px',
  },
  icon: {
    padding: '15px',
    marginBottom: '10px',
  },
  textButton: {
    color: colors.neutral_blue,
    textTransform: 'none',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '66%',
  },
  swatchContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '15px',
    marginBottom: '10px',
  },
  swatch: {
    width: '100%',
    height: '18px',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    top: 'calc(100% + 2px)',
    borderRadius: '9px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '10',
  },
  targetValueContainer: {
    alignSelf: 'flex-end',
    paddingRight: '2%',
  },
  dialogTitle: {
    backgroundColor: colors.black,
  },
  dialogTypography: {
    color: colors.white,
  },
  dialogContent: {
    padding: '24px',
    overflowY: 'visible',
  },
  dialogCancelButton: {
    color: colors.neutral_blue,
  },
  dialogShareButton: {
    borderColor: colors.neutral_blue,
    paddingTop: '11px',
    color: colors.white,
    backgroundColor: colors.neutral_blue,
    marginLeft: '12px',
  },
  disable: {
    pointerEvents: 'none',
    color: colors.disabled_gray,
  },
  publicText: {
    alignSelf: 'center',
  },
  colorPickerSwatchBox: {
    display: 'flex',
    padding: '12px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorPickerSwatch: {
    width: '24px',
    height: '24px',
    margin: '4px',
    border: 'none',
    padding: 0,
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    WebkitAppearance: 'none',
    outlineOffset: 'none',
  },
  tooltipContainer: {
    width: '200px',
    padding: '14px 14px 7px 14px ',
    background: colors.transparentWhite,
  },
  tooltipHeaderRow: {
    display: 'flex',
    width: '100%',
    paddingBottom: '4px',
    borderBottom: 'solid gray 0.5px',
  },
  tooltipContentRow: {
    display: 'flex',
    width: '100%',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  tooltipLabelColumn: {
    display: 'flex',
    flex: '2',
  },
  tooltipValueColumn: {
    display: 'flex',
    flex: '3',
  },
})
