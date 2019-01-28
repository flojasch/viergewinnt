
class Matrix {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];
    for (let i = 0; i < rows; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        this.matrix[i][j] = 0;
      }
    }
  }

copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.matrix[i][j] = this.matrix[i][j];
      }
    }
    return m;
  }

static transpose(a){
    let result=new Matrix(a.cols,a.rows);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.matrix[j][i]=a.matrix[i][j]
      }
    }
    return result;
}
  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random()*2-1;
      }
    }
  }

  static fromArray(arr){
      let m = new Matrix(arr.length,1);
      for(let i = 0;i < arr.length;i++ ){
          m.matrix[i][0]=arr[i];
      }
      return m;
  }

  static subtract(a,b){
      let result = new Matrix(a.rows, a.cols);
        for (let i = 0; i < result.rows; i++) {
          for (let j = 0; j < result.cols; j++) {
            result.matrix[i][j]=a.matrix[i][j]-b.matrix[i][j];
          }
        }
        return result;
  }

  toArray(){
      let arr=[];
      for(let i=0;i < this.rows;i++){
          for (let j = 0; j < this.cols; j++) {
              arr.push(this.matrix[i][j]);
          }
      }
      return arr;
  }

  static multiply(a,b){
     if (a.cols !== b.rows) {
        console.log("Matrizes does not match");
        return undefined;
      } else {
        let result = new Matrix(a.rows, b.cols);
        for (let i = 0; i < result.rows; i++) {
          for (let j = 0; j < result.cols; j++) {
            let sum=0;
            for (let k = 0; k < a.cols;k++) {
              sum += a.matrix[i][k] * b.matrix[k][j];
            }
            result.matrix[i][j]=sum;
          }
        }
        return result;
      }

  }

  multiply(n) {
      if(n instanceof Matrix){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n.matrix[i][j];
            }
        }
      } else{
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
      }
  }

  map(func) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let val = this.matrix[i][j];
          this.matrix[i][j] = func(val);
        }
    }
  }

  static map(a,func) {
      let result = new Matrix(a.rows,a.cols);
      for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.cols; j++) {
          result.matrix[i][j] = func(a.matrix[i][j]);
        }
    }
    return result;
  }

  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] += n.matrix[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] += n;
        }
      }
    }
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let res = new Matrix(data.rows, data.cols);
    res.matrix = data.matrix;
    return res;
  }

print(){
    console.table(this.matrix);
}

}
