let fabric = require('./fabric.js').fabric;

const MAX_SIZE = 6000;
fabric.textureSize = MAX_SIZE;
fabric.Object.NUM_FRACTION_DIGITS = 8;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderColor = '#00b6ff';
fabric.Object.prototype.selectionBorderColor = '#00b6ff';
fabric.Object.prototype.cornerColor = '#00b6ff';
fabric.Object.prototype.cornerStrokeColor = 'white';
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.lockScalingFlip = true;
fabric.Object.prototype.borderDashArray = [];
fabric.Object.prototype.selectionDashArray = [];
fabric.Object.prototype.hasRotatingPoint = true;
// fabric.Object.prototype.objectCaching = false;
// fabric.Object.prototype.statefullCache = false;
// fabric.Object.prototype.noScaleCache = true;

var lockImg;
const lock = `
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lock" class="svg-inline--fa fa-lock fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="rgb(89, 89, 89)" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>
  `;
if (process.browser) {
  lockImg = document.createElement('img');
  lockImg.src = `data:image/svg+xml;base64,${window.btoa(lock)}`;
}

function renderCornerControl(ctx, left, top, styleOverride, fabricObject) {
  styleOverride = styleOverride || {};
  var size = styleOverride.cornerSize || fabricObject.cornerSize,
    transparentCorners =
      typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : this.transparentCorners,
    methodName = transparentCorners ? 'stroke' : 'fill',
    stroke =
      !transparentCorners &&
      (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);

  if (fabricObject.locked) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(left, top, (size + 10) / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle =
      styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = styleOverride.cornerColor || fabricObject.cornerColor;
      ctx.stroke();
    }
    ctx.drawImage(lockImg, left - size / 2, top - size / 2, size, size);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.lineWidth = 1;
  ctx.shadowBlur = 3;
  ctx.shadowColor = '#333333';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
  ctx[methodName]();

  if (stroke) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle =
      styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

function renderMiddleControl(ctx, left, top, styleOverride, fabricObject) {
  styleOverride = styleOverride || {};
  var size = (styleOverride.cornerSize || fabricObject.cornerSize) - 3,
    transparentCorners =
      typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : this.transparentCorners,
    methodName = transparentCorners ? 'stroke' : 'fill',
    stroke =
      !transparentCorners &&
      (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
  ctx.fillStyle =
    styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
  ctx[methodName]();

  if (stroke) {
    ctx.strokeStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.stroke();
  }
  ctx.restore();
}

var rotateImg;
const rotate = `
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync-alt" class="svg-inline--fa fa-sync-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path></svg>
  `;
if (process.browser) {
  rotateImg = document.createElement('img');
  rotateImg.src = `data:image/svg+xml;base64,${window.btoa(rotate)}`;
}

function renderRotateControl(ctx, left, top, styleOverride, fabricObject) {
  styleOverride = styleOverride || {};
  var size = styleOverride.cornerSize || fabricObject.cornerSize,
    transparentCorners =
      typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : this.transparentCorners,
    methodName = transparentCorners ? 'stroke' : 'fill',
    stroke =
      !transparentCorners &&
      (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);

  ctx.save();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(left, top, (size + 10) / 2, 0, 2 * Math.PI, false);
  ctx.fillStyle =
    styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
  ctx.fill();

  if (stroke) {
    ctx.strokeStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.stroke();
  }
  ctx.drawImage(rotateImg, left - size / 2, top - size / 2, size, size);
  ctx.restore();
}

fabric.Object.prototype.controls.tl.render = renderCornerControl;
fabric.Object.prototype.controls.tr.render = renderCornerControl;
fabric.Object.prototype.controls.bl.render = renderCornerControl;
fabric.Object.prototype.controls.br.render = renderCornerControl;
fabric.Object.prototype.controls.mtr.render = renderRotateControl;

fabric.Object.prototype.controls.ml.render = renderMiddleControl;
fabric.Object.prototype.controls.mr.render = renderMiddleControl;
fabric.Object.prototype.controls.mb.render = renderMiddleControl;
fabric.Object.prototype.controls.mt.render = renderMiddleControl;

exports.fabric = fabric;
