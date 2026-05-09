import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Subscription Management - Single-file implementation with mock API helpers

// Mock data (matches the provided mock GET /plans response)
const INITIAL_PLANS = [
  {
    id: 1,
    name: "Monthly Basic",
    durationDays: 30,
    price: 150,
    currency: "EGP",
    description: "Access to all standard equipment during off-peak hours.",
    features: ["Equipment Access", "Locker Room"],
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Monthly Premium",
    durationDays: 30,
    price: 250,
    currency: "EGP",
    description: "Full 24/7 access including group classes.",
    features: [
      "24/7 Access",
      "Group Classes",
      "Locker Room",
      "Personal Trainer (2 sessions)",
    ],
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Quarterly",
    durationDays: 90,
    price: 600,
    currency: "EGP",
    description: "3-month plan with 15% saving vs monthly.",
    features: ["24/7 Access", "Group Classes", "Locker Room"],
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "Annual",
    durationDays: 365,
    price: 2000,
    currency: "EGP",
    description: "Best value — full year access with priority booking.",
    features: [
      "24/7 Access",
      "Group Classes",
      "Locker Room",
      "Priority Booking",
      "Monthly Assessment",
    ],
    status: "ACTIVE",
  },
];

// Simple in-file mock API helpers. Replace implementations with real fetch/axios later.
let nextPlanId = INITIAL_PLANS.length + 1;
let nextSubscriptionId = 55;

function wait(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getPlans() {
  await wait(400);
  return JSON.parse(JSON.stringify(INITIAL_PLANS));
}

export async function createPlan(planData) {
  await wait(500);
  const newPlan = {
    id: nextPlanId++,
    ...planData,
    status: "ACTIVE",
  };
  // For this mock we also push to INITIAL_PLANS so subsequent getPlans could reflect it
  INITIAL_PLANS.push(newPlan);
  return JSON.parse(JSON.stringify(newPlan));
}

export async function createSubscription(subscriptionData) {
  await wait(700);
  nextSubscriptionId += 1;
  const plan = INITIAL_PLANS.find((p) => p.id === subscriptionData.planId);
  const start = new Date();
  const end = new Date(
    start.getTime() + (plan?.durationDays || 30) * 24 * 60 * 60 * 1000,
  );
  const resp = {
    id: nextSubscriptionId,
    memberId: 101,
    memberName: "Ahmed Hassan",
    planId: plan?.id || subscriptionData.planId,
    planName: plan?.name || "Unknown Plan",
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    status: "ACTIVE",
    amountPaid: plan?.price || subscriptionData.amount || 0,
    paymentMethod: subscriptionData.paymentMethod || "CASH",
    createdAt: new Date().toISOString(),
  };
  return JSON.parse(JSON.stringify(resp));
}

export async function cancelSubscription(subscriptionId, cancelData) {
  await wait(400);
  return {
    message: `Subscription ID ${subscriptionId} has been cancelled.`,
  };
}

// Validation helpers
const validatePlan = ({ name, durationDays, price, description, features }) => {
  const errors = {};
  if (!name || !name.trim()) errors.name = "Plan name is required.";
  if (!durationDays || Number(durationDays) <= 0)
    errors.durationDays = "Duration must be greater than 0.";
  if (!price || Number(price) <= 0)
    errors.price = "Price must be greater than 0.";
  if (!description || !description.trim())
    errors.description = "Description is required.";
  if (!features || features.length === 0)
    errors.features = "At least one feature is required.";
  return errors;
};

function formatCurrency(amount, currency) {
  return `${amount} ${currency}`;
}

function Badge({ children, color = "bg-gray-200 text-gray-800" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}
    >
      {children}
    </span>
  );
}

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planError, setPlanError] = useState(null);

  const [createSuccess, setCreateSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting: isCreatingPlan },
  } = useForm({
    defaultValues: {
      name: "",
      durationDays: 30,
      price: "",
      currency: "EGP",
      description: "",
      featuresText: "",
    },
  });

  const {
    register: registerCancel,
    handleSubmit: handleSubmitCancel,
    formState: { errors: cancelErrors, isSubmitting: isCancelling },
    reset: resetCancel,
  } = useForm({ defaultValues: { reason: "" } });

  const [subscription, setSubscription] = useState(null);
  const [creatingSubscription, setCreatingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelResponse, setCancelResponse] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoadingPlans(true);
      setPlanError(null);
      try {
        const data = await getPlans();
        if (mounted) setPlans(data);
      } catch (err) {
        setPlanError("Failed to load plans.");
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // Create plan handler (react-hook-form)
  const onSubmitPlan = async (data) => {
    setCreateSuccess(null);
    const features = data.featuresText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const payload = {
      name: data.name.trim(),
      durationDays: Number(data.durationDays),
      price: Number(data.price),
      currency: data.currency || "EGP",
      description: data.description.trim(),
      features,
    };
    const errors = validatePlan(payload);
    if (Object.keys(errors).length) {
      // map validation errors into formErrors by throwing to react-hook-form
      // but we'll set createSuccess to null and return
      return;
    }
    try {
      const newPlan = await createPlan(payload);
      setPlans((p) => [newPlan, ...p]);
      setCreateSuccess("Plan created successfully.");
      reset();
      setTimeout(() => setCreateSuccess(null), 3000);
    } catch (err) {
      // keep it minimal — display via createSuccess variable
      setCreateSuccess("Failed to create plan.");
    }
  };

  // Subscribe handler
  const handleSubscribe = async (plan) => {
    setSubscriptionError(null);
    setCreatingSubscription(true);
    try {
      const resp = await createSubscription({
        planId: plan.id,
        paymentMethod: "CASH",
      });
      setSubscription(resp);
      setCancelResponse(null);
    } catch (err) {
      setSubscriptionError("Failed to create subscription.");
    } finally {
      setCreatingSubscription(false);
    }
  };

  const onCancelSubmit = async (data) => {
    setCancelResponse(null);
    try {
      const resp = await cancelSubscription(subscription.id, {
        reason: data.reason.trim(),
      });
      setSubscription((s) => ({ ...s, status: "CANCELLED" }));
      setCancelResponse({ success: resp.message });
      resetCancel();
    } catch (err) {
      setCancelResponse({ error: "Failed to cancel subscription." });
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Subscription Management</h1>
        <p className="text-sm text-gray-500">
          Manage plans and member subscriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans + creation form column */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Available Plans</h2>
            <div className="text-sm text-gray-500">
              {loadingPlans ? "Loading..." : `${plans.length} plans`}
            </div>
          </div>

          {planError && <div className="text-red-600">{planError}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loadingPlans &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg animate-pulse bg-white/50"
                />
              ))}

            {!loadingPlans && plans.length === 0 && (
              <div className="col-span-full p-6 border rounded-lg text-center text-gray-500">
                No plans available.
              </div>
            )}

            {!loadingPlans &&
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-md font-semibold">{plan.name}</h3>
                      <div className="text-sm text-gray-600">
                        {plan.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatCurrency(plan.price, plan.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {plan.durationDays} days
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {plan.features.map((f, idx) => (
                      <Badge key={idx} color="bg-gray-100 text-gray-800">
                        {f}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <Badge
                        color={
                          plan.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
                        onClick={() => handleSubscribe(plan)}
                        disabled={creatingSubscription}
                      >
                        {creatingSubscription ? "Processing..." : "Subscribe"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Create plan + subscription/result column */}
        <aside className="space-y-6">
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-medium mb-3">Create Plan</h3>
            <form onSubmit={handleSubmit(onSubmitPlan)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  {...register("name", { required: "Plan name is required." })}
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
                {formErrors.name && (
                  <div className="text-red-600 text-sm">
                    {formErrors.name.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (days)
                  </label>
                  <input
                    {...register("durationDays", {
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Duration must be greater than 0.",
                      },
                    })}
                    type="number"
                    className="mt-1 block w-full border rounded px-2 py-1"
                  />
                  {formErrors.durationDays && (
                    <div className="text-red-600 text-sm">
                      {formErrors.durationDays.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    {...register("price", {
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Price must be greater than 0.",
                      },
                    })}
                    type="number"
                    className="mt-1 block w-full border rounded px-2 py-1"
                  />
                  {formErrors.price && (
                    <div className="text-red-600 text-sm">
                      {formErrors.price.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <input
                    {...register("currency")}
                    className="mt-1 block w-full border rounded px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required.",
                  })}
                  className="mt-1 block w-full border rounded px-2 py-1"
                  rows={3}
                />
                {formErrors.description && (
                  <div className="text-red-600 text-sm">
                    {formErrors.description.message}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Features (comma-separated)
                </label>
                <input
                  {...register("featuresText", {
                    required: "At least one feature is required.",
                  })}
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
                {formErrors.featuresText && (
                  <div className="text-red-600 text-sm">
                    {formErrors.featuresText.message}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isCreatingPlan}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {isCreatingPlan ? "Creating..." : "Create Plan"}
                </button>
                {createSuccess && (
                  <div className="text-green-600 text-sm">{createSuccess}</div>
                )}
              </div>
            </form>
          </div>

          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-medium mb-2">Subscription Result</h3>
            {!subscription && (
              <div className="text-sm text-gray-500">
                No subscription created yet. Use a plan's Subscribe button.
              </div>
            )}

            {subscription && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Subscription ID:{" "}
                  <strong className="text-gray-800">{subscription.id}</strong>
                </div>
                <div className="text-sm text-gray-600">
                  Member:{" "}
                  <strong className="text-gray-800">
                    {subscription.memberName}
                  </strong>
                </div>
                <div className="text-sm text-gray-600">
                  Plan:{" "}
                  <strong className="text-gray-800">
                    {subscription.planName}
                  </strong>
                </div>
                <div className="text-sm text-gray-600">
                  Start:{" "}
                  <strong className="text-gray-800">
                    {subscription.startDate}
                  </strong>
                </div>
                <div className="text-sm text-gray-600">
                  End:{" "}
                  <strong className="text-gray-800">
                    {subscription.endDate}
                  </strong>
                </div>
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  <strong
                    className={`font-semibold ${subscription.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}
                  >
                    {subscription.status}
                  </strong>
                </div>
                <div className="text-sm text-gray-600">
                  Amount Paid:{" "}
                  <strong className="text-gray-800">
                    {subscription.amountPaid}{" "}
                    {subscription.paymentMethod
                      ? subscription.paymentMethod === "CASH"
                        ? subscription.paymentMethod
                        : subscription.paymentMethod
                      : ""}
                  </strong>
                </div>

                {subscription.status !== "CANCELLED" && (
                  <div className="pt-2 border-t">
                    <label className="block text-sm font-medium text-gray-700">
                      Cancellation Reason
                    </label>
                    <form
                      onSubmit={handleSubmitCancel(onCancelSubmit)}
                      className="mt-2"
                    >
                      <input
                        {...registerCancel("reason", {
                          required: "Cancellation reason is required.",
                        })}
                        className="mt-1 block w-full border rounded px-2 py-1"
                      />
                      {cancelErrors.reason && (
                        <div className="text-red-600 text-sm">
                          {cancelErrors.reason.message}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="submit"
                          disabled={isCancelling}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Subscription"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {cancelResponse && cancelResponse.success && (
                  <div className="text-green-600">{cancelResponse.success}</div>
                )}
                {cancelResponse && cancelResponse.error && (
                  <div className="text-red-600">{cancelResponse.error}</div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* global error or messages */}
      {subscriptionError && (
        <div className="mt-4 text-red-600">{subscriptionError}</div>
      )}
    </div>
  );
}
