import {
  TbCar,
  TbDeviceLaptop,
  TbDiamond,
  TbFolder,
  TbHome,
  TbQuestionMark,
  TbShirt,
  TbBooks,
  TbDeviceGamepad,
} from "react-icons/tb";

export interface Categories {
  id: "all" | "home-garden" | "fashion" | "electronics" | "vehicles" | "books" | "jewerly" | "toys-games" | "other";
  icon: React.ElementType;
  name: "All Categories" | "Home & Garden" | "Fashion" | "Electronics" | "Vehicles" | "Books" | "Jewerly" | "Toys & Games" | "Other";
}

export const categories: Categories[] = [
  { id: "all", icon: TbFolder, name: "All Categories" },
  { id: "home-garden", icon: TbHome, name: "Home & Garden" },
  { id: "fashion", icon: TbShirt, name: "Fashion" },
  { id: "electronics", icon: TbDeviceLaptop, name: "Electronics" },
  { id: "vehicles", icon: TbCar, name: "Vehicles" },
  { id: "books", icon: TbBooks, name: "Books" },
  { id: "jewerly", icon: TbDiamond, name: "Jewerly" },
  { id: "toys-games", icon: TbDeviceGamepad, name: "Toys & Games" },
  { id: "other", icon: TbQuestionMark, name: "Other" },
];

export const findCategory = (id: string) => {
  return (
    categories.find(
      category =>
        category.id ===
        id.toLocaleLowerCase().replace('&', '-').replaceAll(' ', ''),
    ) || categories[0]
  )
}

export const cleanCategory = (category: string) => {
  return category
    .toLocaleLowerCase()
    .replace('&', '-')
    .replaceAll(' ', '')
    .replaceAll('!', '')
}
