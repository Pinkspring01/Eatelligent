import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const [form, setForm] = useState({
    username: "",
    dietary_restrictions: [],
    preferences: "",
  });
  const [isNew, setIsNew] = useState(true);
  const navigate = useNavigate();

  const restrictionOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut Allergies",
    "Shellfish Allergies",
    "Halal",
    "Kosher",
    "Low-Carb",
    "Keto"
  ];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("http://localhost:5050/profile");
        if (response.ok) {
          const profile = await response.json();
          if (profile) {
            setForm(profile);
            setIsNew(false);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function handleRestrictionToggle(restriction) {
    const currentRestrictions = form.dietary_restrictions || [];
    if (currentRestrictions.includes(restriction)) {
      updateForm({
        dietary_restrictions: currentRestrictions.filter(r => r !== restriction)
      });
    } else {
      updateForm({
        dietary_restrictions: [...currentRestrictions, restriction]
      });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const profile = { ...form };
    
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });
      } else {
        response = await fetch("http://localhost:5050/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      alert("Profile saved successfully!");
      navigate("/");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-6">
        {isNew ? "Create Your Profile" : "Edit Your Profile"}
      </h3>
      
      <form onSubmit={onSubmit} className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-900">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => updateForm({ username: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-slate-900">
            Dietary Restrictions (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {restrictionOptions.map((restriction) => (
              <label key={restriction} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={form.dietary_restrictions?.includes(restriction)}
                  onChange={() => handleRestrictionToggle(restriction)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <span className="text-sm text-slate-700">{restriction}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="preferences" className="block text-sm font-medium mb-2 text-slate-900">
            Food Preferences & Notes
          </label>
          <textarea
            id="preferences"
            rows="4"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell us about your food preferences, favorite cuisines, ingredients you love or dislike, etc."
            value={form.preferences}
            onChange={(e) => updateForm({ preferences: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isNew ? "Create Profile" : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}