export default function Display(props: {
    value: string;
}){
    //電卓の数字表示する部分
    return <div className="display">{props.value}</div>
}