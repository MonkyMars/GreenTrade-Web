import { FaLeaf } from "react-icons/fa";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateEcoScore } from "@/lib/functions/calculateEcoScore";
import { ListingFormType } from "@/app/post/page";
import { EcoAttributes, ecoAttributes } from "@/lib/functions/ecoAttributes";

interface EcoAttributesFormProps {
  formData: ListingFormType;
  setFormData: React.Dispatch<
    React.SetStateAction<ListingFormType>
  >;
  ecoScore: number;
  setEcoScore: React.Dispatch<React.SetStateAction<number>>;
  formErrors: z.ZodIssue[];
}

const EcoAttributesForm = ({
  formData,
  setFormData,
  ecoScore,
  setEcoScore,
  // Not using formErrors parameter but keeping it in the interface
  // for consistency across components
}: EcoAttributesFormProps) => {

  // Handle eco-attribute toggles
  const toggleEcoAttribute = (attribute: EcoAttributes) => {
    const updatedAttributes = formData.ecoAttributes.includes(attribute)
      ? formData.ecoAttributes.filter((a) => a !== attribute)
      : [...formData.ecoAttributes, attribute];

    // Fix: Pass all formData properties when updating
    setFormData({
      ...formData, // Keep all existing formData properties
      ecoAttributes: updatedAttributes,
    });

    setEcoScore(calculateEcoScore(updatedAttributes));
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <FaLeaf className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Eco-friendly Attributes
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select all attributes that apply to your item
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4">
          {ecoAttributes.map((attribute) => (
            <div key={attribute} className="flex items-center">
              <Checkbox
                id={`eco-${attribute}`}
                checked={formData.ecoAttributes.includes(attribute)}
                onClick={() => toggleEcoAttribute(attribute)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`eco-${attribute}`}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                {attribute}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {ecoScore}/5
                </div>
                <FaLeaf className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-white dark:bg-green-900 rounded-full p-0.5" />
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-green-800 dark:text-green-300">
                Eco-friendly Score
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Items with higher eco-friendly scores are more likely to
                be promoted in search results and featured on the
                homepage!
              </p>
              <p className="text-xs mt-1 text-green-600 dark:text-green-500">
                Add more eco attributes to increase your score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoAttributesForm;