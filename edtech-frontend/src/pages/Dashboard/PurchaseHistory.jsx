// src/pages/Dashboard/PurchaseHistory.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../../services/paymentService";
import { formatDate, formatPrice } from "../../utils/formatters";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const PurchaseHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-history"],
    queryFn: () => paymentService.getPaymentHistory(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  const payments = data?.data || [];

  if (payments.length === 0) {
    return (
      <EmptyState
        title="No purchase history"
        description="You haven't made any purchases yet. Browse our courses and start learning today!"
        linkText="Browse Courses"
        linkTo="/courses"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Purchase History" />

      <div className="bg-white dark:bg-secondary-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-medium leading-6 text-secondary-900 dark:text-white">
            Your Purchases
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-secondary-500 dark:text-secondary-400">
            A record of all your course purchases
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={payment.course.thumbnail}
                          alt={payment.course.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900 dark:text-white">
                          {payment.course.title}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                          {payment.course.instructor.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
