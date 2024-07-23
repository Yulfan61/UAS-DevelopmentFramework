import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from 'qrcode.react';
import Search from "./Search";

// RecordActions component for rendering individual records
const RecordActions = ({ record, deleteRecord }) => {
  const printRecord = () => {
    window.print();
  };

  const generateQRCode = () => {
    return (
      <QRCode value={record._id} size={100} />  // Set the QR code size here
    );
  };

  const shareLink = () => {
    const link = `${window.location.origin}/edit/${record._id}`;
    if (navigator.share) {
      navigator.share({
        title: 'Record Link',
        url: link,
      }).catch(console.error);
    } else {
      // Fallback to copying the link to clipboard
      navigator.clipboard.writeText(link).then(() => {
        alert('Link copied to clipboard');
      }).catch(console.error);
    }
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">{record.name}</td>
      <td className="p-4 align-middle">{record.position}</td>
      <td className="p-4 align-middle">{record.datagudang}</td>
      <td className="p-4 align-middle">{record.level}</td>
      <td className="p-4 align-middle">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <Link
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              to={`/edit/${record._id}`}
            >
              Edit
            </Link>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
              type="button"
              onClick={() => deleteRecord(record._id)}
            >
              Delete
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              type="button"
              onClick={printRecord}
            >
              Print
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              type="button"
              onClick={shareLink}
            >
              Share
            </button>
          </div>
          <div className="flex-shrink-0">
            {generateQRCode()}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch records from the API
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/record/");
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
        setFilteredRecords(records);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    getRecords();
  }, []);

  // Filter records based on search term
  useEffect(() => {
    setFilteredRecords(
      records.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.datagudang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.level.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, records]);

  // Delete a record by id
  const deleteRecord = async (id) => {
    try {
      const response = await fetch(`http://localhost:5050/record/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
      }
      setRecords(prevRecords => prevRecords.filter(record => record._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Render records list
  const recordList = filteredRecords.map(record => (
    <RecordActions record={record} deleteRecord={deleteRecord} key={record._id} />
  ));

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : error ? (
        <p className="p-4 text-red-500">Error: {error}</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Nama Barang
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Satuan Barang
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Data Gudang
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Jenis Barang
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
