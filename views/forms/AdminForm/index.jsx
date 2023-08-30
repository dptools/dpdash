import React from 'react'
import Form from '../Form'
import UserResetKeyFields from '../UserResetKeyFormFields'
import AdminUsersTable from '../../components/AdminUsersTable'
import UserPriviligeFields from '../UserPriviligeFormFields'

const AdminForm = ({
  classes,
  control,
  currentRowIndex,
  height,
  onAccess,
  onResetPassword,
  onDeleteUser,
  onClose,
  openAccessFields,
  openResetKeyFields,
  onUpdateUser,
  options,
  resetKey,
  rowCount,
  rowClassName,
  user,
  users,
  userValues,
  width,
}) => {
  return (
    <Form>
      <AdminUsersTable
        classes={classes}
        users={users}
        control={control}
        height={height}
        width={width}
        onAccess={onAccess}
        onResetPassword={onResetPassword}
        onDeleteUser={onDeleteUser}
        rowClassName={rowClassName}
        onUpdateUser={onUpdateUser}
        rowCount={rowCount}
        user={user}
      />
      <UserPriviligeFields
        classes={classes}
        open={openAccessFields}
        currentRowIndex={currentRowIndex}
        onClose={onClose}
        options={options}
        control={control}
        onUpdateUser={onUpdateUser}
        userValues={userValues}
      />
      <UserResetKeyFields
        open={openResetKeyFields}
        resetKey={resetKey}
        onClose={onClose}
      />
    </Form>
  )
}

export default AdminForm
