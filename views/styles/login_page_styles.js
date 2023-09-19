import { colors } from '../../constants'

export const loginStyles = (theme) => ({
  login_container: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: '100vh',
    width: '100vw',
    alignItems: 'center',
    backgroundColor: colors.container_grey,
  },
  login_card: {
    display: 'flex',
    maxWidth: 600,
    maxHeight: 500,
  },
  login_card_column: {
    display: 'flex',
    flexDirection: 'column',
  },
  login_content: {
    flex: '1 0 auto',
  },
  login_title: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  login_sign_up: {
    fontWeight: '500',
    color: colors.neutral_blue,
  },
  login_form: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '4px',
    paddingLeft: '12px',
    paddingBottom: '4px',
    paddingRight: '12px',
  },
  login_button: {
    float: 'right',
    marginTop: '12px',
    color: '#5790bd',
  },
  form_image: {
    width: '317px',
    margin: '50px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  reset_link: {
    textAlign: 'right',
    width: '100%',
    marginTop: '12px',
    marginBottom: '12px',
    color: '#5790bd',
    textDecoration: 'none',
  },
  register_link: {
    textAlign: 'center',
    width: '100%',
    marginTop: '60px',
    marginBottom: '12px',
    textDecoration: 'none',
    fontWeight: 'normal',
  },
})
