import { FC } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

export interface Product {
  id: string | number;
  image: string;
  title: string;
  amount: string;
  description: string;
  specs?: Record<string, string>;
  tagline?: string;
  quantity?: number;
  status: "IN_STOCK" | "OUT_OF_STOCK" | string;
}

export interface ProductCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
  className?: string;
  strings?: {
    viewProduct?: string;
  };
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onViewProduct,
  className,
  strings = { viewProduct: "View product" },
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[24px] p-2.5 flex flex-col h-full border border-gray-100 shadow-sm",
        className,
      )}
    >
      {/* Product Image */}
      <div className="w-full h-[200px] bg-gray-50 rounded-[16px] overflow-hidden mb-4 relative group">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <StatusBadge 
            status={product.status as any} 
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col grow px-1 pb-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-foreground line-clamp-1">
            {product.title}
          </h3>
          <span className="text-base font-medium text-foreground whitespace-nowrap ml-2">
            {product.amount}
          </span>
        </div>

        <p className="text-sm text-secondary-text mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Actions - Single Full Width Button */}
        <div className="mt-auto">
          <Button
            variant="primary"
            onClick={() => onViewProduct?.(product)}
            className="w-full py-3 h-auto rounded-[8px] text-white bg-[#002816] hover:bg-[#002816]/90 border-none font-medium"
          >
            {strings.viewProduct}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
