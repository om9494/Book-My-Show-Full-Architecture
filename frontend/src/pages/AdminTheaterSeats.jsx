import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const seatTypes = ["CLASSIC", "CLASSICPLUS", "PREMIUM"];

const ADMIN_SIDEBAR_LINKS = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "Movies", icon: "🎬", path: "/admin/movies" },
  { label: "Add Movie", icon: "➕", path: "/admin/add-movie" },
  { label: "Theaters", icon: "🏢", path: "/admin/theaters" },
  { label: "Add Theater", icon: "➕", path: "/admin/add-theater" },
  { label: "Shows", icon: "🕒", path: "/admin/shows" },
  { label: "Add Show", icon: "➕", path: "/admin/add-show" },
];

const AdminTheaterSeats = () => {
  const { theaterId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addForm, setAddForm] = useState({ rowLabel: "", seatCount: "", seatType: "CLASSIC" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rowLabel: "", seatCount: "", seatType: "CLASSIC" });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkRows, setBulkRows] = useState("");
  const [bulkSeatCount, setBulkSeatCount] = useState("");
  const [bulkSeatType, setBulkSeatType] = useState("CLASSIC");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState("");
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username") || "Admin";
    setAdmin({ name, role: role || "ADMIN" });
    if (role !== "ADMIN") {
      navigate("/", { replace: true });
    } else {
      fetchRows();
    }
    // eslint-disable-next-line
  }, [theaterId]);

  const fetchRows = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching rows for theater ID:", theaterId);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/theater-seats/theater/${theaterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch rows");
      const data = await res.json();
      setRows(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/theater-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rowLabel: addForm.rowLabel.trim().toUpperCase(),
          seatCount: parseInt(addForm.seatCount, 10),
          seatType: addForm.seatType,
          theaterId: theaterId
        })
      });
      if (!res.ok) throw new Error("Failed to add row");
      setSuccess("Row added successfully.");
      setAddForm({ rowLabel: "", seatCount: "", seatType: "CLASSIC" });
      fetchRows();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setEditForm({ rowLabel: row.rowLabel, seatCount: row.seatCount, seatType: row.seatType });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateRow = async (id) => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/theater-seats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rowLabel: editForm.rowLabel.trim().toUpperCase(),
          seatCount: parseInt(editForm.seatCount, 10),
          seatType: editForm.seatType,
          theaterId: theaterId
        })
      });
      if (!res.ok) throw new Error("Failed to update row");
      setSuccess("Row updated successfully.");
      setEditId(null);
      fetchRows();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/theater-seats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete row");
      setSuccess("Row deleted successfully.");
      fetchRows();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-blue-200 flex flex-col relative">
      {/* Animated/floating background shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-100 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <Navbar />
      <div className="flex flex-1 w-full max-w-8xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 min-h-full py-10 px-4 bg-white/70 backdrop-blur-md border-r border-gray-200 shadow-2xl rounded-tr-3xl rounded-br-3xl mt-8 mb-8 mr-6">
          <div className="flex flex-col items-center mb-10">
            <span className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-2xl font-extrabold border-2 border-pink-200 shadow-lg mb-2">
              {admin.name[0]}
            </span>
            <div className="font-bold text-lg text-gray-800">{admin.name}</div>
            <div className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 font-bold uppercase inline-block">{admin.role}</div>
          </div>
          <nav className="flex flex-col gap-2 w-full">
            {ADMIN_SIDEBAR_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-gray-700 hover:bg-pink-100 hover:text-pink-600 ${location.pathname === link.path ? 'bg-pink-500/20 text-pink-600 font-bold shadow' : ''}`}
              >
                <span className="text-lg">{link.icon}</span> {link.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 py-12 px-2 md:px-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-purple-600 text-center tracking-tight drop-shadow-lg">Manage Seat Rows</h2>
          <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl p-10 border-l-8 border-purple-500 mb-10 relative overflow-hidden min-h-[60vh] flex flex-col">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
            <form onSubmit={handleAddRow} className="flex flex-1 flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2">Row Label</label>
                  <input type="text" name="rowLabel" value={addForm.rowLabel} onChange={handleAddChange} required maxLength={2} className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/60" placeholder="A" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2">Seat Count</label>
                  <input type="number" name="seatCount" value={addForm.seatCount} onChange={handleAddChange} required min="1" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/60" placeholder="10" />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2">Seat Type</label>
                  <select name="seatType" value={addForm.seatType} onChange={handleAddChange} required className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/60">
                  {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl shadow hover:from-pink-600 hover:to-purple-600 text-lg transition">Add Row</button>
            </form>
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow hover:from-purple-600 hover:to-pink-600 text-lg transition"
            >
              Bulk Add Rows
            </button>
          </div>
          {error && <div className="text-center mb-4 text-lg font-semibold text-red-600">{error}</div>}
          {success && <div className="text-center mb-4 text-lg font-semibold text-green-600">{success}</div>}
          {loading ? (
            <div className="text-center py-10 text-xl font-bold text-purple-600 animate-pulse">Loading rows...</div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6 flex-1">
                  {rows.length === 0 ? (
                  <div className="col-span-full text-center py-6 text-gray-500">No rows found.</div>
                  ) : rows.map(row => (
                  <div key={row.id} className="relative rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl p-6 flex flex-col items-center group hover:scale-105 transition-all duration-300 border-t-4 border-purple-400 min-h-[180px] w-full">
                      {editId === row.id ? (
                      <form className="w-full flex flex-col gap-3">
                        <input type="text" name="rowLabel" value={editForm.rowLabel} onChange={handleEditChange} className="border px-3 py-2 rounded-xl w-full bg-white/60" maxLength={2} />
                        <input type="number" name="seatCount" value={editForm.seatCount} onChange={handleEditChange} className="border px-3 py-2 rounded-xl w-full bg-white/60" min="1" />
                        <select name="seatType" value={editForm.seatType} onChange={handleEditChange} className="border px-3 py-2 rounded-xl w-full bg-white/60">
                              {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        <div className="flex gap-2 mt-2 justify-center">
                          <button type="button" onClick={() => handleUpdateRow(row.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-600">Save</button>
                          <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-500">Cancel</button>
                        </div>
                      </form>
                      ) : (
                        <>
                        <div className="font-extrabold text-lg text-gray-800 mb-1 text-center truncate w-full">Row {row.rowLabel}</div>
                        <div className="flex flex-wrap gap-2 justify-center mb-2">
                          <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-semibold">Seats: {row.seatCount}</span>
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">{row.seatType}</span>
                        </div>
                        <div className="flex gap-3 mt-4 w-full justify-center">
                          <button onClick={() => startEdit(row)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Edit</button>
                          <button onClick={() => handleDeleteRow(row.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Delete</button>
                        </div>
                        </>
                      )}
                  </div>
                  ))}
            </div>
          )}
        </div>
      </main>
      </div>
      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative border-t-8 border-pink-500">
            <button onClick={() => { setShowBulkModal(false); setBulkResult(""); }} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-pink-500 text-center">Bulk Add Rows</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setBulkLoading(true);
              setBulkResult("");
              let rowsArr = [];
              const input = bulkRows.trim().toUpperCase();
              if (input.includes("-")) {
                const [start, end] = input.split("-");
                if (start && end && start.length === 1 && end.length === 1) {
                  for (let c = start.charCodeAt(0); c <= end.charCodeAt(0); c++) {
                    rowsArr.push(String.fromCharCode(c));
                  }
                }
              } else {
                rowsArr = input.split(",").map(r => r.trim()).filter(Boolean);
              }
              const seatCount = parseInt(bulkSeatCount, 10);
              if (!rowsArr.length || !seatCount || seatCount < 1) {
                setBulkResult("Invalid input. Please check rows and seat count.");
                setBulkLoading(false);
                return;
              }
              const token = localStorage.getItem("token");
              let successCount = 0, failCount = 0;
              for (let rowLabel of rowsArr) {
                try {
                  const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/theater-seats`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      rowLabel,
                      seatCount,
                      seatType: bulkSeatType,
                      theaterId: theaterId
                    })
                  });
                  if (res.ok) successCount++;
                  else failCount++;
                } catch {
                  failCount++;
                }
              }
              setBulkResult(`Added ${successCount} rows. ${failCount ? failCount + ' failed.' : ''}`);
              setBulkLoading(false);
              fetchRows();
            }} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Rows (A-D or A,B,C)</label>
                <input type="text" value={bulkRows} onChange={e => setBulkRows(e.target.value)} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 bg-white/60" placeholder="A-D or A,B,C" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Seat Count per Row</label>
                <input type="number" value={bulkSeatCount} onChange={e => setBulkSeatCount(e.target.value)} required min="1" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 bg-white/60" placeholder="10" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Seat Type</label>
                <select value={bulkSeatType} onChange={e => setBulkSeatType(e.target.value)} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 bg-white/60">
                  {seatTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <button type="submit" disabled={bulkLoading} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl shadow hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-60">{bulkLoading ? "Adding..." : "Add Rows"}</button>
              {bulkResult && <div className="text-center mt-2 text-lg font-semibold text-pink-600">{bulkResult}</div>}
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminTheaterSeats;