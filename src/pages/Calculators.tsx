import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleCalculator from "@/components/calculators/SimpleCalculator";
import EMICalculator from "@/components/calculators/EMICalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import StepUpSIPCalculator from "@/components/calculators/StepUpSIPCalculator";
import LumpsumCalculator from "@/components/calculators/LumpsumCalculator";

const Calculators = () => {
  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Financial Calculators</h1>
        <p className="text-muted-foreground">Tools to help you plan your finances</p>
      </div>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="emi">EMI</TabsTrigger>
          <TabsTrigger value="sip">SIP</TabsTrigger>
          <TabsTrigger value="stepup">Step-Up SIP</TabsTrigger>
          <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Calculators;
