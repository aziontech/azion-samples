const productJson = require("./products.json");
const fs = require("fs");

const newProductJson = productJson.map((product) => {
  if (product.category == undefined) {
    return { ...product, category: "stationery", subcategory: "planners" };
  }
  return product;
});

fs.writeFileSync("./products.json", JSON.stringify(newProductJson));
