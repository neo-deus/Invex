"use client";
import React from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Datepicker from "tailwind-datepicker-react";

const people = [
  {
    id: 1,
    name: "Wade Cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Devon Webb",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "Tom Cook",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 5,
    name: "Tanya Fox",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 6,
    name: "Hellen Schmidt",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 7,
    name: "Caroline Schultz",
    avatar:
      "https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 8,
    name: "Mason Heaney",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 9,
    name: "Claudie Smitham",
    avatar:
      "https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 10,
    name: "Emil Schaefer",
    avatar:
      "https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const options = {
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

const ExpenseForm = ({ close }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(people[0]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    title: false,
    amount: false,
    date: false,
    category: false,
  });
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const validate = () => {
    let tempErrors = {};
    if (!title) tempErrors.title = "Title is required.";
    if (!amount) tempErrors.amount = "Amount is required.";
    if (!date) tempErrors.date = "Date is required.";
    if (!selected.name) tempErrors.category = "Category is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!validate()) return;
    const dateObj = new Date(date);
    const timeZoneOffset = dateObj.getTimezoneOffset() * 60000; // convert offset to milliseconds
    const localDate = new Date(dateObj.getTime() - timeZoneOffset);
    console.log(dateObj);
    // Extract year and month, ensuring the month is formatted as two digits
    const year = localDate.getFullYear().toString(); // Get year as string
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const formData = {
      title,
      amount: Number(amount),
      date: localDate.toISOString().split("T")[0],
      category: selected.name,
      year,
      month,
      email,
    };

    console.log(formData);
    try {
      // Use Axios to post the data
      const response = await axios.post("/api/transaction/expense", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data); // Process or log the result from the server
      setTitle("");
      setAmount("");
      setDate("");
      setSelected(people[0]);
      close(); // Close the modal on successful submission
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  const [show, setShow] = useState(false);
  const handleChange = (selectedDate) => {
    if (selectedDate) {
      // Ensure the date from the datepicker is a valid Date object
      setDate(selectedDate);
    } else {
      console.error("Selected date is invalid:", selectedDate);
      setDate(new Date().toISOString().split("T")[0]); // Fallback to today's date if error
    }
  };
  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <div>
      <div className="fixed -top-14 inset-10  flex items-center justify-center z-50">
        <div className="mx-auto w-[40%] space-y-6 bg-white p-8 rounded-3xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Expense Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Add your expense details to keep track of your finances.
            </p>
          </div>
          <form className="space-y-4" onSubmit={(e) => preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur("title")}
                  placeholder="Enter the income title"
                  required
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {touched.title && errors.title && (
                  <div style={{ color: "red" }}>{errors.title}</div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <Datepicker
                  value={date}
                  options={options}
                  onChange={handleChange}
                  show={show}
                  setShow={handleClose}
                />
                {touched.date && errors.date && (
                  <div style={{ color: "red" }}>{errors.date}</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => handleBlur("amount")}
                  placeholder="Enter the income amount"
                  required
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {touched.amount && errors.amount && (
                  <div style={{ color: "red" }}>{errors.amount}</div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <Listbox
                  value={selected}
                  onChange={setSelected}
                  onBlur={() => handleBlur("selected")}
                >
                  {({ open }) => (
                    <>
                      <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <img
                              src={selected.avatar}
                              alt=""
                              className="h-5 w-5 flex-shrink-0 rounded-full"
                            />
                            <span className="ml-3 block truncate">
                              {selected.name}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto no-scrollbar rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {people.map((person) => (
                              <Listbox.Option
                                key={person.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <img
                                        src={person.avatar}
                                        alt=""
                                        className="h-5 w-5 flex-shrink-0 rounded-full"
                                      />
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "ml-3 block truncate"
                                        )}
                                      >
                                        {person.name}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
                {touched.category && errors.category && (
                  <div style={{ color: "red" }}>{errors.category}</div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
