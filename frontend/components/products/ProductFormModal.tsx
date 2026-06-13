"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { SelectInput, TextArea, TextInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "@/lib/constants";
import type { Product, ProductInput } from "@/types";
import {
  validateProduct,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/utils/validation";

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: ProductInput) => void;
}

const EMPTY: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: PRODUCT_CATEGORIES[0],
  status: "active",
};

const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

function toFormValues(product: Product | null): ProductFormValues {
  if (!product) return EMPTY;
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
    status: product.status,
  };
}

export function ProductFormModal({
  open,
  product,
  submitting,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  // Reset the form whenever the modal opens (for create or a specific product).
  useEffect(() => {
    if (open) {
      setValues(toFormValues(product));
      setErrors({});
    }
  }, [open, product]);

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateProduct(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      category: values.category,
      status: values.status,
    });
  }

  const isEdit = Boolean(product);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit product" : "Add product"}
      description={
        isEdit
          ? "Update the details for this product."
          : "Fill in the details to add a new product."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          id="name"
          label="Product name"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
        />

        <TextArea
          id="description"
          label="Description"
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          error={errors.description}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            id="price"
            label="Price (USD)"
            type="number"
            min={0}
            step="0.01"
            required
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            error={errors.price}
          />
          <TextInput
            id="stock"
            label="Stock quantity"
            type="number"
            min={0}
            step="1"
            required
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
            error={errors.stock}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectInput
            id="category"
            label="Category"
            required
            options={CATEGORY_OPTIONS}
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            error={errors.category}
          />
          <SelectInput
            id="status"
            label="Status"
            options={PRODUCT_STATUSES}
            value={values.status}
            onChange={(e) => update("status", e.target.value as ProductFormValues["status"])}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
