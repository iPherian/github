/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class DiffComponent {
  constructor ({diffViewModel}) {
    this.diffViewModel = diffViewModel
    etch.createElement(this)
  }

  render () {
    let fontFamily = atom.config.get('editor.fontFamily')
    let fontSize = atom.config.get('editor.fontSize')
    let style = {
      'font-family': fontFamily,
      'font-size': fontSize + 'px'
    }
    return (
      <div className="git-diff-container" tabIndex="-1" style={style}>{
        this.diffViewModel.getFileDiffs().map((fileDiff, index) =>
          <FileDiffComponent fileDiff={fileDiff} index={index} diffViewModel={this.diffViewModel}/>
        )
      }</div>
    )
  }
}

class FileDiffComponent {
  constructor ({fileDiff, index, diffViewModel}) {
    this.index = index
    this.fileDiff = fileDiff
    this.diffViewModel = diffViewModel
    etch.createElement(this)
  }

  render () {
    return (
      <div className="git-file-diff">
        <div className="patch-description">
          {this.getIconForFileSummary(this.fileDiff)}
          <span className="text">
            <strong className="path">{this.fileDiff.getNewPathName()} {this.index}</strong>
          </span>
        </div>
        {this.fileDiff.getHunks().map((diffHunk, index) =>
          <DiffHunkComponent diffHunk={diffHunk} fileDiffIndex={index} diffViewModel={this.diffViewModel}/>
        )}
      </div>
    )
  }

  getIconForFileSummary(fileDiff) {
    let changeStatus = fileDiff.getChangeStatus()
    return (
      <span className={`icon icon-diff-${changeStatus} status-${changeStatus}`}></span>
    )
  }
}

class DiffHunkComponent {
  constructor ({diffHunk, index, diffViewModel}) {
    this.index = index
    this.diffHunk = diffHunk
    this.diffViewModel = diffViewModel
    etch.createElement(this)
  }

  render () {
    return (
      <div className="git-diff-hunk">
        <div className="git-hunk-line diff-hunk-header">
          <div className="old-line-number"></div>
          <div className="new-line-number"></div>
          <div className="diff-hunk-data">
            {this.diffHunk.getHeader()}
          </div>
        </div>
        {this.diffHunk.getLines().map((hunkLine, index) =>
          <HunkLineComponent hunkLine={hunkLine} selected={this.diffViewModel.isLineSelected(this.diffHunk, index)}/>
        )}
      </div>
    )
  }
}

class HunkLineComponent {
    constructor ({hunkLine, selected}) {
    this.hunkLine = hunkLine
    etch.createElement(this)
  }

  render () {
    let additionOrDeletion = ''
    if (this.hunkLine.isAddition())
      additionOrDeletion = 'addition'
    else if (this.hunkLine.isDeletion())
      additionOrDeletion = 'deletion'

    return (
      <div className={`git-hunk-line ${additionOrDeletion}`}>
        <div className="old-line-number">
          {this.hunkLine.getOldLineNumber() || ''}
        </div>
        <div className="new-line-number">
          {this.hunkLine.getNewLineNumber() || ''}
        </div>
        <div className="diff-hunk-data">
          {this.hunkLine.getLineOrigin()}
          {this.hunkLine.getContent()}
        </div>
      </div>
    )
  }
}