import { colors } from '../../constants'

export const registerStyles = () => ({
  register_card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    margin: '0 auto',
    maxWidth: '70%',
    height: '100vh',
  },
  register_title: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  register_formContainer: {
    display: 'flex',
    paddingTop: '4px',
    paddingLeft: '12px',
    paddingBottom: '4px',
    paddingRight: '12px',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  register_logo: {
    height: '350px',
    width: '350px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  register_container_button: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px',
    float: 'right',
    width: '45%',
  },
  register_submit_button: {
    borderColor: colors.neutral_blue,
    paddingTop: '11px',
    color: colors.white,
    backgroundColor: colors.neutral_blue,
    marginLeft: '12px',
  },
  register_cancel_button: {
    paddingTop: '11px',
    color: colors.neutral_blue,
  },
})
