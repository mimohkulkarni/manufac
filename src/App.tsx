import React, { useEffect, useState } from "react";
import { MantineProvider, Table, TableData } from "@mantine/core";
import { getDatasetData } from "./lib/apis";
import { parseData } from "./utils/calculate";
import "./App.css";
// core styles are required for all packages
import "@mantine/core/styles.css";

function App() {
  const [data, setData]: [
    data: { yearwiseData: []; cropwiseData: [] },
    setData: Function
  ] = useState({ yearwiseData: [], cropwiseData: [] });

  useEffect(() => {
    getDatasetData()
      .then((response) => response.json())
      .then((json) => setData(parseData(json)))
      .catch((error) => console.error(error));
  }, []);

  const yearwiseData: TableData = {
    caption: "Yearwise aggregated crop data",
    head: [
      "Year",
      "Crop with Maximum Production in that Year",
      "Crop with Minimum Production in that Year",
    ],
    body: data.yearwiseData?.map(
      ({
        year,
        maxProductionCrop,
        minProductionCrop,
      }: {
        year: string;
        maxProductionCrop: string;
        minProductionCrop: string;
      }) => [year, maxProductionCrop, minProductionCrop]
    ),
  };

  const cropwiseData: TableData = {
    caption: "Cropwise aggregated year data",
    head: [
      "Crop",
      "Average Yield of the Crop between 1950-2020",
      "Average Cultivation Area of the Crop between 1950-2020",
    ],
    body: data.cropwiseData?.map(
      ({
        cropName,
        averageYieldFrom1950To2020,
        averageCultivationAreaFrom1950To2020,
      }: {
        cropName: string;
        averageYieldFrom1950To2020: string;
        averageCultivationAreaFrom1950To2020: string;
      }) => [
        cropName,
        averageYieldFrom1950To2020,
        averageCultivationAreaFrom1950To2020,
      ]
    ),
  };

  return (
    <MantineProvider>
      <div className="App">
        <div className="table-div">
          <Table
            captionSide="top"
            stickyHeader
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            data={yearwiseData}
          />
        </div>
        <div className="table-div">
          <Table
            captionSide="top"
            stickyHeader
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            data={cropwiseData}
          />
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
