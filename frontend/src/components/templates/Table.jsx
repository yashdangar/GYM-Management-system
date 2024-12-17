import { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

// Format date to a human-readable string
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short", // Optional: displays the weekday
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function Table({
  title,
  TABLE_HEAD,
  TABLE_ROWS=[],
  info = false,
  handleAdd,
  handleEdit,
  handleDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("TABLE_ROWS:", TABLE_ROWS, "Type:", typeof TABLE_ROWS);
  
  // Filter rows based on the search query
  // console.log(TABLE_ROWS)
  const filteredRows = TABLE_ROWS.filter((row) =>
    Object.values(row).some((value) => {
      const safeValue = value === null || value === undefined ? "" : value.toString().toLowerCase();
      return safeValue.includes(searchQuery.toLowerCase());
    })
  );

  return (
    <Card className="h-full w-full shadow-lg">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none bg-gray-100 p-6"
      >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" className="font-semibold text-blue-gray">
              {title}'s List
            </Typography>
            <Typography className="mt-1 text-sm text-gray-600">
              See information about all {title}s
            </Typography>
          </div>
          <Button
            onClick={handleAdd} // Trigger the "Add" function
            className="flex items-center gap-3 bg-blue-500 text-white"
          >
            <PlusIcon className="h-4 w-4" /> Add {title}
          </Button>
        </div>
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-md border pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 text-sm text-blue-gray-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => {
              const isLast = index === filteredRows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index} className="hover:bg-blue-50">
                  {TABLE_HEAD.map((header) => {
                    const key = header.toLowerCase(); // Assuming row keys match the header in lowercase
                    const value = row[key] || "";  // Default to an empty string if no value exists
                    // console.log(`Header: ${header}, Key: ${key}, Value: ${row[key]}`);
                    if ((header.toLowerCase() === "invoicedate" ||header.toLowerCase() === "birthdate" || header.toLowerCase() === "date") && value) {
                      return (
                        <td key={header} className={classes}>
                          <Typography variant="small">{formatDate(value)}</Typography>
                        </td>
                      );
                    }

                    if (header.toLowerCase() === "name" && row.img) {
                      return (
                        <td key={header} className={classes}>
                          <div className="flex items-center gap-3">
                            {row.img !== null && (
                              <Avatar src={row.img} alt={row.name} size="xs" />
                            )}
                            <Typography
                              variant="small"
                              className="font-medium"
                            >
                              {row.name}
                            </Typography>
                          </div>
                        </td>
                      );
                    }

                    if (header.toLowerCase() === "status") {
                      const statusValue =
                        value != null
                          ? value
                            ? "Active"
                            : "Inactive"
                          : "Unknown";
                      return (
                        <td key={header} className={classes}>
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={statusValue}
                            color={value ? "green" : "blue-gray"}
                          />
                        </td>
                      );
                    }

                    return (
                      <td key={header} className={classes}>
                        <Typography variant="small">{value}</Typography>
                      </td>
                    );
                  })}
                  <td className={classes}>
                    {info && (
                      <Tooltip content={`${title}'s info`}>
                        <IconButton variant="text">
                          <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip content="Edit">
                      <IconButton
                        variant="text"
                        onClick={() => handleEdit(row)} // Pass row data to handleEdit
                      >
                        <PencilIcon className="h-4 w-4 text-gray-500" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Remove">
                      <IconButton
                        variant="text"
                        onClick={() => handleDelete(row)} // Pass row data to handleDelete
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      {/* <CardFooter className="flex items-center justify-between border-t p-4">
        <Typography variant="small">Page 1 of 10</Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter> */}
    </Card>
  );
}

export default Table;
