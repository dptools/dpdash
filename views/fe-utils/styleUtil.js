const getDefaultStyles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    backgroundColor: colors.configWhite,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#fefefe',
    padding: theme.spacing.unit * 3,
  },
  contentPadded: {
    padding: '12px',
    marginTop: '64px',
    overflow: 'scroll',
  },
})

export default getDefaultStyles
