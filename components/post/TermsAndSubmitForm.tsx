import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAndSubmitFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const TermsAndSubmitForm = ({ onSubmit }: TermsAndSubmitFormProps) => {
  return (
    <section className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <Checkbox
              id="terms"
              name="terms"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-green-600 hover:text-green-500"
              >
                Terms and Conditions
              </Link>
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              By posting this listing, I confirm that I have the right
              to sell this item and the information provided is
              accurate.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/browse"
            className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
          >
            Cancel
          </Link>
          <button
            type="submit"
            onClick={(e) => onSubmit(e)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Post Listing
          </button>
        </div>
      </div>
    </section>
  );
};

export default TermsAndSubmitForm;