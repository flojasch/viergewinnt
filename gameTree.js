function heuristic(feld){
    let ret;
    let input = feld.makeArray();
    let output = nn.predict(input);
    ret = output[1]-output[0];
    return ret;
}

class GameTree {
  constructor(feld) {
    this.children = [];
    this.feld = feld;
    this.value = feld.calcValue();
  }

  addChild(childNode) {
    this.children.push(childNode);
  }

  isTerminal() {
    if (this.children.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  maxPlayer(alpha, beta) {
    if (this.isTerminal()) {
      return heuristic(this.feld);
    }
    for (let child of this.children) {
      alpha = max(alpha, child.minPlayer(alpha, beta));
      if (alpha >= beta) {
        break;
      }
    }
    return alpha;
  }
  minPlayer(alpha, beta) {
    if (this.isTerminal()) {
      return heuristic(this.feld);
    }
    for (let child of this.children) {
      beta = min(beta, child.maxPlayer(alpha, beta));
      if (alpha >= beta) {
        break;
      }
    }
    return beta;
  }
  growTree(gen) {
    for (let i = 0; i < gen; i++) {
      this.grow(true);
    }
  }
  grow(player) {
    if (this.value !== 0) {
      return;
    }
    if (this.isTerminal()) {
      let nextFields = this.feld.nextFields(player);
      for (let newField of nextFields) {
        let newNode = new GameTree(newField);
        this.addChild(newNode);
      }
    } else {
      for (let child of this.children) {
        child.grow(!player);
      }
    }
  }

  makeTurn(zugtiefe) {
    this.growTree(zugtiefe);
    let res;
    let opt=-1;
    let val;

    for (let child of this.children) {
      val = child.minPlayer(-1, 1);
      if (val > opt) {
        opt = val;
        res = child.feld.copy();
      }
    }
    let input = this.feld.makeArray();
    let out = nn.predict(input);
    let heu = out[1]-out[0];
    console.log('h '+ heu ,'o '+ opt);
    if(abs(heu-opt) > 0.01){
      let target = [(1-opt)*0.5,(1+opt)*0.5];
      for(let i=0;i < 10;i++){
        nn.train(input,target);
       // let targetval=target[1]-target[0];
        //console.log('h '+ heuristic(this.feld) ,'o '+ targetval);
      }

    }
    return res;
  }

}
