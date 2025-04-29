import { z } from "zod";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/types/user";
import { ListingFormType } from "@/app/post/page";

interface PriceLocationFormProps {
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
  user: User | null;
}

const PriceLocationForm = ({
  formData,
  handleChange,
  setFormData,
  formErrors,
  user,
}: PriceLocationFormProps) => {
  return (
    <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Price & Location
        </h2>
      </div>
      <div className="px-4 py-5 sm:p-6 space-y-6">
        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price (€) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                €
              </span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and up to 2 decimal places
                if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
                  setFormData((prev) => ({
                    ...prev,
                    price: value,
                  }));
                }
              }}
              className={`pl-6 block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
                        ${
                          formErrors.find((error) => error.path[0] === "price")
                            ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                            : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                        }
                        dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              placeholder="0.00"
            />
          </div>
          {formErrors.find((error) => error.path[0] === "price") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "price")
                  ?.message
              }
            </p>
          )}
        </div>

        {/* Negotiable checkbox */}
        <div className="flex items-center mt-2 bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
          <Checkbox
            id="negotiable"
            name="negotiable"
            checked={formData.negotiable}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                negotiable: checked === true,
              }));
            }}
            className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 border-gray-300 rounded transition-all duration-200 flex items-center justify-center"
          />
          <label
            htmlFor="negotiable"
            className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
          >
            Price is negotiable
          </label>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              id="location"
              value={user?.location}
              disabled
              onChange={handleChange}
              placeholder="e.g., Berlin, Germany"
              className={`pl-8 block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
                  ${
                    formErrors.find((error) => error.path[0] === "location")
                      ? "border-2 border-red-300 focus:ring-1 focus:ring-green-400"
                      : "border border-gray-300 dark:border-gray-600 hover:border-green-300"
                  }
                  dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            />
          </div>
          {formErrors.find((error) => error.path[0] === "location") && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {
                formErrors.find((error) => error.path[0] === "location")
                  ?.message
              }
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your exact address will not be shared publicly
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceLocationForm;