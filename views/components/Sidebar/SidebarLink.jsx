import React, { forwardRef } from 'react'

import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import './SidebarLink.css'

const SidebarLink = forwardRef(function SidebarLink(props, ref) {
  return (
    <NavLink
      ref={ref}
      to={props.to}
      className={({ isActive }) =>
        classNames('SidebarLink_link', { 'SidebarLink_link-active': isActive })
      }
    >
      {props.children}
    </NavLink>
  )
})

export default SidebarLink
