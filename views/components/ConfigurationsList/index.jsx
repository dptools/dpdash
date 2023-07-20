import React from 'react'
import GridList from '@material-ui/core/GridList'
import ConfigurationCard from '../ConfigurationCard'

const ConfigurationsList = ({
  classes,
  configurations,
  gridState,
  ...rest
}) => {
  return (
    <>
      <GridList
        className={classes.gridList}
        cols={gridState.columns}
        cellHeight="auto"
      >
        {configurations.map((config) => {
          return (
            <ConfigurationCard
              key={config._id}
              classes={classes}
              config={config}
              width={gridState.gridWidth}
              {...rest}
            />
          )
        })}
      </GridList>
    </>
  )
}

export default ConfigurationsList
