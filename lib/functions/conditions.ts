import { FaBoxOpen, FaStar } from "react-icons/fa";
import { MdBuild, MdCheckCircleOutline, MdThumbUp } from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";

export interface Condition {
    name: "New" | "Like New" | "Very Good" | "Good" | "Acceptable" | "For Parts/Not Working"
    icon: React.ElementType;
};

export const conditions: Condition[] = [
    { name: "New", icon: FaBoxOpen },
    { name: "Like New", icon: MdCheckCircleOutline },
    { name: "Very Good", icon: FaStar },
    { name: "Good", icon: MdThumbUp },
    { name: "Acceptable", icon: RiCheckboxBlankCircleLine },
    { name: "For Parts/Not Working", icon: MdBuild },
  ];

export const findCondition = (name: Condition["name"]) => {
    return (
        conditions.find(
        condition =>
            condition.name ===
            name.toLocaleLowerCase().replace('&', '-').replaceAll(' ', '')
        ) || conditions[0]
    )
}