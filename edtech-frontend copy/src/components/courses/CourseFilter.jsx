// src/components/courses/CourseFilter.jsx
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FunnelIcon } from "@heroicons/react/24/solid";

// Filter options
const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Health & Fitness",
];

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const priceRanges = [
  { value: "0-500", label: "Free & Under ₹500" },
  { value: "500-1000", label: "Between ₹500 - ₹1,000" },
  { value: "1000-2000", label: "Between ₹1,000 - ₹2,000" },
  { value: "2000-5000", label: "Between ₹2,000 - ₹5,000" },
  { value: "5000-", label: "Above ₹5,000" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const CourseFilter = ({ filters, onChange }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Handle category selection
  const handleCategoryChange = (category, isChecked) => {
    let newCategories = [...filters.categories];

    if (isChecked) {
      newCategories.push(category);
    } else {
      newCategories = newCategories.filter((c) => c !== category);
    }

    onChange({ categories: newCategories });
  };

  // Render filter section for desktop
  const FilterSection = ({ children, title }) => (
    <Disclosure
      as="div"
      className="border-b border-secondary-200 dark:border-secondary-700 py-6"
      defaultOpen={true}
    >
      {({ open }) => (
        <>
          <h3 className="flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-secondary-400 hover:text-secondary-500 dark:text-secondary-500 dark:hover:text-secondary-400">
              <span className="font-medium text-secondary-900 dark:text-secondary-100">{title}</span>
              <span className="ml-6 flex items-center">
                <ChevronUpIcon
                  className={`h-5 w-5 ${open ? "rotate-180 transform" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-6">{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-4">
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-secondary-800 py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                    Filters
                  </h2>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-secondary-700 p-2 text-secondary-400 dark:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <div className="mt-4 px-4 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Categories
                    </h3>
                    <div className="mt-4 space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            id={`mobile-category-${category}`}
                            name={`category-${category}`}
                            type="checkbox"
                            className="input-checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={(e) =>
                              handleCategoryChange(category, e.target.checked)
                            }
                          />
                          <label
                            htmlFor={`mobile-category-${category}`}
                            className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100">Level</h3>
                    <div className="mt-4 space-y-2">
                      {levels.map((level) => (
                        <div key={level.value} className="flex items-center">
                          <input
                            id={`mobile-level-${level.value}`}
                            name="level"
                            type="radio"
                            className="input-radio"
                            value={level.value}
                            checked={filters.level === level.value}
                            onChange={() => onChange({ level: level.value })}
                          />
                          <label
                            htmlFor={`mobile-level-${level.value}`}
                            className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                          >
                            {level.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Price Range
                    </h3>
                    <div className="mt-4 space-y-2">
                      {priceRanges.map((range) => (
                        <div key={range.value} className="flex items-center">
                          <input
                            id={`mobile-price-${range.value}`}
                            name="price"
                            type="radio"
                            className="input-radio"
                            value={range.value}
                            checked={filters.priceRange === range.value}
                            onChange={() =>
                              onChange({ priceRange: range.value })
                            }
                          />
                          <label
                            htmlFor={`mobile-price-${range.value}`}
                            className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop filter sections */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Filters
        </h2>

        {/* Sort by */}
        <div className="mb-6">
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            className="input"
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <FilterSection title="Categories">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  id={`category-${category}`}
                  name={`category-${category}`}
                  type="checkbox"
                  className="input-checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) =>
                    handleCategoryChange(category, e.target.checked)
                  }
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Level */}
        <FilterSection title="Level">
          <div className="space-y-2">
            {levels.map((level) => (
              <div key={level.value} className="flex items-center">
                <input
                  id={`level-${level.value}`}
                  name="level"
                  type="radio"
                  className="input-radio"
                  value={level.value}
                  checked={filters.level === level.value}
                  onChange={() => onChange({ level: level.value })}
                />
                <label
                  htmlFor={`level-${level.value}`}
                  className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                >
                  {level.label}
                </label>
              </div>
            ))}

            {/* Clear level filter option */}
            {filters.level && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
                onClick={() => onChange({ level: "" })}
              >
                Clear selection
              </button>
            )}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center">
                <input
                  id={`price-${range.value}`}
                  name="price"
                  type="radio"
                  className="input-radio"
                  value={range.value}
                  checked={filters.priceRange === range.value}
                  onChange={() => onChange({ priceRange: range.value })}
                />
                <label
                  htmlFor={`price-${range.value}`}
                  className="ml-3 text-sm text-secondary-600 dark:text-secondary-400"
                >
                  {range.label}
                </label>
              </div>
            ))}

            {/* Clear price filter option */}
            {filters.priceRange && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
                onClick={() => onChange({ priceRange: "" })}
              >
                Clear selection
              </button>
            )}
          </div>
        </FilterSection>
      </div>

      {/* Mobile filter button */}
      <div className="md:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-center space-x-2 rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 py-3 px-4 text-sm font-medium text-secondary-700 dark:text-secondary-300 shadow-sm hover:bg-secondary-50 dark:hover:bg-secondary-600"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <FunnelIcon
            className="h-5 w-5 text-secondary-400 dark:text-secondary-500"
            aria-hidden="true"
          />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

// Add utility classes for checkbox/radio if not already defined in index.css
/*
@layer components {
  .input-checkbox {
    @apply h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500;
    @apply dark:border-secondary-600 dark:bg-secondary-700 dark:checked:bg-primary-500 dark:focus:ring-primary-500 dark:focus:ring-offset-secondary-800;
  }
  .input-radio {
    @apply h-4 w-4 border-secondary-300 text-primary-600 focus:ring-primary-500;
    @apply dark:border-secondary-600 dark:bg-secondary-700 dark:checked:bg-primary-500 dark:focus:ring-primary-500 dark:focus:ring-offset-secondary-800;
  }
}
*/

export default CourseFilter;
