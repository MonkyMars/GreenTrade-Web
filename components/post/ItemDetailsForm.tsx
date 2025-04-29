import { z } from "zod";
import { MdCategory } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Categories, categories } from "@/lib/functions/categories";
import { Condition, conditions } from "@/lib/functions/conditions";
import { ListingFormType } from "@/app/post/page";

interface ItemDetailsFormProps {
  formData: ListingFormType;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<ListingFormType>
  >;
  formErrors: z.ZodIssue[];
}

const ItemDetailsForm = ({
  formData,
  handleChange,
  setFormData,
  formErrors,
}: ItemDetailsFormProps) => {
  return (
    <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Item Details
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tell us about what you&apos;re listing
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Handmade Wooden Coffee Table"
            className={`block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
                    ${
                      formErrors.find((error) => error.path[0] === "title")
                        ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                        : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                    }
                    focus:ring-0 focus:border-transparent focus:outline-none
                    dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {formErrors.find((error) => error.path[0] === "title") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "title")
                  ?.message
              }
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            maxLength={1000}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your item, including details about its condition, history, and sustainability aspects"
            className={`block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
            ${
              formErrors.find((error) => error.path[0] === "description")
                ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
            }
            dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {formErrors.find((error) => error.path[0] === "description") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "description")
                  ?.message
              }
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* Category */}
        <div className="z-50">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 pb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Select
              onValueChange={(value) => {
                // Only use categories that are valid for our ListingFormType
                if (value !== "All Categories") {
                  setFormData((prev) => ({
                    ...prev,
                    category: value as Exclude<Categories["name"], "All Categories">
                  }));
                }
              }}
              value={formData.category}
            >
              <SelectTrigger
                className={`w-full px-4 py-6 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
                ${
                  formErrors.find((error) => error.path[0] === "category")
                    ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : "border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-300"
                }
                dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              >
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <MdCategory className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-400">Select Category</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent className="mt-1 w-full bg-slate-100 dark:bg-gray-700 rounded-md shadow-lg border-green-500">
                {categories.slice(1).map((category) => (
                  <SelectItem
                    value={category.name}
                    key={category.id}
                  >
                    <div className="flex items-center">
                      <category.icon className="h-5 w-5 mr-2" />
                      <span className="text-[1em]">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formErrors.find((error) => error.path[0] === "category") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "category")
                  ?.message
              }
            </p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 pb-1"
          >
            Condition <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => {
              if (value !== "") {
                setFormData((prev) => ({
                  ...prev,
                  condition: value as Condition["name"]
                }));
              }
            }}
            value={formData.condition}
          >
            <SelectTrigger
              className={`w-full px-4 py-6 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out
            ${
              formErrors.find((error) => error.path[0] === "condition")
                ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                : "border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-300"
            }
            dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            >
              <SelectValue
                placeholder={
                  <div className="flex items-center gap-2">
                    <FaClipboardCheck className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-400">Select Condition</span>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent className="mt-1 w-full bg-slate-100 dark:bg-gray-700 rounded-md shadow-lg border-green-500">
              {conditions.map((condition) => (
                <SelectItem value={condition.name} key={condition.name}>
                  <div className="flex items-center">
                    <condition.icon className="h-5 w-5 mr-2" />
                    <span className="text-[1em]">{condition.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.find((error) => error.path[0] === "condition") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "condition")
                  ?.message
              }
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ItemDetailsForm;