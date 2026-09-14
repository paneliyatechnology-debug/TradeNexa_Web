import type { User } from "@/types/auth";
import type { ApiProductDetail, ApiProductListItem } from "@/types/catalog";
import { formatListedAgo } from "@/utils/catalogHelpers";

export function isUserProductOwner(
  product: ApiProductDetail | ApiProductListItem | null | undefined,
  user: User | null | undefined
): boolean {
  if (!product || !user) return false;

  const rawUserNumeric = user.user_id != null ? Number(user.user_id) : Number(user.id);
  const userNumericId = Number.isFinite(rawUserNumeric) ? rawUserNumeric : null;
  const userStrId = String(user.id || user.user_id || "").trim();

  const p = product as any;
  const sellerObj = p.seller;

  if (sellerObj) {
    const sellerUserId = sellerObj.user_id != null ? Number(sellerObj.user_id) : null;
    const sellerId = sellerObj.id != null ? Number(sellerObj.id) : null;

    if (userNumericId != null) {
      if (sellerUserId != null && sellerUserId === userNumericId) return true;
      if (sellerId != null && sellerId === userNumericId) return true;
    }
    if (userStrId) {
      if (sellerObj.user_id != null && String(sellerObj.user_id) === userStrId) return true;
      if (sellerObj.id != null && String(sellerObj.id) === userStrId) return true;
    }
  }

  if (p.seller_id != null) {
    if (userNumericId != null && Number(p.seller_id) === userNumericId) return true;
    if (userStrId && String(p.seller_id) === userStrId) return true;
  }

  if (p.user_id != null) {
    if (userNumericId != null && Number(p.user_id) === userNumericId) return true;
    if (userStrId && String(p.user_id) === userStrId) return true;
  }

  return false;
}

export interface ProductSpecRow {
  label: string;
  value: string;
}

type SellerLocation = ApiProductDetail["seller"]["location"] | null | undefined;

export function formatSellerLocation(location: SellerLocation): string {
  if (!location) return "";
  const cityState = [location.city?.trim(), location.state?.trim()].filter(Boolean);
  if (cityState.length > 0) return cityState.join(", ");
  const country = location.country?.trim();
  if (country) return country;
  const address = location.address?.trim();
  return address || "";
}

export function getProductDescription(product: ApiProductDetail): string {
  const { basic_details: basic } = product;
  return (basic.description || basic.short_description || "").trim();
}

export function getSellerContactPhone(product: ApiProductDetail): string | null {
  const contact = product.seller?.contact;
  if (!contact) return null;
  return contact.whatsapp || contact.phone || null;
}

export function getSellerRole(product: ApiProductDetail): string | null {
  return product.seller?.company?.business_type?.trim() || null;
}

export function buildProductSpecs(
  product: ApiProductDetail,
  t?: (key: string, fallback?: string) => string
): {
  keySpecs: ProductSpecRow[];
  fullSpecs: ProductSpecRow[];
} {
  const tr = (key: string, fallback: string) => (t ? t(key, fallback) : fallback);
  const { basic_details: basic, pricing, seller, inventory } = product;
  const material = basic.material ?? product.material;
  const productCondition =
    basic.product_condition ?? product.product_condition;
  const stockStatus = inventory?.stock_status ?? product.stock_status;
  const stockQuantity = inventory?.stock_quantity ?? product.stock_quantity;
  const companyName = seller?.company?.name;
  const locationAddress = seller?.location?.address;
  const contactEmail = seller?.contact?.email;
  const contactPhone = seller?.contact?.phone;

  const keySpecs: ProductSpecRow[] = [
    basic.brand && { label: tr("specs.brand", "Brand"), value: basic.brand.name },
    basic.subcategory && { label: tr("specs.subcategory", "Subcategory"), value: basic.subcategory.name },
    basic.category && { label: tr("specs.category", "Category"), value: basic.category.name },
    material && { label: tr("specs.material", "Material"), value: material },
    productCondition && { label: tr("specs.condition", "Condition"), value: productCondition },
    basic.country_of_origin && { label: tr("specs.origin", "Origin"), value: basic.country_of_origin },
    pricing.hsn_code && { label: tr("specs.hsnCode", "HSN Code"), value: pricing.hsn_code },
    pricing.price_type && { label: tr("specs.priceType", "Price Type"), value: pricing.price_type },
    pricing.gst_percentage != null && {
      label: tr("specs.gst", "GST"),
      value: `${pricing.gst_percentage}%${pricing.gst_included ? " (incl.)" : ""}`,
    },
  ].filter(Boolean) as ProductSpecRow[];

  const fullSpecs: ProductSpecRow[] = [
    ...keySpecs,
    { label: tr("specs.minOrder", "Min. Order"), value: `${pricing.minimum_order_quantity} ${pricing.unit}` },
    { label: tr("specs.unit", "Unit"), value: pricing.unit },
    stockStatus && { label: tr("specs.stockStatus", "Stock Status"), value: stockStatus },
    stockQuantity != null && {
      label: tr("specs.stockQuantity", "Stock Quantity"),
      value: String(stockQuantity),
    },
    product.warranty && { label: tr("specs.warranty", "Warranty"), value: product.warranty },
    { label: tr("specs.listed", "Listed"), value: formatListedAgo(product.created_at) },
    { label: tr("specs.lastUpdated", "Last Updated"), value: formatListedAgo(product.updated_at) },
    companyName && { label: tr("specs.supplier", "Supplier"), value: companyName },
    locationAddress && { label: tr("specs.supplierAddress", "Supplier Address"), value: locationAddress },
    contactEmail && { label: tr("specs.supplierEmail", "Supplier Email"), value: contactEmail },
    contactPhone && { label: tr("specs.supplierPhone", "Supplier Phone"), value: contactPhone },
  ].filter(Boolean) as ProductSpecRow[];

  return { keySpecs, fullSpecs };
}

export function getExperienceLabel(product: ApiProductDetail): string {
  const company = product.seller?.company;
  if (!company) return "New";
  if (company.experience_years > 0) return `${company.experience_years} Yrs`;
  if (company.year_established) {
    return `${new Date().getFullYear() - company.year_established}+ Yrs`;
  }
  return "New";
}

export function listedDaysLabel(isoDate: string): string {
  return formatListedAgo(isoDate).replace(/^Listed\s+/i, "");
}
