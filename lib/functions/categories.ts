import { TbCar, TbDeviceLaptop, TbDiamond, TbFolder, TbGoGame, TbHome, TbQuestionMark, TbShirt, TbBooks } from "react-icons/tb";

export const categories: { id: string; icon: React.ElementType; name: string }[] = [
    { id: "all", icon: TbFolder, name: "All Categories" },
    { id: "home-garden", icon: TbHome, name: "Home & Garden" },
    { id: "fashion", icon: TbShirt, name: "Fashion" },
    { id: "electronics", icon: TbDeviceLaptop, name: "Electronics" },
    { id: "vehicles", icon: TbCar, name: "Vehicles" },
    { id: "books", icon: TbBooks, name: "Books" },
    { id: "jewerly", icon: TbDiamond, name: "Jewerly" },
    { id: "toys-games", icon: TbGoGame, name: "Toys & Games" },
    { id: "other", icon: TbQuestionMark, name: "Other" },
  ];

export const findCategory = (id: string) => {
    return categories.find((category) => category.id === id);
  };