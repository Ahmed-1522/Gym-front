import { plans } from "./mockData";

export const getPlans = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(plans);
    }, 1000);
  });
};