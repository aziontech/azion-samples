import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import Link from 'next/link'

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];
export default function Search({style}) {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className={style}>
      <SearchIcon className="h-5 w-5 text-gray-700" />
      <input
        type="text"
        placeholder="Search For Products"
        className="outline-none text-black m-0 border-0"
        onChange={(event) => setQuery(event.target.value)}
      />
      {query != "" && (
        <div className="py-2 space-y-4 px-4 flex flex-col border-solid border-[1px] border-gray-100 drop-shadow-2xl absolute top-full -left-3 right-0  text-black  bg-white rounded-xl m-0">
          {filteredPeople.map((person) => (
            <a
              className=" text-black cursor-pointer"
              key={person.id}
              value={person}
            >
              {person.name}
            </a>
          ))}
                  {
            filteredPeople.length==0 &&
            <a
              className=" text-black cursor-not-allowed"
            >
              Nothing Found
            </a>
        }
        </div>

      )}
    </div>
  );
}
