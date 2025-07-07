import { useState } from "react";
import "./Calculator.css";

const isOperator = (val: string) => ["+", "-", "x", "÷", "%"].includes(val);

const Calculator = () => {
  const [expression, setExpression] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [isResult, setIsResult] = useState(false);

  const firstButton =
    isResult || (current === "" && expression.length === 0) ? "AC" : "←";

  const buttons = [
    [firstButton, "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const calculate = (tokens: string[]): string => {
    const stack = [...tokens];

    for (let i = 0; i < stack.length; i++) {
      if (stack[i] === "%") {
        const num = parseFloat(stack[i - 1]);
        const prevOperator = stack[i - 2];
        let base = 1;

        if (["+", "-"].includes(prevOperator)) {
          base = parseFloat(stack[i - 3]);
        } else if (["x", "÷"].includes(prevOperator)) {
          base = 1;
        }

        const percentValue = ((base * num) / 100).toString();
        stack.splice(i - 1, 2, percentValue);
        i -= 1;
      }
    }

    for (let i = 0; i < stack.length; i++) {
      const op = stack[i];
      if (op === "x" || op === "÷") {
        const a = parseFloat(stack[i - 1]);
        const b = parseFloat(stack[i + 1]);
        const res = op === "x" ? a * b : b === 0 ? NaN : a / b;
        stack.splice(i - 1, 3, res.toString());
        i -= 1;
      }
    }

    for (let i = 0; i < stack.length; i++) {
      const op = stack[i];
      if (op === "+" || op === "-") {
        const a = parseFloat(stack[i - 1]);
        const b = parseFloat(stack[i + 1]);
        const res = op === "+" ? a + b : a - b;
        stack.splice(i - 1, 3, res.toString());
        i -= 1;
      }
    }

    return stack[0] ?? "Error";
  };

  const handleClick = (val: string) => {
    if (val === "AC" || val === "←") {
      if (isResult || val === "AC") {
        setExpression([]);
        setCurrent("");
        setIsResult(false);
      } else {
        if (current) {
          setCurrent(current.slice(0, -1));
        } else if (expression.length) {
          const last = expression[expression.length - 1];
          if (!isOperator(last)) {
            setCurrent(last.slice(0, -1));
            setExpression(expression.slice(0, -1));
          } else {
            setExpression(expression.slice(0, -1));
          }
        }
      }
      return;
    }

    if (val === "=") {
      const fullExpr = [...expression, current].filter(Boolean);
      if (fullExpr.length < 3) return;
      const res = calculate(fullExpr);
      setCurrent(res);
      setExpression([]);
      setIsResult(true);
      return;
    }

    if (isOperator(val)) {
      if (!current && expression.length === 0) return;

      const exp = [...expression];
      const last = exp[exp.length - 1];

      if (!current && isOperator(last)) {
        exp[exp.length - 1] = val;
        setExpression(exp);
        return;
      }

      const valueToPush = current;
      setExpression([...exp, valueToPush, val]);
      setCurrent("");
      setIsResult(false);
      return;
    }

    if (val === ".") {
      if (current.includes(".")) return;
      setCurrent(current + ".");
      return;
    }

    if (val === "+/-") {
      if (current) {
        if (current.startsWith("-")) {
          setCurrent(current.slice(1));
        } else {
          setCurrent("-" + current);
        }
      } else if (expression.length && !isOperator(expression.at(-1)!)) {
        const newExpr = [...expression];
        const last = newExpr.at(-1)!;
        if (last.startsWith("-")) {
          newExpr[newExpr.length - 1] = last.slice(1);
        } else {
          newExpr[newExpr.length - 1] = "-" + last;
        }
        setExpression(newExpr);
      }
      return;
    }

    if (val === "%") {
      if (!current) return;
      setExpression([...expression, current, "%"]);
      setCurrent("");
      setIsResult(false);
      return;
    }

    if (isResult) {
      setCurrent(val);
      setExpression([]);
      setIsResult(false);
    } else {
      setCurrent(current + val);
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">
          {expression.length === 0 && current === ""
            ? "0"
            : [...expression, current]
                .map((item) =>
                  item.startsWith("-") && !isOperator(item) ? `(${item})` : item
                )
                .join(" ")}
        </div>
      </div>
      <div className="buttons">
        {buttons.flat().map((btn, i) => {
          if (!btn) return <div key={i} className="btn empty" />;

          const isRightColumn = (i + 1) % 4 === 0 || btn === "=";
          const isZero = btn === "0";

          return (
            <button
              key={i}
              className={`btn ${isZero ? "zero" : ""} ${
                isRightColumn ? "operator" : ""
              }`}
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;
