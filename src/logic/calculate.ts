// JSXは出てこないのでtsファイル

// 「どの状態の時にどのボタンを押すと次はどの状態になるのか」という状態遷移を扱う関数
export function calculate(button: string, state: State)State{
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