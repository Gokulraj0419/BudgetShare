import "../global.css";
import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import {
  APP_INFO,
  calculateBudgetSummary,
  formatCurrency,
  getAppGreeting,
  type ExpenseItem,
} from "@budgetshare/shared";

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const sampleExpenses: ExpenseItem[] = [
    { id: "1", category: "Housing", amount: 1200 },
    { id: "2", category: "Groceries", amount: 450 },
    { id: "3", category: "Utilities", amount: 180 },
    { id: "4", category: "Entertainment", amount: 150 },
  ];

  const greeting = getAppGreeting("React Native Mobile");
  const summary = calculateBudgetSummary(sampleExpenses, selectedCurrency);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#0f172a" }}>
      <View style={{ width: "100%", maxWidth: 400, backgroundColor: "#1e293b", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#334155" }}>
        
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 4 }}>
          {APP_INFO.name} Mobile
        </Text>
        <Text style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginBottom: 16 }}>
          {greeting}
        </Text>

        {/* Currency Switcher */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
          {APP_INFO.supportedCurrencies.map((curr) => (
            <TouchableOpacity
              key={curr}
              onPress={() => setSelectedCurrency(curr)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginHorizontal: 4,
                borderRadius: 8,
                backgroundColor: selectedCurrency === curr ? "#0284c7" : "#334155",
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 12 }}>
                {curr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shared Package Badge */}
        <View style={{ backgroundColor: "rgba(56, 189, 248, 0.1)", borderRadius: 8, padding: 10, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#38bdf8" }}>
          <Text style={{ color: "#38bdf8", fontSize: 12, fontWeight: "bold" }}>
            📦 Shared Package: @budgetshare/shared
          </Text>
          <Text style={{ color: "#cbd5e1", fontSize: 11, marginTop: 2 }}>
            Tagline: {APP_INFO.tagline}
          </Text>
        </View>

        {/* Total Summary */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Total Budget Expenses</Text>
          <Text style={{ color: "#4ade80", fontSize: 28, fontWeight: "bold" }}>
            {formatCurrency(summary.total, selectedCurrency)}
          </Text>
          <Text style={{ color: "#cbd5e1", fontSize: 13, marginTop: 4 }}>
            Top Expense Category: <Text style={{ color: "#f59e0b", fontWeight: "bold" }}>{summary.topCategory}</Text>
          </Text>
        </View>

        {/* Category List */}
        <Text style={{ color: "#f8fafc", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
          Category Breakdown
        </Text>
        {summary.categories.map((item) => (
          <View
            key={item.category}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#334155",
            }}
          >
            <Text style={{ color: "#e2e8f0", fontSize: 13 }}>
              {item.category} ({item.percentage}%)
            </Text>
            <Text style={{ color: "#38bdf8", fontSize: 13, fontWeight: "600" }}>
              {item.formattedAmount}
            </Text>
          </View>
        ))}

      </View>
    </ScrollView>
  );
}