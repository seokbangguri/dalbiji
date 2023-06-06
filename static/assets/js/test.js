class Signature {
  constructor() {
    this.color = "#000000";
    this.sign = false;
    this.begin_sign = false;
    this.width_line = 1;
    this.canvas = document.getElementById('canvas');
    this.offsetLeft = this.canvas.offsetLeft;
    this.offsetTop = this.canvas.offsetTop;
    this.context = canvas.getContext('2d');
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.whenMouseDown();
    this.whenMouseUp();
    this.whenMouseMove();
    this.createSignature();
    this.clearCanvas();
    this.resetCanvas();
  }

  updateMousePosition(mX, mY) {
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
    this.cursorX = (mX - rect.left) * scaleX;
    this.cursorY = (mY - rect.top) * scaleY;
  }
  
  whenMouseDown() {
    document.addEventListener("mousedown", ({
      pageX,
      pageY
    }) => {
      this.sign = true;
      this.updateMousePosition(pageX, pageY);
    })
  }

  whenMouseUp() {
    document.addEventListener("mouseup", () => {
      this.sign = false;
      this.begin_sign = false;
    })
  }

  whenMouseMove() {
    this.canvas.addEventListener('mousemove', ({
      pageX,
      pageY
    }) => {
      if (this.sign) {
        this.updateMousePosition(pageX, pageY);
        this.createSignature();
      }
    })
  }

  createSignature() {
    if (!this.begin_sign) {
      this.context.beginPath();
      this.context.moveTo(this.cursorX, this.cursorY);
      this.begin_sign = true;
    } else {
      this.context.lineTo(this.cursorX, this.cursorY);
      this.context.strokeStyle = this.color;
      this.context.lineWidth = this.width_line;
      this.context.stroke();
    }
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resetCanvas() {
    document.getElementById("reset").addEventListener("click", () => {
      this.clearCanvas();
    })
  }
}

document.addEventListener("DOMContentLoaded", event => {
  new Signature();
});
