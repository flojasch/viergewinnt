class Spielfeld {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    for (let i = 0; i < rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  makeArray() {
    let arr = [];
    let label = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; ++j) {
        if (this.data[i][j] == -1) {
          arr[label] = 1;
          arr[label + 1] = 0;
          arr[label + 2] = 0;
        } else if (this.data[i][j] === 0) {
          arr[label] = 0;
          arr[label + 1] = 1;
          arr[label + 2] = 0;
        } else if (this.data[i][j] == 1) {
          arr[label] = 0;
          arr[label + 1] = 0;
          arr[label + 2] = 1;
        }
        arr[label] = this.data[i][j];
        label += 3;
      }
    }
    return arr;
  }
  copy() {
    let feld = new Spielfeld(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        feld.data[i][j] = this.data[i][j];
      }
    }
    return feld;
  }

  invert(player) {
    if (player) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] = -this.data[i][j];
        }
      }
    }
  }

  calcValue() {
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; j++) {
        if (this.data[i][j] !== 0) {
          let index = 0;
          let sum = 0;
          while (i + index < this.rows && index < 4) {
            sum += this.data[i + index][j];
            index++;
            if (abs(sum) == 4) {
              return sum / 4;
            }
          }
          index = 0;
          sum = 0;
          while (j + index < this.cols && index < 4) {
            sum += this.data[i][j + index];
            index++;
            if (abs(sum) == 4) {
              return sum / 4;
            }
          }
          index = 0;
          sum = 0;
          while (i + index < this.rows && j + index < this.cols && index < 4) {
            sum += this.data[i + index][j + index];
            index++;
            if (abs(sum) == 4) {
              return sum / 4;
            }
          }
          index = 0;
          sum = 0;
          while (i - index >= 0 && j + index < this.cols && index < 4) {
            sum += this.data[i - index][j + index];
            index++;
            if (abs(sum) == 4) {
              return sum / 4;
            }
          }
        }
      }
    }
    return 0;
  }
  nextFields(isPlayer) {
    let nextFields = [];
    for (let j = 0; j < this.cols; j++) {
      let field = this.copy();
      let i = 0;
      while (i < this.rows && this.data[i][j] !== 0) {
        i++;
      }
      if (i < this.rows) {
        if (isPlayer) {
          field.data[i][j] = 1;
        } else {
          field.data[i][j] = -1;
        }
        nextFields.push(field);
      }
    }
    return nextFields;
  }
  play() {
    let player = (Math.random() > 0.5);
    let winner = 0;
    let spielzuege = 0;
    while (spielzuege < 42 && winner === 0) {
      let col = floor(random(0, this.cols));
      this.turn(col, player);
      winner = this.calcValue();
      player = !player;
      spielzuege++;
    }
  }
  getTarget() {
    let target;
    let winner = this.calcValue();
    if (winner == -1) {
      target = [1, 0];
    } else if (winner === 0) {
      target = [0.5, 0.5];
    } else if (winner == 1) {
      target = [0, 1];
    }
    return target;
  }

  turn(index, player) {
    let element = 1;
    if (player) {
      element = -1;
    }
    let i = 0;
    while (i < this.rows && this.data[i][index] !== 0) {
      i++;
    }
    if (i < this.rows) {
      this.data[i][index] = element;
    } else {
      let nextindex = (index + 1) % this.cols;
      this.turn(nextindex, player);
    }
  }

  draw() {
    fill(0, 0, 200);
    rect(0, 200, width, height);
    for (let i = 0; i < this.cols; ++i) {
      for (let j = 0; j < this.rows; ++j) {
        if (this.data[j][i] == 1) {
          fill(200, 0, 0);
        }
        if (this.data[j][i] == -1) {
          fill(250, 250, 0);
        }
        if (this.data[j][i] === 0) {
          fill(255);
        }
        ellipse(50 + i * 100, 750 - j * 100, 90, 90);
      }
    }
  }
}
