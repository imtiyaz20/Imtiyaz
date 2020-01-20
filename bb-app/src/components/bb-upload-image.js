import React, { Component } from "react";
import ReactDOM from "react-dom";
import imgs from "./1.jpeg";
export default class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      selected: false,
      x: -1,
      y: -1,
      w: -1,
      h: -1,
      x2: -1,
      y2: -1
    };
    this.uploadSingleFile = this.uploadSingleFile.bind(this);
    this.upload = this.upload.bind(this);
  }

  onSelected = rect => {
    this.setState({
      selected: true,
      ...rect
    });
  };

  getSelectionStr() {
    if (this.state.selected) {
      const state = this.state;
      return `x: ${state.x}, y: ${state.y}, x2: ${state.x2}, y2: ${state.y2},`;
    }
    return "No Selection";
  }

  uploadSingleFile(e) {
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    });
  }

  upload(e) {
    e.preventDefault();
    console.log(this.state.file);
  }

  render() {
    let imgPreview;
    if (this.state.file) {
      imgPreview = <img src={this.state.file} alt="" />;
    }
    return (
      <form>
        <div>
          <Rector width="640" height="480" onSelected={this.onSelected} />
          <div>{this.getSelectionStr()}</div>
        </div>
        <div className="form-group preview">{imgPreview}</div>

        <div className="form-group">
          <input
            type="file"
            className="form-control"
            onChange={this.uploadSingleFile}
          />
        </div>
      </form>
    );
  }
}

class Rector extends React.Component {
  static defaultProps = {
    width: 320,
    height: 200,
    strokeStyle: "#F00",
    lineWidth: 2,
    onSelected: () => {}
  };

  canvas = null;
  ctx = null;
  isDirty = false;
  isDrag = false;
  startX = -1;
  startY = -1;
  curX = -1;
  curY = -1;

  constructor(props) {
    super(props);
  }

  componentDidMount(props) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.strokeStyle = this.props.strokeStyle;
    this.ctx.lineWidth = this.props.lineWidth;
    this.addMouseEvents();
  }

  updateCanvas = () => {
    if (this.isDrag) {
      requestAnimationFrame(this.updateCanvas);
    }
    if (!this.isDirty) {
      return;
    }

    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    if (this.isDrag) {
      const rect = {
        x: this.startX,
        y: this.startY,
        w: this.curX - this.startX,
        h: this.curY - this.startY,
        x2: this.curX - this.startX + this.startX,
        y2: this.curY - this.startY - this.startY
      };
      this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h, rect.x2, rect.y2);
    }
    this.isDirty = false;
  };

  componentWillUnmount() {
    this.removeMouseEvents();
  }

  addMouseEvents() {
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("mouseup", this.onMouseUp, false);
  }
  removeMouseEvents() {
    document.removeEventListener("mousedown", this.onMouseDown, false);
    document.removeEventListener("mousemove", this.onMouseMove, false);
    document.removeEventListener("mouseup", this.onMouseUp, false);
  }

  onMouseDown = e => {
    this.isDrag = true;
    this.curX = this.startX = e.offsetX;
    this.curY = this.startY = e.offsetY;
    requestAnimationFrame(this.updateCanvas);
  };

  onMouseMove = e => {
    if (!this.isDrag) return;
    this.curX = e.offsetX;
    this.curY = e.offsetY;
    this.isDirty = true;
  };

  onMouseUp = e => {
    this.isDrag = false;
    this.isDirty = true;

    const rect = {
      x: Math.min(this.startX, this.curX),
      y: Math.min(this.startY, this.curY),
      w: Math.abs(e.offsetX - this.startX),
      h: Math.abs(e.offsetY - this.startY),
      x2: Math.min((this.startX, this.curX) + (e.offsetX - this.startX)),
      y2: Math.min((this.startY, this.curY) + (e.offsetY - this.startY))
    };
    this.props.onSelected(rect);
  };

  render() {
    console.log("render");
    return (
      <div>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={c => {
            this.canvas = c;
          }}
        />
      </div>
    );
  }
}
class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      x: -1,
      y: -1,
      w: -1,
      h: -1,
      x2: -1,
      y2: -1
    };
  }

  onSelected = rect => {
    this.setState({
      selected: true,
      ...rect
    });
  };

  getSelectionStr() {
    if (this.state.selected) {
      const state = this.state;
      return `x: ${state.x}, y: ${state.y}, w: ${state.w}, h: ${state.h}, x2: ${state.x2}, y2: ${state.y2},`;
    }
    return "No Selection";
  }

  render() {
    return (
      <div>
        <Rector width="100%" height="480" onSelected={this.onSelected} />
        <div>{this.getSelectionStr()}</div>
      </div>
    );
  }
}
ReactDOM.render(<Demo />, document.querySelector("#root"));
