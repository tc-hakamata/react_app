import { useState } from "react";
import { ButtonCode, calculate, State } from "../logic/calculate";
import ButtonPanel from "./ButtonPanel";
import Display from "./Display";
//親となるCalculator.tsxにscssファイルをインポート
import "./Calculator.scss";

export default function Calculator(){
    //Hookを使って持たせる
    //初期状態を指定する必要
    const [state, setState] = useState<State>({
        current: "0",
        operand: 0,
        operator: null,
        isNextClear: false
    })
    
    const buttonHandler = (code: ButtonCode) => {
        // console.log(code)
        const nextState = calculate(code, state)
        //次の状態が決まったらその値をセットする必要
        setState(nextState);
    }
    return <div>
        <Display value={state.current}/>
        <ButtonPanel buttonHandler={buttonHandler}/>
    </div>
}

//状態管理、状態変化部分↑