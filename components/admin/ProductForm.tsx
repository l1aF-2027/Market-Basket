"use client";

import type React from "react";
import { useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/types/admin";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: any) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: product?.id || 0,
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    category: product?.category || "",
    image: product?.image || "",
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        file,
        image: imageUrl,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 ">
          {/* Bố cục linh hoạt dựa trên kích thước màn hình */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Product Name - chiếm full trên mobile, 60% khi >= md */}
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Price - chiếm full trên mobile, 20% khi >= md */}
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            {/* Category - chiếm full trên mobile, 20% khi >= md */}
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full"
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Image Upload + Preview */}
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Label>Image</Label>
              {/* Input URL + Upload Icon */}
              <div className="relative flex-1 flex items-center w-full">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Your Image URL"
                  className="w-full"
                />
                <label
                  htmlFor="file-upload"
                  className="right-2 cursor-pointer"
                >
                  <input
                    title="Upload Image"
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Preview Image */}
              <div className="h-[80px] w-[80px] rounded-md border overflow-hidden flex items-center justify-center bg-gray-100">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Description - luôn chiếm toàn bộ chiều rộng */}
          <div className="space-y-2 pb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="resize-none w-full"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer "
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="cursor-pointer ">
            {product ? "Update Product" : "Create Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
