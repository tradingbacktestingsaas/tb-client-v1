"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const forexPairs = [
  "EUR/USD",
  "USD/JPY",
  "GBP/USD",
  "AUD/USD",
  "USD/CAD",
  "USD/CHF",
  "NZD/USD",
];

const cryptos = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "XRP/USD",
  "ADA/USD",
  "DOGE/USD",
];

const depositCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "USDT"];

export default function PositionSizeCalculator() {
  const [instrument, setInstrument] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [stopLoss, setStopLoss] = useState(200);
  const [balance, setBalance] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [riskPercent, setRiskPercent] = useState(2);
  const [contractSize, setContractSize] = useState(100000);
  const [customCurrency, setCustomCurrency] = useState("");

  const { riskAmount, positionSize, lots } = useMemo(() => {
    const risk = (balance * riskPercent) / 100;
    const pipValue = contractSize * pipSize;
    const size = stopLoss > 0 ? risk / (stopLoss * pipValue) : 0;
    const lots = size / contractSize;
    return { riskAmount: risk, positionSize: size, lots };
  }, [balance, stopLoss, riskPercent, contractSize, pipSize]);

  const displayCurrency = customCurrency || depositCurrency;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Card className="shadow-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Position Size Calculator
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Top dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Instrument</label>
              <Select onValueChange={setInstrument} defaultValue={instrument}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs text-gray-400">Forex</div>
                  {forexPairs.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs text-gray-400">Crypto</div>
                  {cryptos.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1">Deposit Currency</label>
              <Select
                onValueChange={setDepositCurrency}
                defaultValue={depositCurrency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {depositCurrencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom currency */}
          <div>
            <label className="block text-sm mb-1">
              Custom Currency (optional)
            </label>
            <Input
              value={customCurrency}
              onChange={(e) => setCustomCurrency(e.target.value.toUpperCase())}
              placeholder="Enter custom currency (e.g. ZAR)"
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Main Inputs - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Stop Loss (pips)</label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Account Balance</label>
              <Input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">1 Pip Size</label>
              <Input
                type="number"
                step="0.00001"
                value={pipSize}
                onChange={(e) => setPipSize(Number(e.target.value))}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Risk %</label>
              <Input
                type="number"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">
                Contract Size (Units per Lot)
              </label>
              <Input
                type="number"
                value={contractSize}
                onChange={(e) => setContractSize(Number(e.target.value))}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
          </div>

          {/* Results */}
          <div className="text-center mt-6 border-t border-gray-700 pt-6">
            <p className="text-lg font-semibold">
              Lots (trade size): {lots.toFixed(2)}
            </p>
            <p className="text-lg font-semibold">
              Units (trade size): {positionSize.toFixed(0)}
            </p>
            <p className="text-xl mt-3">
              Money at risk:{" "}
              <span className="font-bold text-yellow-400">
                {displayCurrency} {riskAmount.toFixed(2)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
