import { colors } from '../../constants'

export const accountPageStyles = (theme) => ({
  account_page_container: {
    height: '100vh',
    backgroundColor: colors.configWhite,
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 3,
  },
  form: {
    padding: '12px',
  },
  userAvatar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  userAvatarInput: {
    display: 'none',
  },
  userAvatarContainer: {
    cursor: 'pointer',
  },
  formInputSpacing: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  formSubmitButtonContainer: {
    textAlign: 'right',
  },
  formSubmitButton: {
    borderColor: colors.neutral_blue,
    paddingTop: '11px',
    color: colors.white,
    backgroundColor: colors.neutral_blue,
    marginLeft: '12px',
  },
})
