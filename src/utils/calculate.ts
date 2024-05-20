export const parseData = (data: []) => {
  if (!data?.length) return [];
  return {
    yearwiseData: calculateYearwiseData(data),
    cropwiseData: calculateCropwiseData(data),
  };
};

export const calculateYearwiseData = (data: []) => {
  const yearData: any = [];
  // check if data is not empty
  if (!data?.length) return [];
  data.forEach((d: any) => {
    // check if year is not empty
    const year: string = d?.Year?.substring(d?.Year?.length - 4) || "";
    if (year) {
      // find year in yearData object if exists update else add
      const yearObj: any = yearData.find((y: any) => y.year === year) || {};
      if (yearObj.year) {
        const cropProduction: number =
          Number(d["Crop Production (UOM:t(Tonnes))"]) || 0;
        //     update yearObj if current crop production is greater than previous
        if (yearObj.maxProduction < cropProduction) {
          yearObj.maxProduction = cropProduction;
          yearObj.maxProductionCrop = d["Crop Name"];
        }
        //     update yearObj if current crop production is less than previous
        if (yearObj.minProduction > cropProduction) {
          yearObj.minProduction = cropProduction;
          yearObj.minProductionCrop = d["Crop Name"];
        }
      } else {
        //   set default values
        yearObj.maxProduction = Number(d["Crop Production (UOM:t(Tonnes))"]);
        yearObj.maxProductionCrop = d["Crop Name"];
        yearObj.minProduction = Number(d["Crop Production (UOM:t(Tonnes))"]);
        yearObj.minProductionCrop = d["Crop Name"];
        yearObj.year = year;
        //   push yearObj to yearData
        yearData.push(yearObj);
      }
    }
  });

  return yearData;
};

export const calculateCropwiseData = (data: []) => {
  const cropData: any = [];
  // check if data is not empty
  if (!data?.length) return [];
  data.forEach((d: any) => {
    // check if year is not empty
    const year: string = d.Year.substring(d.Year.length - 4) || "";
    const cropName: string = d["Crop Name"] || "";
    // find year in cropData object if exists update else add
    // check if year is between 1950 and 2020
    if (year && Number(year) >= 1950 && Number(year) <= 2020 && cropName) {
      // find year in cropDate object if exists update else add
      const cropObj: any =
        cropData.find((y: any) => y.cropName === cropName) || {};
      if (cropObj.cropName) {
        //   update cropObj values
        cropObj.totalYieldFrom1950To2020 += Number(
          d["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
        );
        cropObj.totalCultivationAreaFrom1950To2020 += Number(
          d["Area Under Cultivation (UOM:Ha(Hectares))"]
        );
        cropObj.totalYearsFrom1950To2020 += 1;
      } else {
        //   set default values
        cropObj.totalYieldFrom1950To2020 = Number(
          d["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
        );
        cropObj.totalCultivationAreaFrom1950To2020 = Number(
          d["Area Under Cultivation (UOM:Ha(Hectares))"]
        );
        cropObj.totalYearsFrom1950To2020 = 1;
        cropObj.cropName = cropName;
        //   push cropObj to cropData
        cropData.push(cropObj);
      }
    }
  });

  // calculate average yield and average cultivation area
  return cropData.map((c: any) => ({
    cropName: c.cropName,
    averageYieldFrom1950To2020:
      (c.totalYieldFrom1950To2020 / c.totalYearsFrom1950To2020).toFixed(3) || 0,
    averageCultivationAreaFrom1950To2020:
      (
        c.totalCultivationAreaFrom1950To2020 / c.totalYearsFrom1950To2020
      ).toFixed(3) || 0,
  }));
};
