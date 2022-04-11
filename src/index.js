import React from 'react'
import PropTypes from 'prop-types'
import getWaterMarkCanvas from './WaterMarkCanvas'
import SecurityDefense from './SecurityDefense'

const defaultOptions = {
  chunkWidth: 200,
  chunkHeight: 60,
  textAlign: 'left',
  textBaseline: 'bottom',
  globalAlpha: 0.47,
  font: '14px Microsoft Yahei',
  rotateAngle: 0,
  fillStyle: '#666'
}

const waterMarkStyle = 'position: absolute;left: 0;right: 0;top:0;bottom:0;opacity: 0.7;z-index: 9999;pointer-events: none;overflow: hidden;background-color: transparent;background-repeat: no-repeat;'
const noop = function () {}

class WaterMark extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    waterMarkText: PropTypes.string.isRequired,
    openSecurityDefense: PropTypes.bool,
    securityAlarm: PropTypes.func,
    options: PropTypes.shape({
      chunkWidth: PropTypes.number,
      chunkHeight: PropTypes.number,
      textAlign: PropTypes.string,
      textBaseline: PropTypes.string,
      globalAlpha: PropTypes.number,
      font: PropTypes.string,
      rotateAngle: PropTypes.number,
      fillStyle: PropTypes.string
    })
  }

  constructor(props) {
    super(props)
    this.watermarkId = this.genRandomId('water-mark')
    this.watermarkWrapperId = this.genRandomId('water-mark-wrapper')
    this.security = null
    this.DOMRemoveObserver = null
    this.DOMAttrModifiedObserver = null
  }

  encrypt = (str) => {
    return window.btoa(decodeURI(encodeURIComponent(str)))
  }

  genRandomId = (prefix = '') => {
    return `${this.encrypt(prefix)}-${(new Date()).getTime()}-${Math.floor(Math.random() * Math.pow(10, 8))}`
  }

  componentDidMount() {
    const { openSecurityDefense, securityAlarm } = this.props
    if (openSecurityDefense) {
      const style = {
        waterMarkStyle,
        getCanvasUrl: this.getCanvasUrl
      }
      const securityHooks = {
        securityAlarm,
        updateObserver: this.updateObserver
      }
      const watermarkDOM = {
        watermarkId: this.watermarkId,
        watermarkWrapperId: this.watermarkWrapperId,
        genRandomId: this.genRandomId
      }
      this.security = new SecurityDefense(watermarkDOM, style, securityHooks)
    }
  }

  componentWillUnmount() {
    if (this.props.openSecurityDefense) {
      if (this.DOMRemoveObserver) {
        this.DOMRemoveObserver.disconnect()
      }
      if (this.DOMAttrModifiedObserver) {
        this.DOMAttrModifiedObserver.disconnect()
      }
      this.security = null
    }
  }

  updateObserver = (observers = {}) => {
    if (observers.DOMRemoveObserver) {
      this.DOMRemoveObserver = observers.DOMRemoveObserver
    }
    if (observers.DOMAttrModifiedObserver) {
      this.DOMAttrModifiedObserver = observers.DOMAttrModifiedObserver
    }
  }

  getCanvasUrl = () => {
    const { waterMarkText, options } = this.props
    const newOptions = Object.assign({}, defaultOptions, options)
    return getWaterMarkCanvas(waterMarkText, newOptions)
  }

  render() {
    const { children } = this.props
    const styles = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      opacity: 0.7,
      zIndex: 9999,
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundImage: `url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyAyMDE4ICg2NCBCaXQpIC0tPg0KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNDBweCIgaGVpZ2h0PSI3MHB4IiB2ZXJzaW9uPSIxLjEiIHN0eWxlPSJzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyB0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IGltYWdlLXJlbmRlcmluZzpvcHRpbWl6ZVF1YWxpdHk7IGZpbGwtcnVsZTpldmVub2RkOyBjbGlwLXJ1bGU6ZXZlbm9kZCIgdmlld0JveD0iMCAwIDE0MS44NSAzMi45OSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIDxkZWZzPg0KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KICAgICAgICAgICAgPCFbQ0RBVEFbDQogICAgLmZpbDAge2ZpbGw6I0ZBQTgzMX0NCiAgICAuZmlsMiB7ZmlsbDojRjE2MTM2fQ0KICAgIC5maWwzIHtmaWxsOiM4MENBQTl9DQogICAgLmZpbDEge2ZpbGw6IzI2OTE4M30NCiAgICAuZmlsNCB7ZmlsbDojNjA2MDYyO2ZpbGwtcnVsZTpub256ZXJvfQ0KICAgXV0+DQogICAgICAgIDwvc3R5bGU+DQogICAgPC9kZWZzPg0KICAgIDxnIGlkPSJDYW1hZGFfeDAwMjBfMSI+DQogICAgICAgIDxtZXRhZGF0YSBpZD0iQ29yZWxDb3JwSURfMENvcmVsLUxheWVyIiAvPg0KICAgICAgICA8ZyBpZD0iXzE2NDE4OTgzODU3NzYiPg0KICAgICAgICAgICAgPHJlY3QgY2xhc3M9ImZpbDAiIHRyYW5zZm9ybT0ibWF0cml4KDAuMzIyNDI3IC0wLjMyMjQyNyAwLjMyMjQyNyAwLjMyMjQyNyA2LjI2NjYxRS0wNiA4LjI0Nzk4KSIgd2lkdGg9IjI1LjU4IiBoZWlnaHQ9IjI1LjU4IiAvPg0KICAgICAgICAgICAgPHJlY3QgY2xhc3M9ImZpbDAiIHRyYW5zZm9ybT0ibWF0cml4KDAuMzIyNDI3IC0wLjMyMjQyNyAwLjMyMjQyNyAwLjMyMjQyNyAwLjAwMDIzNTUxNiAyNC43NDM2KSIgd2lkdGg9IjI1LjU4IiBoZWlnaHQ9IjI1LjU4IiAvPg0KICAgICAgICAgICAgPHBvbHlnb24gY2xhc3M9ImZpbDEiIHBvaW50cz0iOC4yNSwzMi45OSAxNi41LDI0Ljc0IDI0Ljc0LDMyLjk5ICIgLz4NCiAgICAgICAgICAgIDxwb2x5Z29uIGNsYXNzPSJmaWwxIiBwb2ludHM9IjguMjUsMCAyNC43NCwwIDE2LjUsOC4yNSAiIC8+DQogICAgICAgICAgICA8cG9seWdvbiBjbGFzcz0iZmlsMiIgcG9pbnRzPSIwLDguMjUgOC4yNSwxNi41IDAsMjQuNzQgIiAvPg0KICAgICAgICAgICAgPHBvbHlnb24gY2xhc3M9ImZpbDMiIHBvaW50cz0iMTYuNSwyNC43NCAyNC43NCwxNi41IDMyLjk5LDI0Ljc0IDI0Ljc0LDMyLjk5ICIgLz4NCiAgICAgICAgICAgIDxwb2x5Z29uIGNsYXNzPSJmaWwzIiBwb2ludHM9IjE2LjUsOC4yNSAyNC43NCwwIDMyLjk5LDguMjUgMjQuNzQsMTYuNSAiIC8+DQogICAgICAgIDwvZz4NCiAgICAgICAgPHBhdGggY2xhc3M9ImZpbDQiIGQ9Ik00OS4xNyAyMi40MWMwLjg1LDAgMS42NiwtMC4xOCAyLjQyLC0wLjUzIDAuNzYsLTAuMzQgMS40OSwtMC44NiAyLjE4LC0xLjU2bDIuMDIgMi4xOWMtMC45LDAuODkgLTEuOTMsMS41OSAtMy4wOSwyLjA5IC0xLjE3LDAuNTEgLTIuMzksMC43NiAtMy42NiwwLjc2IC0xLjIzLDAgLTIuMzksLTAuMjMgLTMuNDYsLTAuNjkgLTEuMDcsLTAuNDYgLTIsLTEuMDggLTIuNzksLTEuODYgLTAuNzgsLTAuNzkgLTEuNCwtMS43MiAtMS44NiwtMi44MSAtMC40NiwtMS4wOCAtMC42OSwtMi4yNSAtMC42OSwtMy41IDAsLTEuMjQgMC4yMywtMi4zOSAwLjY5LC0zLjQ4IDAuNDYsLTEuMDkgMS4wOCwtMi4wMyAxLjg2LC0yLjgyIDAuNzksLTAuNzkgMS43MiwtMS40MiAyLjc5LC0xLjg4IDEuMDcsLTAuNDYgMi4yMywtMC42OSAzLjQ2LC0wLjY5IDEuMjcsMCAyLjUyLDAuMjUgMy43MywwLjc2IDEuMiwwLjUgMi4yNiwxLjIgMy4xNSwyLjFsLTIuMTEgMi4yOGMtMC42NSwtMC43IC0xLjM4LC0xLjIzIC0yLjE5LC0xLjYgLTAuOCwtMC4zNyAtMS42NCwtMC41NSAtMi41MSwtMC41NSAtMS41NSwwIC0yLjg2LDAuNTcgLTMuOTMsMS43MSAtMS4wOCwxLjE0IC0xLjYxLDIuNTMgLTEuNjEsNC4xNyAwLDEuNjcgMC41NCwzLjA4IDEuNjIsNC4yMSAxLjA5LDEuMTMgMi40MiwxLjcgMy45OCwxLjd6bTEyLjcgLTIxLjU5bDAgMjQuMjQgLTMuMzYgMCAwIC0yMy41MSAzLjM2IC0wLjczem03LjI1IDcuMTVsMCAxMC4xNGMwLDEuMzQgMC4zOCwyLjQgMS4xNiwzLjE5IDAuNzcsMC43OCAxLjc5LDEuMTcgMy4wNywxLjE3IDAuODksMCAxLjcsLTAuMTkgMi40MiwtMC41OSAwLjcxLC0wLjM5IDEuMzEsLTAuOTQgMS43OCwtMS42NmwwIC0xMi4yNSAzLjM1IDAgMCAxNy4wOSAtMy4zNSAwIDAgLTEuNzFjLTAuNjgsMC42NyAtMS40NCwxLjE4IC0yLjMsMS41MiAtMC44NywwLjM1IC0xLjgxLDAuNTIgLTIuODQsMC41MiAtMS45NSwwIC0zLjU0LC0wLjYyIC00Ljc5LC0xLjg4IC0xLjI0LC0xLjI1IC0xLjg2LC0yLjg2IC0xLjg2LC00LjgzbDAgLTEwLjcxIDMuMzYgMHptMTQuMTMgMTQuODdsMS44MiAtMi4yMWMwLjg5LDAuNjkgMS44LDEuMjIgMi43MywxLjU5IDAuOTMsMC4zNyAxLjg4LDAuNTUgMi44NCwwLjU1IDEuMjEsMCAyLjE5LC0wLjIzIDIuOTYsLTAuNyAwLjc2LC0wLjQ3IDEuMTQsLTEuMDkgMS4xNCwtMS44NSAwLC0wLjYgLTAuMjMsLTEuMDggLTAuNjcsLTEuNDQgLTAuNDUsLTAuMzYgLTEuMTUsLTAuNjEgLTIuMDksLTAuNzRsLTMuMDkgLTAuNDRjLTEuNjcsLTAuMjQgLTIuOTQsLTAuNzYgLTMuODEsLTEuNTYgLTAuODYsLTAuNzkgLTEuMjksLTEuODUgLTEuMjksLTMuMTcgMCwtMS41NSAwLjYyLC0yLjc5IDEuODUsLTMuNzQgMS4yMywtMC45NiAyLjg0LC0xLjQzIDQuODMsLTEuNDMgMS4yNiwwIDIuNDUsMC4xOCAzLjU4LDAuNTQgMS4xMywwLjM1IDIuMjMsMC45IDMuMzEsMS42NGwtMS43MiAyLjIyYy0wLjk0LC0wLjYzIC0xLjg1LC0xLjA4IC0yLjczLC0xLjM2IC0wLjg5LC0wLjI4IC0xLjc4LC0wLjQyIC0yLjY3LC0wLjQyIC0xLjAzLDAgLTEuODYsMC4yMSAtMi40OSwwLjY0IC0wLjYyLDAuNDIgLTAuOTQsMC45OCAtMC45NCwxLjY3IDAsMC42MyAwLjIyLDEuMTEgMC42NiwxLjQzIDAuNDMsMC4zMyAxLjE2LDAuNTcgMi4xNiwwLjcybDMuMDkgMC40NGMxLjY4LDAuMjUgMi45NiwwLjc3IDMuODUsMS41OCAwLjg4LDAuOCAxLjMyLDEuODcgMS4zMiwzLjE5IDAsMC43NiAtMC4xOCwxLjQ3IC0wLjU1LDIuMTMgLTAuMzcsMC42NiAtMC44NywxLjIzIC0xLjUxLDEuNyAtMC42NCwwLjQ3IC0xLjM5LDAuODQgLTIuMjcsMS4xMiAtMC44NywwLjI4IC0xLjgxLDAuNDIgLTIuODIsMC40MiAtMS40OCwwIC0yLjg2LC0wLjIxIC00LjE1LC0wLjY0IC0xLjI4LC0wLjQyIC0yLjQsLTEuMDUgLTMuMzQsLTEuODh6bTE5LjExIC0yLjAxbDAgLTEwLjA0IC0zLjYzIDAgMCAtMi44MiAzLjYzIDAgMCAtNC4zNyAzLjMyIC0wLjggMCA1LjE3IDUuMDQgMCAwIDIuODIgLTUuMDQgMCAwIDkuMjdjMCwwLjg3IDAuMiwxLjQ4IDAuNTksMS44NCAwLjM5LDAuMzYgMS4wNCwwLjU0IDEuOTMsMC41NCAwLjQ3LDAgMC44OSwtMC4wMyAxLjI2LC0wLjA4IDAuMzcsLTAuMDYgMC43NywtMC4xNyAxLjE5LC0wLjMybDAgMi44MmMtMC40NCwwLjE1IC0wLjk3LDAuMjggLTEuNTYsMC4zNyAtMC41OSwwLjA5IC0xLjEzLDAuMTMgLTEuNjMsMC4xMyAtMS42NSwwIC0yLjkyLC0wLjM5IC0zLjc5LC0xLjE2IC0wLjg3LC0wLjc3IC0xLjMxLC0xLjkgLTEuMzEsLTMuMzd6bTI1LjI4IDIuMjhjLTAuOTgsMC43NiAtMi4wMSwxLjMzIC0zLjA5LDEuNyAtMS4wNywwLjM3IC0yLjI1LDAuNTUgLTMuNTIsMC41NSAtMS4yNiwwIC0yLjQzLC0wLjIzIC0zLjUzLC0wLjY5IC0xLjA5LC0wLjQ2IC0yLjA1LC0xLjA4IC0yLjg1LC0xLjg2IC0wLjgxLC0wLjc5IC0xLjQ0LC0xLjcyIC0xLjksLTIuODEgLTAuNDYsLTEuMDggLTAuNjksLTIuMjUgLTAuNjksLTMuNSAwLC0xLjI0IDAuMjMsLTIuMzkgMC42NywtMy40NiAwLjQ1LC0xLjA4IDEuMDYsLTIuMDEgMS44MiwtMi43OSAwLjc2LC0wLjc4IDEuNjcsLTEuNCAyLjcyLC0xLjg2IDEuMDUsLTAuNDYgMi4xNywtMC42OSAzLjM2LC0wLjY5IDEuMTYsMCAyLjI1LDAuMjMgMy4yNywwLjY5IDEuMDIsMC40NiAxLjg5LDEuMDggMi42MiwxLjg4IDAuNzMsMC43OSAxLjMsMS43NCAxLjczLDIuODMgMC40MiwxLjEgMC42NCwyLjI4IDAuNjQsMy41M2wwIDAuOTcgLTEzLjUgMGMwLjIyLDEuNDEgMC44NywyLjU4IDEuOTQsMy41MSAxLjA4LDAuOTMgMi4zNiwxLjQgMy44MywxLjQgMC44MywwIDEuNjMsLTAuMTQgMi4zOSwtMC40MSAwLjc2LC0wLjI3IDEuNDEsLTAuNjMgMS45NCwtMS4xbDIuMTUgMi4xMXptLTcuMDggLTEyLjU5Yy0xLjI4LDAgLTIuMzksMC40MiAtMy4zNCwxLjI3IC0wLjk1LDAuODYgLTEuNTUsMS45NSAtMS44LDMuM2wxMC4xNCAwYy0wLjI0LC0xLjMgLTAuODMsLTIuMzkgLTEuNzYsLTMuMjYgLTAuOTMsLTAuODcgLTIuMDEsLTEuMzEgLTMuMjQsLTEuMzF6bTExLjUyIDE0LjU0bDAgLTE3LjA5IDMuMzUgMCAwIDIuMThjMC41MiwtMC44MyAxLjE4LC0xLjQ2IDEuOTgsLTEuOSAwLjgxLC0wLjQzIDEuNzIsLTAuNjUgMi43MiwtMC42NSAwLjM2LDAgMC42OCwwLjAyIDAuOTQsMC4wNiAwLjI3LDAuMDUgMC41MywwLjEyIDAuNzgsMC4yMWwwIDMuMDJjLTAuMzIsLTAuMTEgLTAuNjQsLTAuMiAtMC45OCwtMC4yNyAtMC4zMywtMC4wNyAtMC42NywtMC4xIC0xLC0wLjEgLTAuOTksMCAtMS44NywwLjI2IC0yLjY0LDAuNzkgLTAuNzcsMC41MiAtMS4zNywxLjMgLTEuOCwyLjMzbDAgMTEuNDIgLTMuMzUgMHoiIC8+DQogICAgPC9nPg0KPC9zdmc+')`,
      backgroundColor: 'transparent',
      backgroundRepeat: 'no-repeat'
    }

    return (
      <div style={{ position: 'relative' }} id={this.watermarkWrapperId}>
        <div style={styles} id={this.watermarkId} />
        {children}
      </div>
    )
  }
}

WaterMark.defaultProps = {
  openSecurityDefense: false,
  securityAlarm: noop,
  options: defaultOptions
}

export default WaterMark
