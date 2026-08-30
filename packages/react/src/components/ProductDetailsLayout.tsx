import { FC, useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import { cn } from "../utils/cn";
import type { Product } from "./ProductCard";

export interface ProductDetailsLayoutProps {
  product: Product;
  onBack?: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  galleryImages?: string[];
  specifications?: string[];
  strings?: {
    backToList?: string;
    description?: string;
    quantity?: string;
    specifications?: string;
    editProduct?: string;
    deleteProduct?: string;
  };
}

export const ProductDetailsLayout: FC<ProductDetailsLayoutProps> = ({
  product,
  onBack,
  onEdit,
  onDelete,
  galleryImages = [product.image],
  specifications = [],
  strings = {
    backToList: "Back to products",
    description: "Description",
    quantity: "Quantity",
    specifications: "Product Specifications",
    editProduct: "Edit product",
    deleteProduct: "Delete",
  },
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with BackButton */}
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={18} />
          {strings.backToList}
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 overflow-y-auto custom-scrollbar">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={galleryImages[selectedImageIndex] || product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "aspect-square rounded-[8px] overflow-hidden border-2 transition-all p-0",
                      selectedImageIndex === idx
                        ? "border-primary"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Detail Info */}
          <div className="flex flex-col gap-6 text-foreground">
            <div className="flex flex-col gap-2">
              <div>
                <StatusBadge status={product.status as any} />
              </div>
              <h1 className="text-[32px] font-bold">{product.title}</h1>
              {product.tagline && (
                <p className="text-secondary-text text-base">{product.tagline}</p>
              )}
            </div>

            <div className="text-[40px] font-bold text-primary">
              {product.amount}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold">
                {strings.description}
              </h3>
              <p className="text-secondary-text text-base leading-relaxed">
                {product.description}
              </p>
              {product.quantity !== undefined && (
                <p className="text-base font-normal">
                  {strings.quantity}:{" "}
                  <span className="font-bold">{product.quantity}</span>
                </p>
              )}
            </div>

            {specifications.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">
                  {strings.specifications}
                </h3>
                <ul className="flex flex-col gap-3">
                  {specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                        strokeWidth={3}
                      />
                      <span className="text-secondary-text text-base">
                        {spec}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer Refinement */}
        <div className="p-8 mt-auto">
          <div className="bg-[#F1F3F9] rounded-[16px] p-8 flex justify-end">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                className="px-10 py-3 h-auto rounded-[8px] bg-white border-gray-300 text-foreground text-base shadow-sm hover:bg-gray-50 flex items-center gap-2"
                onClick={() => onDelete?.(product)}
              >
                {strings.deleteProduct}
              </Button>
              <Button
                variant="primary"
                className="px-10 py-3 h-auto rounded-[8px] bg-[#002816] hover:bg-[#002816]/90 border-none text-white text-base shadow-sm flex items-center gap-2"
                onClick={() => onEdit?.(product)}
              >
                {strings.editProduct}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsLayout;
