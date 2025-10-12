import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SimpleCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setNewNumber(false);
    }
  };

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["C", "0", ".", "+"],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Calculator</CardTitle>
        <CardDescription>Basic arithmetic calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-xs space-y-4">
          <div className="rounded-lg border-2 border-border bg-muted p-4 text-right text-3xl font-bold">
            {display}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((row, i) =>
              row.map((btn) => (
                <Button
                  key={btn}
                  variant={["+", "-", "×", "÷"].includes(btn) ? "default" : btn === "C" ? "destructive" : "outline"}
                  className="h-14 text-xl font-semibold"
                  onClick={() => {
                    if (btn === "C") handleClear();
                    else if (btn === ".") handleDecimal();
                    else if (["+", "-", "×", "÷"].includes(btn)) handleOperation(btn);
                    else handleNumber(btn);
                  }}
                >
                  {btn}
                </Button>
              ))
            )}
            <Button
              variant="default"
              className="col-span-4 h-14 text-xl font-semibold"
              onClick={handleEquals}
            >
              =
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleCalculator;
