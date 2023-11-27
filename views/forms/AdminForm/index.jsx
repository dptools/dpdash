import React from 'react'

import UserResetKeyFields from '../UserResetKeyFormFields'
import AdminUsersTable from '../../components/VirtualTables/AdminUsersTable'
import UserPriviligeFields from '../UserPriviligeFormFields'

const AdminForm = ({
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
    <form>
      <AdminUsersTable
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
    </form>
  )
}

export default AdminForm
