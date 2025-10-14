import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SimpleCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  // Sound effect for button press
  const playTapSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKnn77RgGwU7k9n0yXkpBSh+zPLaizsKGGS65+ihUBELTKXh8bllHAU2jdTxy3UmBSt9y/HciTsLF2S75+mjUBEKTKXi8bllHAU1jdTxy3YmBSx+y/HcizsKGGW65+mjTxELTKPi8rpkGwU4jdTwyXUnBSx9yvLdiTsLGGS65+ijUREKTKTh8bllHAU2jdTwy3YmBSt9y/HdiTwKGGS65+mjUREKTKTi8bllHAU2jtTwy3YmBSt9y/HdiTwKGGS65+mjUREKTKTi8rhlHAU3jdTwy3UmBSx9y/HdiTsLGGS65+mjUBELTKTi8bllHAU1jdXxy3YmBSt9y/HdiTwKGGO75+mjUREKTKPi8bllHAU2jdTxy3UnBSx9yvHdiTwKGGS65+mjUBELTKTi8rhlHAU3jdTxy3YmBSx9y/HciTwLGGS65+mjUBELTKPh8rllHQU2jdTxy3UnBSx+y/HdiTwKGGS65+mjTxELTKPi8rllHQU1jdTxy3YnBSt+y/HdiTwKGGO75+mjUBEKTKPh8rllHQU2jdTxy3UnBSx+y/HdiTwKGGO75+ijUBELTKPh8rllHAU2jdTxy3UnBSt+y/HdiTwKGGO75+ijUBELTKTh8rllHAU2jdTwy3UnBSt+y/HdiTwKGGO75+mjUBELTKPh8rllHAU2jdTxy3UnBSx9y/HdiTwKGGO75+mjUBELTKTh8rllHAU2jdTxy3UnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHQU2jdTxy3YnBSx9y/HdiTwKGGS65+mjTxELTKPh8rllHQU2jdTxy3YnBSx9y/HdiTwKGGS65+mjTxELTKPh8rllHQU2jdTxy3YnBSt9y/HdiTwKGGS65+mjUBEKTKPi8rllHQU1jdTxy3YnBSx9y/HdiTwKGGS65+mjUBELTKPi8rllHQU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKPi8rllHQU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHQU2jdTxy3UnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHQU2jdTxy3YnBSt+y/HdiTwKGGO75+mjUBELTKPh8rllHQU2jdTxy3UnBSt+y/HdiTwKGGO75+mjUBELTKPh8rllHQU2jdTxy3YnBSt+y/HdiTwKGGO75+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSx9y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSx9y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKTh8rllHAU2jdTxy3YnBSt+y/HdiTwKGGS65+mjUBELTKPh8rllHAU2jdTxy3YnBSx9y/Hd");
    audio.play().catch(() => {}); // Ignore errors if audio fails
  };

  const handleNumber = (num: string) => {
    playTapSound();
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    playTapSound();
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
          <div className="rounded-lg border-2 border-border bg-muted p-4 text-right">
            <div className="mb-1 text-sm text-muted-foreground">
              {previousValue !== null && operation && `${previousValue} ${operation}`}
            </div>
            <div className="overflow-x-auto text-3xl font-bold break-all">
              {display}
            </div>
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
