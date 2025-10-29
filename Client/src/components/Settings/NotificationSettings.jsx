import { useState } from "react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMarketing: false,
    emailUpdates: true,
    pushOrders: true,
    pushMessages: false,
    pushUpdates: true,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSave = () => {
    // Add your save logic here
    setMessage({
      type: "success",
      text: "Notification preferences saved successfully!",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
      <div className="w-full px-8">
        <h1 className="text-base font-bold text-white mb-3 drop-shadow-md">
          Notification Settings
        </h1>

        {message.text && (
          <div
            className={`rounded-lg p-1.5 mb-2 text-[10px] ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Email Notifications
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Order Updates
                  </p>
                  <p className="text-[9px] text-gray-600">
                    Receive emails about your order status
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailOrders")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.emailOrders ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.emailOrders}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.emailOrders
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Marketing Emails
                  </p>
                  <p className="text-[9px] text-gray-600">
                    Promotions, special offers, and tips
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailMarketing")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.emailMarketing ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.emailMarketing}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.emailMarketing
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Product Updates
                  </p>
                  <p className="text-[9px] text-gray-600">
                    New features and improvements
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailUpdates")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.emailUpdates ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.emailUpdates}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.emailUpdates
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Push Notifications
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Order Updates
                  </p>
                  <p className="text-[9px] text-gray-600">
                    Push notifications for order status
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushOrders")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.pushOrders ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.pushOrders}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.pushOrders
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Messages
                  </p>
                  <p className="text-[9px] text-gray-600">
                    Support and customer service messages
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushMessages")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.pushMessages ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.pushMessages}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.pushMessages
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900">
                    Updates
                  </p>
                  <p className="text-[9px] text-gray-600">
                    Platform updates and announcements
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushUpdates")}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.pushUpdates ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  style={{ border: "none", boxShadow: "none", outline: "none" }}
                  aria-checked={notifications.pushUpdates}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications.pushUpdates
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold text-[10px] hover:shadow-lg transition-all duration-200"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
