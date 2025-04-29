import { z } from "zod";

interface FormErrorDisplayProps {
  formErrors: z.ZodIssue[];
  errorMessage: string;
}

const FormErrorDisplay = ({ formErrors, errorMessage }: FormErrorDisplayProps) => {
  if (formErrors.length === 0 && !errorMessage) return null;

  return (
    <>
      {errorMessage && (
        <div className="mb-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {formErrors.length > 0 && (
        <div className="mb-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
          <p className="font-medium">
            Please correct the following errors:
          </p>
          <ul className="mt-2 list-disc pl-5">
            {formErrors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FormErrorDisplay;