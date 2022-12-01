// JSXは出てこないのでtsファイル

export type Operator = "+" | "-";
export type NumberCode =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
export type ButtonCode = NumberCode | Operator | "." | "D" | "AC" | "=";

// 「どの状態の時にどのボタンを押すと次はどの状態になるのか」という状態遷移を扱う関数
export function calculate(button: ButtonCode, state: State): State {
  //数値かどうか
  if (isNumberButton(button)) {
    return handleNumberButton(button, state);
  }
  //オペレーターかどうか
  if (isOperatorButton(button)) {
    return handleOperatorButton(button, state);
  }
  //.かどうか
  if (isDotButton(button)) {
    //ボタンの種類はいらないからstate
    return handleDotButton(state);
  }
  //削除ボタンかどうか
  if (isDeleteButton(button)) {
    return handleDeleteButton(state);
  }
  //ACかどうか
  if (isAllClearButton(button)) {
    return handleAllClearButton();
  }
  //=かどうか
  if (isEqualButton(button)) {
    return handleEqualButton(state);
  }
  return state;
}

//これを状態として定義し関数の戻り値の型もStateにする
export interface State {
  //今表示している内容をcurrentとする
  current: string;

  //計算に使用する数値も覚える必要がある
  operand: number;

  //どの計算をしようとしているのかの状態をoperator　、未設定の場合もあるのでnullの許可
  operator: string | null;

  //次にクリアすべきかのフラグ
  isNextClear: boolean;
}

//button is NumberCodeの表記は型ガードの構文でtrueを返すと引数のbuttonはNumberCodeということがわかる
function isNumberButton(button: string): button is NumberCode {
  return (
    button === "0" ||
    button === "1" ||
    button === "2" ||
    button === "3" ||
    button === "4" ||
    button === "5" ||
    button === "6" ||
    button === "7" ||
    button === "8" ||
    button === "9"
  );
}

function handleNumberButton(button: NumberCode, state: State): State {
  if (state.isNextClear) {
    //+を押した時にisNextClearがtrueになっているので中身を消して押された数字のボタンにしてあげる
    return {
      current: button,
      operand: state.operand,
      operator: state.operator,
      //１度クリアした後再度クリアする必要はない
      isNextClear: false,
    };
  }
  if (state.current === "0") {
    return {
      current: button,
      operand: state.operand,
      operator: state.operator,
      isNextClear: false,
    };
  }
  //表示が0以外の時は、後ろに数値を付け足す(01や02にならないように）
  return {
    current: state.current + button,
    operand: state.operand,
    operator: state.operator,
    isNextClear: false,
  };
}

function isOperatorButton(button: string): button is Operator {
  //+か-を調べる
  return button === "+" || button === "-";
  //実際の処理はhandleOperatorButton()関数に任せる?
}

function handleOperatorButton(button: Operator, state: State): State {
  //オペレーターが押された状態かを調べる
  if (state.operator === null) {
    return {
      current: state.current,
      //今の値をオペランドに
      operand: parseFloat(state.current),
      //どのボタンが押されたかを入れる
      operator: button,
      //+や-の後には数字を消してほしいのdisNextClearにはtrueを
      isNextClear: true,
    };
  }
  //+やーが押された状態でもう一回それらが押された場合計算する必要がある
  //計算する部分はoperateに任せる
  const nextValue = operate(state);
  return {
    //表示内容は計算結果（nextVaule）を入れる
    current: `${nextValue}`,
    //+が押された後は、左側の数値も入れておく必要があるのでoperand部分にもnextValueを入れておく
    operand: nextValue,
    operator: button,
    isNextClear: true,
  };
}

//ドットかどうかを調べる
function isDotButton(button: string) {
  return button === ".";
}

function handleDotButton(state: State): State {
  //ドットが連打されるのはおかしい→ドットがあるかどうか
  //indexOfを使用して結果が-1以外、つまりどこかにドットがある場合状態を変化させる必要がないstateをそのまま返す
  if (state.current.indexOf(".") !== -1) {
    return state;
  }
  return {
    //ドットを加えるべきパターンでは、現在表示中の値にドットを加える
    current: state.current + ".",
    operand: state.operand,
    operator: state.operator,
    //次に消去する必要もないためisNextClearはfalseに
    isNextClear: false,
  };
}

//ボタンがDかどうか
function isDeleteButton(button: string) {
  return button === "D";
}

//1文字削除するボタン
//既に１文字しかない場合は0に戻す必要がある
function handleDeleteButton(state: State): State {
  if (state.current.length === 1) {
    return {
      current: "0",
      //他の状態は変化しない
      operand: state.operand,
      operator: state.operator,
      isNextClear: false,
    };
  }
  return {
    //１文字削除する処理
    //substring()で１文字減らす
    //length-1で最後の１文字を削除
    current: state.current.substring(0, state.current.length - 1),
    //他の状態は変化しない
    operand: state.operand,
    operator: state.operator,
    isNextClear: false,
  };
}

function isAllClearButton(button: string) {
  return button === "AC";
}

//全ての状態を元に戻すため状態の確認はいらない
//引数のstate入らないので削除
function handleAllClearButton(): State {
  return {
    current: "0",
    operand: 0,
    //+や-の状態もいらない
    operator: null,
    isNextClear: false,
  };
}

function isEqualButton(button: string) {
  return button === "=";
}

function handleEqualButton(state: State): State {
  //+ーが押されてない時は=押しても何もしない
  //+-が押されたかどうか
  if (state.operator === null) {
    return state;
  }
  //押されている場合は計算する必要
  const nextValue = operate(state);
  return {
    current: `${nextValue}`,
    operand: 0,
    operator: null,
    //表示された後、数字を押した時は表示内容が消える
    isNextClear: true,
  };
}

//計算部分
function operate(state: State): number {
  //表示されている値を数値に変換
  const current = parseFloat(state.current);
  //+か-をみて計算
  if (state.operator === "+") {
    return state.operand + current;
  }
  if (state.operator === "-") {
    return state.operand - current;
  }
  return current;
}
