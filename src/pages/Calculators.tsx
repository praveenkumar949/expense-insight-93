import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, TrendingDown, Wallet, CreditCard, Percent, DollarSign, LineChart, ArrowDownUp } from "lucide-react";
import SimpleCalculator from "@/components/calculators/SimpleCalculator";
import EMICalculator from "@/components/calculators/EMICalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import StepUpSIPCalculator from "@/components/calculators/StepUpSIPCalculator";
import LumpsumCalculator from "@/components/calculators/LumpsumCalculator";
import InflationCalculator from "@/components/calculators/InflationCalculator";
import SimpleInterestCalculator from "@/components/calculators/SimpleInterestCalculator";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";
import SWPCalculator from "@/components/calculators/SWPCalculator";

const calculators = [
  { value: "simple", label: "Simple Calculator", icon: Calculator },
  { value: "emi", label: "EMI Calculator", icon: CreditCard },
  { value: "sip", label: "SIP Calculator", icon: TrendingUp },
  { value: "stepup", label: "Step-Up SIP", icon: TrendingDown },
  { value: "lumpsum", label: "Lumpsum Calculator", icon: Wallet },
  { value: "swp", label: "SWP Calculator", icon: ArrowDownUp },
  { value: "simple-interest", label: "Simple Interest", icon: Percent },
  { value: "compound-interest", label: "Compound Interest", icon: DollarSign },
  { value: "inflation", label: "Inflation Calculator", icon: LineChart },
];

const Calculators = () => {
  const [selectedCalculator, setSelectedCalculator] = useState("simple");

  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Financial Calculators</h1>
        <p className="text-muted-foreground">Tools to help you plan your finances</p>
      </div>

      {/* Mobile: Dropdown Selector */}
      <div className="mb-6 block lg:hidden">
        <Select value={selectedCalculator} onValueChange={setSelectedCalculator}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select calculator" />
          </SelectTrigger>
          <SelectContent>
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <SelectItem key={calc.value} value={calc.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {calc.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Tabs */}
      <Tabs value={selectedCalculator} onValueChange={setSelectedCalculator} className="w-full">
        <TabsList className="mb-6 hidden h-auto flex-wrap gap-2 lg:flex">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <TabsTrigger
                key={calc.value}
                value={calc.value}
                className="flex items-center gap-2 transition-all hover:scale-105"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden xl:inline">{calc.label}</span>
                <span className="xl:hidden">{calc.label.split(" ")[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="simple">
          <SimpleCalculator />
        </TabsContent>

        <TabsContent value="emi">
          <EMICalculator />
        </TabsContent>

        <TabsContent value="sip">
          <SIPCalculator />
        </TabsContent>

        <TabsContent value="stepup">
          <StepUpSIPCalculator />
        </TabsContent>

        <TabsContent value="lumpsum">
          <LumpsumCalculator />
        </TabsContent>

        <TabsContent value="swp">
          <SWPCalculator />
        </TabsContent>

        <TabsContent value="simple-interest">
          <SimpleInterestCalculator />
        </TabsContent>

        <TabsContent value="compound-interest">
          <CompoundInterestCalculator />
        </TabsContent>

        <TabsContent value="inflation">
          <InflationCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;
