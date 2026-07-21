import { AgriProduct } from '../types/api';

export const aggregateProductsByDate = (products: AgriProduct[]): AgriProduct[] => {
  const groups = new Map<string, AgriProduct[]>();

  products.forEach((product) => {
    const dailyProducts = groups.get(product.TransDate) ?? [];
    dailyProducts.push(product);
    groups.set(product.TransDate, dailyProducts);
  });

  return Array.from(groups.values()).map((dailyProducts) => {
    const totalQuantity = dailyProducts.reduce(
      (sum, product) => sum + product.Trans_Quantity,
      0,
    );
    const fallbackAverage =
      dailyProducts.reduce((sum, product) => sum + product.Avg_Price, 0) /
      dailyProducts.length;
    const weightedAverage =
      totalQuantity > 0
        ? dailyProducts.reduce(
            (sum, product) => sum + product.Avg_Price * product.Trans_Quantity,
            0,
          ) / totalQuantity
        : fallbackAverage;

    return {
      ...dailyProducts[0],
      Avg_Price: weightedAverage,
      Upper_Price: Math.max(...dailyProducts.map((product) => product.Upper_Price)),
      Lower_Price: Math.min(...dailyProducts.map((product) => product.Lower_Price)),
      Trans_Quantity: totalQuantity,
    };
  });
};
