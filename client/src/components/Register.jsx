import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Update the form state
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/login");
    } catch (error) {
      console.error("Failed to register", error);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Register</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">User Info</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Please enter your email and password to register.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Email
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Register"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
