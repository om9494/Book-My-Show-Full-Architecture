import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getTicketId } from '../utils/entity';

const UpdateTicketModal = ({ isOpen, onClose, ticket }) => {
    // Don't render anything if the modal is not open
    if (!isOpen) return null;

    const navigate = useNavigate();
    const ticketId = getTicketId(ticket);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [availableShows, setAvailableShows] = useState([]); // Will store { showId, time } objects
    const [loadingShows, setLoadingShows] = useState(false);
    const [error, setError] = useState('');

    // Generate dates for the next 7 days
    useEffect(() => {
        const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return {
                display: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
                value: date.toISOString().split("T")[0],
            };
        });
        setDates(nextWeekDates);
        const ticketDate = new Date(ticket.date).toISOString().split("T")[0];
        if (new Date(ticketDate) >= new Date(new Date().toISOString().split("T")[0])) {
            setSelectedDate(ticketDate);
        }
    }, [ticket.date]);

    // Fetch available shows when the selected date changes
    useEffect(() => {
        const fetchShows = async () => {
            if (!selectedDate || !ticket || !ticket.theater.city) return;
            setLoadingShows(true);
            setError('');
            setAvailableShows([]);

            try {
                // THE FIX IS HERE: Changed ticket.movie.movieId to ticket.movie.id
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/shows/theaterAndShowTimingsByMovie`, {
                    params: {
                        movieId: ticket.movie.id, // <-- CORRECTED LINE
                        city: ticket.theater.city,
                        date: selectedDate,
                    },
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });

                const allTheatersShowtimes = response.data;
                const currentTheaterShowtimes = allTheatersShowtimes[ticket.theater.id];

                if (currentTheaterShowtimes) {
                    const shows = Object.entries(currentTheaterShowtimes).map(([showId, time]) => ({
                        showId: parseInt(showId),
                        time,
                    }));
                    setAvailableShows(shows);
                } else {
                    setAvailableShows([]);
                }

            } catch (err) {
                console.error("Error fetching available shows:", err);
                setError('Could not fetch showtimes for the selected date.');
                setAvailableShows([]);
            } finally {
                setLoadingShows(false);
            }
        };

        fetchShows();
    }, [selectedDate, ticket]);

    // Navigate to seat selection in "update mode"
    const handleShowSelect = (show) => {
        navigate(`/movie/${ticket.movie.id}/book/seats`, { // Also updated here for consistency
            state: {
                isUpdateMode: true,
                originalTicketId: ticketId,
                originalFare: ticket.fare,
                newShowId: show.showId,
                theaterId: ticket.theater.id,
                time: show.time,
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative border-4 border-pink-400">
                <button onClick={onClose} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-700">&times;</button>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Update Your Ticket</h2>
                <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <p><strong>Movie:</strong> {ticket.movie.movieName}</p>
                    <p><strong>Current Show:</strong> {new Date(ticket.date).toLocaleDateString()} at {ticket.time}</p>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">1. Select a New Date</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {dates.map(d => (
                            <button key={d.value} onClick={() => setSelectedDate(d.value)}
                                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all min-w-max ${selectedDate === d.value ? 'bg-pink-500 text-white border-pink-500 scale-105' : 'bg-gray-100 border-gray-300 hover:border-pink-300'}`}>
                                {d.display}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-3">2. Select a New Showtime</h3>
                    {loadingShows && <p>Loading showtimes...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loadingShows && availableShows.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {availableShows.map(show => (
                                <button key={show.showId} onClick={() => handleShowSelect(show)}
                                    className="border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg font-bold bg-white hover:bg-green-50 hover:shadow-lg transition">
                                    {show.time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        !loadingShows && <p className="text-gray-600">No available shows for the selected date.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateTicketModal;
