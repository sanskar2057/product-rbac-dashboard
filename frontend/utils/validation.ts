import type { ProductStatus } from "@/types";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  status: ProductStatus;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function validateProduct(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  } else if (values.name.trim().length > 120) {
    errors.name = "Keep the name under 120 characters.";
  }

  if (!values.category.trim()) {
    errors.category = "Please choose a category.";
  }

  const price = Number(values.price);
  if (values.price.trim() === "") {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price)) {
    errors.price = "Price must be a number.";
  } else if (price < 0) {
    errors.price = "Price can't be negative.";
  }

  const stock = Number(values.stock);
  if (values.stock.trim() === "") {
    errors.stock = "Stock quantity is required.";
  } else if (!Number.isInteger(stock)) {
    errors.stock = "Stock must be a whole number.";
  } else if (stock < 0) {
    errors.stock = "Stock can't be negative.";
  }

  if (values.description.length > 2000) {
    errors.description = "Description is too long.";
  }

  return errors;
}
