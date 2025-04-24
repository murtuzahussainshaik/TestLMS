// src/pages/Dashboard/PurchaseHistory.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../../services/paymentService";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import {
  ReceiptRefundIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { formatDate, formatPrice } from "../../utils/formatters";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);

  // Fetch purchase history
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["purchase-history"],
    queryFn: () => paymentService.getPurchasedCourses(), // Reusing this endpoint as it returns purchase details too
    refetchOnWindowFocus: false
  });

  // Set purchases when data is loaded
  useEffect(() => {
    if (data && !isLoading) {
      setPurchases(data.data || []);
    }
  }, [data, isLoading]);

  // Show error if purchases couldn't be loaded
  useEffect(() => {
    if (error) {
      toast.error("Failed to load purchase history");
      console.error("Error loading purchases:", error);
    }
  }, [error]);

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ReceiptRefundIcon className="h-4 w-4 mr-1" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Purchase History
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            View all your course purchases and payment details
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : purchases.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-secondary-200">
              {purchases.map((purchase) => (
                <li key={purchase._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {purchase.course?.thumbnail ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={purchase.course.thumbnail}
                              alt={purchase.course.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                              <ShoppingCartIcon className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/courses/${purchase.course?._id}`}
                            className="text-base font-medium text-primary-600 hover:text-primary-700"
                          >
                            {purchase.course?.title || "Course"}
                          </Link>
                          <p className="text-sm text-secondary-500">
                            {purchase.course?.instructor?.name || "Instructor"}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                        <div className="text-sm font-medium text-secondary-900">
                          {formatPrice(purchase.amount)}
                        </div>
                        {purchase.status && getStatusBadge(purchase.status)}
                      </div>
                    </div>

                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-secondary-500">
                          Payment method: {purchase.paymentMethod || "Card"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-secondary-500 sm:mt-0">
                        <p>Purchased on {formatDate(purchase.createdAt)}</p>
                      </div>
                    </div>

                    {purchase.status === "completed" && (
                      <div className="mt-2">
                        <Link
                          to={`/dashboard/course/${purchase.course?._id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Go to course →
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-lg font-medium text-secondary-900">
              No purchases yet
            </h3>
            <p className="mt-1 text-sm text-secondary-500">
              You haven't purchased any courses yet.
            </p>
            <div className="mt-6">
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
