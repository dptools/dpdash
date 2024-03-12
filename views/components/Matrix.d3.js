import * as d3 from 'd3'

import { getColor } from '../../server/utils/invertColor'
import { stringToDate } from '../../server/utils/dateConverter'

const margin = {
  top: 30,
  bottom: 20,
  left: 10,
  right: 30,
}

const cellWidth = 65
const DARK_GREY = '#545454'
const GREY = '#e6e6e6'
const NONE = 'none'
const WHITE = '#ffffff'

export default class Matrix {
  constructor(el, props) {
    this.el = el
    this.cardSize = props.cardSize
    this.halfCardSize = props.cardSize / 2
    this.startDay = props.startDay
    this.lastDay = props.lastDay
    this.maxDay = props.maxDay
    this.initialHeight = props.height
    this.height = props.height - margin.top - margin.bottom
    this.width = props.width - margin.right
    this.study = props.study
    this.subject = props.subject
    this.consentDate = props.consentDate
    this.startFromTheLastDay = props.startFromTheLastDay
  }

  cleanData = (data) => {
    if (data.length > 0) {
      return data
    }

    const newData = []
    for (let day = this.startDay; day <= this.lastDayForFilter; day++) {
      newData.push({ day })
    }

    return newData
  }

  get lastDayForFilter() {
    return this.lastDay === null || this.lastDay === ''
      ? this.maxDay
      : this.lastDay
  }

  validDay = (d) => d.day >= this.startDay && d.day <= this.lastDayForFilter
  create = (data) => {
    this.data = data

    const svgElement = d3
      .select(this.el)
      .append('svg')
      .attr('width', () => '100%')
      .attr('height', () => '100%')
    this.svg = svgElement.append('g')
    this.cards = this.svg
      .append('g')
      .attr('class', 'Cards')
      .attr('transform', 'translate(0,0)')

    let category = null
    let yIndices = []

    for (let idx = 0; idx < data.length; idx++) {
      const dataEl = data[idx]

      if (category !== dataEl.category) {
        category = dataEl.category
        yIndices.push(idx)
      }

      //d3.thresholdScale takes in range as (firstIndex, lastIndex]. This is a way around to ensure we get [firstIndex, lastIndex]
      const colors = dataEl.color.slice()
      colors.unshift(dataEl.color[0])
      let range =
        dataEl.range.length == 2
          ? d3.range(
              dataEl.range[0],
              dataEl.range[1],
              (dataEl.range[1] - dataEl.range[0]) / 8
            )
          : dataEl.range
      const thresholdScale = d3.scaleThreshold().domain(range).range(colors)

      if (Object.hasOwn(dataEl, 'data')) {
        const dataVariable = dataEl.variable

        //append rectangles filled with colors <3
        const card = this.cards
          .selectAll('.cell')
          .data(this.cleanData(dataEl.data), (d) => `${dataEl.label}:${d.day}`)
        card
          .enter()
          .append('rect')
          .filter(this.validDay)
          .attr('x', (d) => (d.day - this.startDay) * cellWidth)
          .attr('y', () => idx * this.cardSize)
          .attr('class', 'Card hour')
          .attr('width', cellWidth)
          .attr('height', this.cardSize)
          .style('fill', (d) =>
            d[dataVariable] !== '' && d[dataVariable] !== undefined
              ? thresholdScale(d[dataVariable])
              : WHITE
          )
          .style('stroke', (d) => (d[dataVariable] === undefined ? NONE : GREY))
          .style('stroke-width', '2px')
          .on('click', (d, i) => {
            const val = d[dataVariable] || 'Not Available'
            const msg = `The value for ${dataEl.label} on day ${d.day} is: ${val}`

            alert(msg)
          })
          .append('svg:title')
          .filter(this.validDay)
          .text((d) => d[dataVariable])

        if (dataEl?.text === true) {
          card
            .enter()
            .append('text')
            .filter(this.validDay)
            .text((d) => d[dataVariable])
            .attr(
              'x',
              (d) => (d.day - this.startDay) * cellWidth + cellWidth / 2
            )
            .attr('y', () => idx * this.cardSize + (this.cardSize * 3) / 4)
            .attr('font-size', this.halfCardSize)
            .style('fill', (d) => {
              const blockColor = !!d[dataVariable]
                ? thresholdScale(d[dataVariable])
                : WHITE

              return getColor(blockColor, true)
            })
            .attr('font-family', 'Tahoma, Geneva, sans-serif')
            .style('text-anchor', 'middle')
        }
      }
    }
    this.maxYAxisWidth = margin.left
    this.matrixHeight = margin.top //temp placeholder
    this.matrixWidth = this.svg
      .select('.Cards')
      .node()
      .getBoundingClientRect().width

    const leftMarginWhiteOut = this.generateMarginWhiteOutLeft()
    //an array of labels for the variables
    const yAxisRange = []
    const yAxisValues = []
    for (let idx = 0; idx < data.length; idx++) {
      yAxisRange.push((idx + 1) * this.cardSize - this.halfCardSize)
      yAxisValues.push(idx)
    }
    this.yScaleLinear = d3
      .scaleLinear()
      .range([this.halfCardSize, yAxisRange[yAxisRange.length - 1]])
      .domain([0, data.length - 1])
    this.yAxisLinear = d3
      .axisLeft(this.yScaleLinear)
      .ticks(data.length - 1)
      .tickValues(yAxisValues)
      .tickSize(0)

    this.yAxisLeft = this.svg
      .append('g')
      .attr('class', 'yAxisLinear')
      .call(this.yAxisLinear)
    this.adjustYAxisLeft()
    this.maxYAxisWidth = this.svg.select('.yAxisLinear').node().getBBox().width
    this.matrixHeight =
      this.svg.select('.yAxisLinear').node().getBBox().height + this.cardSize

    if (this.initialHeight == -1) {
      svgElement
        .attr('width', () => Math.max(this.width, 0))
        .attr('height', this.matrixHeight + this.cardSize * 2)
    } else if (this.initialHeight == 0 && this.width == 0) {
      svgElement
        .attr('width', () => Math.max(this.width, 0))
        .attr('height', this.matrixHeight + this.cardSize * 2)

      this.matrixHeight = this.matrixHeight + this.cardSize * 3
    }

    this.svg.attr(
      'transform',
      `translate(${this.maxYAxisWidth + margin.left},${margin.top - 5})`
    )
    leftMarginWhiteOut.attr(
      'transform',
      `translate(-${this.maxYAxisWidth + margin.left},-${this.cardSize})`
    )
    leftMarginWhiteOut
      .select('rect')
      .attr('width', this.maxYAxisWidth + margin.left)
      .attr('height', this.matrixHeight + this.cardSize)
    this.categoryMarker = this.generateCategoryMarker(yIndices)
    this.generateMarginWhiteOutBottom()
    this.generateMarginWhiteOutTop()
    this.xAxisForDatesData = this.generateXAxisForDatesData()
    this.generateXAxis()
    this.generateWhiteSpaceTopLeft()

    if (this.startFromTheLastDay) {
      this.update()
    }

    this.maxYScroll = Math.max(
      this.height,
      this.matrixHeight + margin.bottom + margin.top
    )
    this.maxXScroll = Math.max(
      this.width,
      this.matrixWidth + this.maxYAxisWidth + margin.left
    )
    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [this.maxXScroll, this.maxYScroll],
      ])
      .on('zoom', this.zoomed)
    //for some reason, vertical scrolling works better with these statements. investigate.
    this.svg
      .call(zoom, d3.zoomIdentity)
      .on('wheel.zoom', this.pan)
      .on('mousewheel.zoom', this.pan)
      .on('DOMMouseScroll.zoom', this.pan)
  }

  adjustYAxisLeft = () => {
    return this.yAxisLeft
      .selectAll('text')
      .data(this.data)
      .text((d) => d.label)
      .attr('font-size', this.halfCardSize)
      .style('fill', DARK_GREY)
  }

  scaleAxes = (transform) => {
    this.yAxisLeft.call(
      this.yAxisLinear.scale(transform.rescaleY(this.yScaleLinear))
    )
    this.xAxisBottom.call(
      this.xAxisLinearBottom.scale(transform.rescaleX(this.xScaleLinearBottom))
    )
    this.xAxisTop.call(
      this.xAxisLinearTop.scale(transform.rescaleX(this.xScaleLinearTop))
    )
    this.adjustYAxisLeft()
  }

  zoomed = () => {
    const sourceEvent = d3.event.sourceEvent
    const eventTransform = d3.event.transform
    sourceEvent?.preventDefault()

    this.cards.attr('transform', eventTransform)
    this.categoryMarker.attr(
      'transform',
      `translate(${eventTransform.x - this.maxYAxisWidth},${
        eventTransform.y
      }) scale(${eventTransform.k})`
    )

    this.scaleAxes(eventTransform)
    this.filteredXAxisTop()
  }

  pan = () => {
    const sourceEvent = d3.event
    sourceEvent.preventDefault()

    const transformAttr = this.cards.attr('transform')
    const transformAttrArray = transformAttr
      .substring(transformAttr.indexOf('(') + 1, transformAttr.indexOf(')'))
      .split(',')

    const x = parseInt(transformAttrArray[0])
    const y = parseInt(transformAttrArray[1])

    const mouseDelta = sourceEvent.wheelDelta || sourceEvent.detail
    const deltaX =
      sourceEvent.deltaX ||
      -sourceEvent.wheelDeltaX ||
      -(sourceEvent.axis == 1 ? mouseDelta : 0)
    const deltaY =
      sourceEvent.deltaY ||
      -sourceEvent.wheelDeltaY ||
      -(sourceEvent.axis == 2 ? mouseDelta : 0)
    let dx = -deltaX + x
    let dy = -deltaY + y

    //Disable zoom-in upon wheeling
    const eventTransform = d3.zoomIdentity.translate(dx, dy).scale(1)
    let transformation = eventTransform.scale(1 / eventTransform.k)
    const maxDy = (this.matrixHeight - this.height + margin.top) * -1
    const maxDx =
      (this.matrixWidth - this.width + this.maxYAxisWidth + margin.left) * -1

    if (
      dy >= 0 ||
      this.matrixHeight < this.height ||
      this.initialHeight === -1
    ) {
      dy = 0
    } else if (dy < maxDy) {
      dy = maxDy
    }

    if (this.matrixWidth < this.width || dx > 0) {
      dx = 0
    } else if (dx < maxDx) {
      dx = maxDx
    }

    this.cards.attr('transform', `translate(${dx},${dy})`)
    this.categoryMarker.attr(
      'transform',
      `translate(${dx - this.maxYAxisWidth},${dy})`
    )

    transformation = transformation.translate(
      dx - transformation.x,
      dy - transformation.y
    )

    this.scaleAxes(transformation)
    this.filteredXAxisTop().attr('font-size', this.halfCardSize)
  }

  filteredXAxisTop = () => {
    return this.xAxisTop
      .selectAll('text')
      .data(this.xAxisForDatesData.filter(this.validDay))
      .text((d) => d.marker)
      .attr('class', (d) => (d.marker === 'N/A' ? 'EmptyDates' : 'DatesText'))
  }

  generateXAxisForDatesData = () => {
    const xAxisForDatesData = []
    const startDate = this.consentDate ? stringToDate(this.consentDate, 'yyyy-mm-dd', '-') : null
    const firstDay = this.startDay - 1 //Consent date is 1
    for (let i = firstDay; i < this.lastDayForFilter; i++) {
      const day = i + 1

      if (startDate && startDate.getDay() == 0 || startDate.getDay() == 6) {
        xAxisForDatesData.push({ day, marker: 'S' })
      } else if (startDate && startDate.getDay() == 3) {
        const month = startDate.getMonth() + 1
        const localeDate = `${month}/${startDate.getDate()}/${startDate.getFullYear()}`

        xAxisForDatesData.push({
          day,
          marker: localeDate.substring(0, localeDate.length - 5),
        })
      } else {
        xAxisForDatesData.push({ day, marker: 'N/A' })
      }
      startDate.setDate(startDate.getDate() + 1)
    }

    return xAxisForDatesData
  }

  generateCategoryMarker = (indices) => {
    const { matrixWidth, matrixHeight, maxYAxisWidth } = this
    const categoryMarker = this.svg
      .append('g')
      .attr('class', 'CategoryMarker')
      .attr('transform', 'translate(-' + maxYAxisWidth + ',0)')

    for (var i = 0; i < indices.length; i++) {
      const yPosition = i === 0 ? 1 : indices[i] * this.cardSize

      categoryMarker
        .append('line')
        .attr('x1', 0)
        .attr('x2', matrixWidth + maxYAxisWidth)
        .attr('y1', yPosition)
        .attr('y2', yPosition)
        .attr('stroke', DARK_GREY)
    }
    categoryMarker
      .append('line')
      .attr('x1', 0)
      .attr('x2', matrixWidth + maxYAxisWidth)
      .attr('y1', matrixHeight - this.halfCardSize)
      .attr('y2', matrixHeight - this.halfCardSize)
      .attr('stroke-width', 1.5)
      .attr('stroke', DARK_GREY)

    return categoryMarker
  }

  generateXAxis = () => {
    const { height, matrixHeight, xAxisForDatesData, startDay } = this
    const xAxisBottomYCoordinate =
      height > 0 && height < matrixHeight
        ? height - this.cardSize * 2 + 1
        : matrixHeight - this.halfCardSize + 1
    const xAxisRange = []
    const xAxisValuesTop = []
    const xAxisValuesBottom = []

    for (let idx = 0; idx < xAxisForDatesData.length; idx++) {
      xAxisRange.push((idx + 1) * cellWidth - cellWidth / 2)
      xAxisValuesBottom.push(xAxisForDatesData[idx].day.toString())
      xAxisValuesTop.push(idx)
    }

    this.xScaleLinearTop = d3
      .scaleLinear()
      .range([cellWidth / 2, xAxisRange[xAxisRange.length - 1] || 0])
      .domain([0, xAxisForDatesData.length - 1])
    this.xScaleLinearBottom = d3
      .scaleLinear()
      .range([cellWidth / 2, xAxisRange[xAxisRange.length - 1] || 0])
      .domain(
        [startDay, xAxisForDatesData[xAxisForDatesData.length - 1]?.day] || 0
      )
    this.xAxisLinearTop = d3
      .axisTop(this.xScaleLinearTop)
      .ticks(xAxisForDatesData.length - 1 || 1)
      .tickValues(xAxisValuesTop)

    this.xAxisTop = this.svg
      .append('g')
      .attr('class', 'xAxisLinearTop')
      .call(this.xAxisLinearTop)

    this.filteredXAxisTop()
      .attr('font-size', this.halfCardSize)
      .style('fill', (d) => (d.marker === 'N/A' ? WHITE : DARK_GREY))

    this.xAxisTop.selectAll('path').attr('stroke-opacity', 0)
    this.xAxisTop.selectAll('line').attr('stroke-opacity', 0)
  }

  get widthBasedFill() {
    return this.width === 0 ? NONE : WHITE
  }

  generateMarginWhiteOutLeft = () => {
    const { matrixHeight, maxYAxisWidth } = this

    return this.generateSpace({
      width: maxYAxisWidth + margin.left + this.cardSize,
      height: matrixHeight + this.cardSize,
      x: 0,
      y: -this.halfCardSize + 2,
    })
  }

  generateMarginWhiteOutTop = () => {
    const { matrixWidth, maxYAxisWidth } = this

    return this.generateSpace({
      width: matrixWidth + maxYAxisWidth,
      height: this.cardSize + this.halfCardSize,
      x: -maxYAxisWidth,
      y: -(this.cardSize + this.halfCardSize),
    })
  }

  generateMarginWhiteOutBottom = () => {
    const bottomYCoordinate =
      this.height > 0 && this.height < this.matrixHeight
        ? this.height - this.cardSize * 2 + 1
        : this.matrixHeight - this.halfCardSize + 1
    this.generateSpace({
      width: this.matrixWidth + this.maxYAxisWidth,
      height: this.cardSize + 2,
      x: -this.maxYAxisWidth,
      y: 0,
    })
      .attr('class', 'marginBottom')
      .attr('transform', `translate(0,${bottomYCoordinate})`)
  }

  generateWhiteSpaceTopLeft = () => {
    const { maxYAxisWidth } = this

    this.generateSpace({
      width: maxYAxisWidth + margin.left,
      height: this.cardSize,
      x: -(maxYAxisWidth + margin.left),
      y: -this.cardSize,
    })
  }

  generateSpace = ({ width, height, x, y }) => {
    const el = this.svg.append('g')

    el.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', x)
      .attr('y', y)
      .style('fill', this.widthBasedFill)

    return el
  }

  update() {
    d3.select(this.el)
      .select('svg')
      .style('width', this.width)
      .style('height', this.height)
  }
}
