"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";

const FilterHeader = ({ chartsLoading, selectedDate, handleFilterChart }) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="flex gap-4">
      {/* Day Picker */}
      <input
        type="date"
        disabled={chartsLoading}
        value={selectedDate || today}
        onChange={(e) => handleFilterChart({ date: e.target.value || "" })}
        className="border p-1 rounded"
        aria-label="date-selector"
      />

      {/* Current Month */}
      <Button
        size="sm"
        disabled={chartsLoading}
        onClick={() => handleFilterChart({ range: "current" })}
      >
        <FormattedMessage
          id="table.operations.filter_header.current_month"
          defaultMessage="Current Month"
        />
      </Button>

      {/* Last 3 Months */}
      <Button
        size="sm"
        disabled={chartsLoading}
        onClick={() => handleFilterChart({ range: "3m" })}
      >
        <FormattedMessage
          id="table.operations.filter_header.last_3_months"
          defaultMessage="Last 3 Months"
        />
      </Button>

      {/* Last 6 Months */}
      <Button
        size="sm"
        disabled={chartsLoading}
        onClick={() => handleFilterChart({ range: "6m" })}
      >
        <FormattedMessage
          id="table.operations.filter_header.last_6_months"
          defaultMessage="Last 6 Months"
        />
      </Button>

      {/* Clear */}
      <Button
        size="sm"
        variant="outline"
        disabled={chartsLoading}
        onClick={() => handleFilterChart({})}
      >
        <FormattedMessage
          id="table.operations.filter_header.clear"
          defaultMessage="Clear"
        />
      </Button>
    </div>
  );
};

export default FilterHeader;
