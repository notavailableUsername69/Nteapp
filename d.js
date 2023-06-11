// Get the canvas element and its context
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

// Set initial values
let currentColor = '#000000';
let canvasSize = 'medium';
let undoStack = [];
let redoStack = [];

// Set canvas size based on selected option
function setCanvasSize(size) {
  if (size === 'small') {
    canvas.width = 400;
    canvas.height = 300;
  } else if (size === 'medium') {
    canvas.width = 800;
    canvas.height = 600;
  } else if (size === 'large') {
    canvas.width = 1200;
    canvas.height = 900;
  }
}

// Draw a line on the canvas
function drawLine(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.lineTo(x, y);
  context.stroke();
}

// Handle mouse down event
function handleMouseDown(event) {
  context.beginPath();
  context.strokeStyle = currentColor;
  context.lineWidth = 5;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  drawLine(event);

  canvas.addEventListener('mousemove', drawLine);
  document.addEventListener('mouseup', handleMouseUp);
}

// Handle mouse up event
function handleMouseUp() {
  canvas.removeEventListener('mousemove', drawLine);
  document.removeEventListener('mouseup', handleMouseUp);

  undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
}

// Undo the last drawing action
function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    context.putImageData(undoStack[undoStack.length - 1], 0, 0);
  }
}

// Redo the last undone drawing action
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    context.putImageData(undoStack[undoStack.length - 1], 0, 0);
  }
}

// Event listeners
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
document.getElementById('colorPicker').addEventListener('change', (event) => {
  currentColor = event.target.value;
});
document.getElementById('canvasSize').addEventListener('change', (event) => {
  canvasSize = event.target.value
  // Update canvas size when the selected option changes
  setCanvasSize(canvasSize);

  // Clear the canvas
  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    undoStack = [context.getImageData(0, 0, canvas.width, canvas.height)];
    redoStack = [];
  }

  // Event listener for the clear button
  document.getElementById('clearBtn').addEventListener('click', clearCanvas);

  // Event listener for the canvas size dropdown
  document.getElementById('canvasSize').addEventListener('change', (event) => {
    canvasSize = event.target.value;
    setCanvasSize(canvasSize);
    clearCanvas();
  });
})();
