//React　テストを書くにはtesting-library/reactをインポートする必要

import '@testing-library/react';
import { ButtonCode, calculate, State } from './calculate';

//初期状態を作る関数
function makeInitState(): State {
    return{
        current: "0",
        operand: 0,
        operator: null,
        isNextClear: false,
    }
}

//ButtonCodeを配列で受け取り　calculate()をを繰り返し呼び出しながら状態変化させる関数
//foreachで回してcalculate()で状態を更新し最終的な状態をreturn
function execCalc(buttons: ButtonCode[], state: State): State{
    buttons.forEach((button) => {
        state = calculate(button, state)
    })
    return state 
}

/*
test("sample", () => {
    //AとBが一緒 エラー
    // expect("A").toBe("B");
    //BとBが一緒 
    expect("B").toBe("B");
})
*/

test("add", () => {
    //1+2=を押したらどうなるか　初期状態を渡す
    const finalState = execCalc(["1", "+", "2", "="], makeInitState())
    //実際には3なのでfailとなる
    expect(finalState.current).toBe("4");
    expect(finalState.operand).toBe(0);
    expect(finalState.operator).toBe(null);
    expect(finalState.current).toBe(true);
});