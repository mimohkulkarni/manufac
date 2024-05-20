export const getDatasetData = async () => {
  return fetch(`/assets/dataset.json`);
};
