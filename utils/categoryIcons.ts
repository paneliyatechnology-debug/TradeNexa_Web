import type { LucideIcon } from "lucide-react";
import {
  Sprout,
  Tractor,
  FlaskConical,
  Zap,
  Tv,
  Wrench,
  Shirt,
  HardHat,
  Armchair,
  Box,
  Layers,
  Sun,
  Droplets,
  Cpu,
  UtensilsCrossed,
  Car,
  HeartPulse,
  Shield,
  Factory,
  Package,
  Pill,
  Smartphone,
  Sparkles,
} from "lucide-react";

const SLUG_ICON_MAP: Record<string, LucideIcon> = {
  "agriculture-farming": Sprout,
  agriculture: Sprout,
  farming: Sprout,
  farm: Sprout,
  chemicals: FlaskConical,
  chemical: FlaskConical,
  "solar-products": Sun,
  solar: Sun,
  "water-treatment": Droplets,
  water: Droplets,
  electronics: Tv,
  electronic: Tv,
  machinery: Wrench,
  machines: Wrench,
  textiles: Shirt,
  textile: Shirt,
  construction: HardHat,
  furniture: Armchair,
  packaging: Box,
  food: UtensilsCrossed,
  automotive: Car,
  medical: HeartPulse,
  pharma: Pill,
  security: Shield,
  industrial: Factory,
};

export function getCategoryFallbackIcon(slug?: string, name?: string): LucideIcon {
  if (slug) {
    const cleanSlug = slug.toLowerCase().trim();
    if (SLUG_ICON_MAP[cleanSlug]) return SLUG_ICON_MAP[cleanSlug];
  }

  const key = `${slug || ""} ${name || ""}`.toLowerCase().trim();

  if (
    key.includes("farm") ||
    key.includes("agri") ||
    key.includes("crop") ||
    key.includes("seed") ||
    key.includes("plant") ||
    key.includes("dairy") ||
    key.includes("tractor")
  ) {
    return Sprout;
  }

  if (key.includes("chemical") || key.includes("lab") || key.includes("acid") || key.includes("fertilizer")) {
    return FlaskConical;
  }

  if (key.includes("solar") || key.includes("renewable") || key.includes("energy") || key.includes("power")) {
    return Sun;
  }

  if (key.includes("water") || key.includes("liquid") || key.includes("plumb") || key.includes("filter") || key.includes("pipe")) {
    return Droplets;
  }

  if (
    key.includes("electronic") ||
    key.includes("appliance") ||
    key.includes("gadget") ||
    key.includes("tv") ||
    key.includes("phone") ||
    key.includes("mobile")
  ) {
    return Tv;
  }

  if (
    key.includes("machin") ||
    key.includes("tool") ||
    key.includes("metal") ||
    key.includes("steel") ||
    key.includes("iron") ||
    key.includes("hardware") ||
    key.includes("equipment") ||
    key.includes("factory") ||
    key.includes("industrial")
  ) {
    return Wrench;
  }

  if (
    key.includes("textile") ||
    key.includes("cloth") ||
    key.includes("garment") ||
    key.includes("fashion") ||
    key.includes("fabric") ||
    key.includes("cotton") ||
    key.includes("yarn") ||
    key.includes("wear")
  ) {
    return Shirt;
  }

  if (
    key.includes("construct") ||
    key.includes("build") ||
    key.includes("cement") ||
    key.includes("brick") ||
    key.includes("paint") ||
    key.includes("tile")
  ) {
    return HardHat;
  }

  if (key.includes("furniture") || key.includes("interior") || key.includes("decor") || key.includes("wood")) {
    return Armchair;
  }

  if (key.includes("packag") || key.includes("box") || key.includes("carton") || key.includes("paper") || key.includes("plastic")) {
    return Box;
  }

  if (key.includes("computer") || key.includes("network") || key.includes("chip") || key.includes("it") || key.includes("software")) {
    return Cpu;
  }

  if (key.includes("food") || key.includes("beverage") || key.includes("grain") || key.includes("spice") || key.includes("snack") || key.includes("tea") || key.includes("coffee")) {
    return UtensilsCrossed;
  }

  if (key.includes("auto") || key.includes("car") || key.includes("vehicle") || key.includes("motor") || key.includes("bike")) {
    return Car;
  }

  if (key.includes("medic") || key.includes("health") || key.includes("hospital") || key.includes("doctor") || key.includes("care")) {
    return HeartPulse;
  }

  if (key.includes("pharma") || key.includes("drug") || key.includes("pill") || key.includes("tablet")) {
    return Pill;
  }

  if (key.includes("secur") || key.includes("cctv") || key.includes("safety") || key.includes("guard")) {
    return Shield;
  }

  return Layers;
}
