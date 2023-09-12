import { colors } from '../../constants'

const baseImageProps = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  paddingTop: '16px',
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
}
export const mainLayoutStyles = (theme) => ({
  logoContainer: {
    ...baseImageProps,
    height: '30px',
    paddingTop: '10px',
  },
  avatarContainer: baseImageProps,
  userName: {
    textAlign: 'center',
    paddingBottom: '12px',
  },
  statsContainer: {
    padding: '8px',
    textAlign: 'center',
  },
  statTitle: {
    fontWeight: 'bold',
  },
  statData: {
    color: colors.black,
  },
  routerLink: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    textDecoration: 'none',
    alignItems: 'center',
  },
})
