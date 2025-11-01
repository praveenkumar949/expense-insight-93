import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

const InsuranceCalculator = () => {
  const [age, setAge] = useState("30");
  const [annualIncome, setAnnualIncome] = useState("1000000");
  const [liabilities, setLiabilities] = useState("500000");
  const [dependents, setDependents] = useState("2");
  const [yearsOfSupport, setYearsOfSupport] = useState("20");
  const [insuranceType, setInsuranceType] = useState("term");
  const [result, setResult] = useState<{
    recommendedCover: number;
    monthlyPremium: number;
    annualPremium: number;
    totalPremiumPaid: number;
  } | null>(null);

  const calculateInsurance = () => {
    const income = parseFloat(annualIncome);
    const debt = parseFloat(liabilities);
    const years = parseInt(yearsOfSupport);
    const numDependents = parseInt(dependents);
    const currentAge = parseInt(age);

    // Human Life Value Method
    const futureExpenses = income * years * 0.7; // 70% of income for expenses
    const dependentFactor = 1 + (numDependents * 0.2); // 20% more per dependent
    
    let recommendedCover = (futureExpenses * dependentFactor) + debt;
    
    // Round to nearest lakh
    recommendedCover = Math.round(recommendedCover / 100000) * 100000;

    // Premium calculation (approximate rates per lakh)
    let premiumPerLakh = 0;
    if (insuranceType === "term") {
      // Term insurance rates (per lakh per year)
      if (currentAge <= 30) premiumPerLakh = 500;
      else if (currentAge <= 40) premiumPerLakh = 800;
      else if (currentAge <= 50) premiumPerLakh = 1500;
      else premiumPerLakh = 2500;
    } else {
      // Endowment/ULIP rates (higher)
      if (currentAge <= 30) premiumPerLakh = 3000;
      else if (currentAge <= 40) premiumPerLakh = 4000;
      else if (currentAge <= 50) premiumPerLakh = 5500;
      else premiumPerLakh = 7000;
    }

    const coverInLakhs = recommendedCover / 100000;
    const annualPremium = Math.round(coverInLakhs * premiumPerLakh);
    const monthlyPremium = Math.round(annualPremium / 12);
    const totalPremiumPaid = annualPremium * years;

    setResult({
      recommendedCover,
      monthlyPremium,
      annualPremium,
      totalPremiumPaid,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Insurance Calculator
        </CardTitle>
        <CardDescription>
          Calculate your life insurance coverage needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income (₹)</Label>
              <Input
                id="annualIncome"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="1000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liabilities">Total Liabilities/Loans (₹)</Label>
              <Input
                id="liabilities"
                type="number"
                value={liabilities}
                onChange={(e) => setLiabilities(e.target.value)}
                placeholder="500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfSupport">Years of Support Required</Label>
              <Input
                id="yearsOfSupport"
                type="number"
                value={yearsOfSupport}
                onChange={(e) => setYearsOfSupport(e.target.value)}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceType">Insurance Type</Label>
              <Select value={insuranceType} onValueChange={setInsuranceType}>
                <SelectTrigger id="insuranceType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Term Insurance (Pure Protection)</SelectItem>
                  <SelectItem value="endowment">Endowment/ULIP (Investment + Insurance)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateInsurance} className="w-full">
              Calculate Coverage
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <>
                <div className="rounded-lg border bg-primary/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Recommended Coverage
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(result.recommendedCover)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on Human Life Value Method
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Estimated Monthly Premium
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.monthlyPremium)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Annual Premium
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.annualPremium)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Premium Paid (Over {yearsOfSupport} Years)
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.totalPremiumPaid)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium mb-2">Insurance Planning Tips:</p>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Term insurance provides maximum coverage at lowest cost</li>
                    <li>Coverage should be 10-15x your annual income</li>
                    <li>Buy early to get lower premiums</li>
                    <li>Review coverage every 3-5 years</li>
                    <li>Consider inflation while calculating needs</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                <div>
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Enter your details and click Calculate Coverage to see your recommended insurance amount
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-amber-500/10 p-4 text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-100">Note:</p>
          <p className="mt-1 text-amber-800 dark:text-amber-200">
            These calculations are approximate and for informational purposes only. 
            Actual premiums may vary based on health conditions, lifestyle, and insurer. 
            Please consult with a certified insurance advisor for personalized recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCalculator;
