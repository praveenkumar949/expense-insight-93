export type CalculatorType = "simple" | "emi" | "loan" | "sip" | "stepup-sip" | "lumpsum";

export interface EMIResult {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
}

export interface SIPResult {
  maturityAmount: number;
  investedAmount: number;
  returns: number;
}

export interface LumpsumResult {
  maturityAmount: number;
  investedAmount: number;
  returns: number;
}

export interface StepUpSIPResult {
  maturityAmount: number;
  totalInvested: number;
  returns: number;
}
