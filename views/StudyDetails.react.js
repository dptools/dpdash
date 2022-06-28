import React, { useState, useEffect } from 'react'
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UploadFile from './components/StudyDetails/UploadFile'
import getCounts from './fe-utils/countUtil';
import { 
  fetchSubjects, 
  fetchStudyDetails, 
  deleteStudyDetails,
  createStudyDetails
} from './fe-utils/fetchUtil';
import getDefaultStyles from './fe-utils/styleUtil';
import { studyDetailStyles } from './styles/study_details';
import getAvatar from './fe-utils/avatarUtil';

const StudyDetails = (props) => {
  const { user, classes } = props

  const [openDrawer, setOpenDrawer] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [sideBarState, setSideBarState] = useState({ totalDays: 0, totalStudies: 0, totalSubjects: 0 })
  const [studyDetailsList, setStudyDetailsList] = useState([]);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    fetchSubjects().then(acl => {
      setSideBarState(getCounts({ acl }))
    })
    fetchStudyDetails().then(({ data }) => {
      setStudyDetailsList(data)
      setLoading(false)
    })
    setAvatar(getAvatar({ user }))
  }, [])

  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const handleChangeFile = async (e) => {
    const file = e.target.files ? e.target.files[0] : '';
    try {
      const upload = await new Response(file).json()
      const body = { ...upload, owner: user.uid }
      const { data } = await createStudyDetails(body)

      if (data.ok > 0) {
        await fetchStudyDetails().then(({ data }) => {

          return setStudyDetailsList(data)
        })
      }
    } catch (error) {
      console.error(error);
      
      return error
    }
  }
  const removeDetails = async (id) => {
    try {
      const deleted = await deleteStudyDetails(id)

      if (deleted.data > 0) {
        await fetchStudyDetails().then(({ data }) => {
          setStudyDetailsList(data)
        })
      }
    } catch (error) {
      console.error(error, "*****")
    }
  }
  return (
    <div className={classes.root}>
      <Header
        handleDrawerToggle={toggleDrawer}
        title={'Study Details'}
        isAccountPage={false}
      />
      <Sidebar
        avatar={avatar}
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
        user={user}
      />
      {isLoading && (
        <div  className={`${classes.content} ${classes.contentPadded}`}>
          <Typography
            color="textSecondary"
            variant="body2"
            component="p"
          >
            Loading...
          </Typography>
        </div>
      )} 
      {!isLoading && (
        <>
          <div className={`${classes.content} ${classes.contentPadded}`}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Study</TableCell>
                  <TableCell align="center">Target Enrollment</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
             </TableHead>
             <TableBody>
                {studyDetailsList.map(({study, targetEnrollment, _id}) => (
                  <TableRow key={_id}>
                    <TableCell align="center">
                      {study}
                    </TableCell>
                    <TableCell align="center">
                      {targetEnrollment}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        type="button"
                        variant="text"
                        onClick={() => removeDetails(_id)}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
             </TableBody>
          </Table>
          </div>
          < UploadFile 
            classes={classes}
            handleChangeFile={handleChangeFile }
          />
        </>
      )}
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
  ...studyDetailStyles(theme)
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme: true }), connect(mapStateToProps))(StudyDetails)
