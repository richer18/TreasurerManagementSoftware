import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Button,
  Tooltip
} from '@mui/material';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    file: null,
    start: new Date(), // Set default start to current date
    end: new Date(),   // Set default end to current date
    color: '#2196F3'
  });
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const ariaLabel = { 'aria-label': 'description' };
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Automatically handle slot selection and open the dialog
  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(start); // Set the selected date
    setNewEvent({ title: '', description: '', file: null, start, end, color: '#2196F3' });
    setOpen(true);
    setIsViewMode(false); // Ensure it's in edit mode
  };

  // Handle adding or editing an event
  const handleAddOrEditEvent = () => {
    if (newEvent.title && newEvent.description) {
      if (selectedEvent) {
        // Update existing event
        const updatedEvents = events.map(event =>
          event === selectedEvent ? { ...newEvent, start: selectedEvent.start, end: selectedEvent.end } : event
        );
        setEvents(updatedEvents);
      } else {
        // Add new event
        setEvents([...events, newEvent]);
      }
      setNewEvent({ title: '', description: '', file: null, start: '', end: '', color: '#2196F3' });
      setOpen(false);
      setSelectedEvent(null); // Reset selectedEvent after saving
    } else {
      alert("Both title and description are required.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setNewEvent({ ...newEvent, file: e.target.files[0] });
  };

  // Handle click on an event to view details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event); // Populate newEvent with the selected event for editing
    setOpen(true);
    setIsViewMode(true); // Switch to view mode
  };

  // Edit the selected event
  const handleEditEvent = () => {
    setOpen(true);
    setIsViewMode(false); // Switch to edit mode
  };

  // Delete the selected event
  const handleDeleteEvent = () => {
    setEvents(events.filter(e => e !== selectedEvent));
    setOpen(false);
    setSelectedEvent(null); // Reset selectedEvent after deletion
  };

  // Function to handle small calendar (date input) changes
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // You can add functionality to jump to this date in the main calendar if needed
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', height: '100vh' }}>
      <div style={{ padding: '100px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { 
            setNewEvent({
              title: '',
              description: '',
              file: null,
              start: selectedDate, // Set start to the selected date
              end: selectedDate,   // Set end to the selected date
              color: '#2196F3'
            });
            setOpen(true); 
            setIsViewMode(false); 
          }} // Open dialog to add new task
          fullWidth
        >
          TASK
        </Button>
        <div style={{ marginTop: '20px' }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateCalendar
              date={selectedDate}
              onChange={(newDate) => handleDateChange(newDate)}
              sx={{ width: '100%' }}
              showDaysOutsideCurrentMonth fixedWeekNumber={6}
              views={['day']}
            />
          </LocalizationProvider>
        </div>
      </div>

      <div>
        <Calendar
          localizer={localizer}
          events={events.map(event => ({ ...event, color: event.color || '#2196F3' }))} // Ensure each event has a color
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            event: ({ event }) => (
              <Tooltip title={`Time: ${moment(event.start).format('LT')}`}>
                <span style={{ color: event.color }}>{event.title}</span>
              </Tooltip>
            ),
          }}
          style={{ height: '700px' }}
        />
      </div>

      {/* Unified Dialog for Viewing, Adding, and Editing an Event */}
      <Dialog open={open} onClose={handleClose} className="dialog-container" maxWidth="xs" fullWidth>
        <DialogTitle className="dialog-title">
          {isViewMode ? "Event Details" : (selectedEvent ? "Edit Event" : "Add Event")}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: '15px' }}>
            {isViewMode ? (
              <p><strong>Title:</strong> {newEvent.title}</p>
            ) : (
              <Input
                placeholder="Add Title"
                inputProps={ariaLabel}
                autoFocus
                margin="dense"
                fullWidth
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div>{moment(selectedDate || newEvent.start).format('dddd, MMMM DD')}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            {isViewMode ? (
              <p><strong>Description:</strong> {newEvent.description}</p>
            ) : (
              <Input
                placeholder="Add Description"
                inputProps={ariaLabel}
                margin="dense"
                fullWidth
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            )}
          </div>

          {isViewMode && (
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Time:</strong> {moment(newEvent.start).format('LT')}</p>
            </div>
          )}

          {!isViewMode && (
            <div className="color-options" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
              {['#f44336', '#2196F3', '#4CAF50', '#FF9800'].map((color) => (
                <div key={color} style={{ position: 'relative' }}>
                  <span
                    style={{
                      backgroundColor: color,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: '2px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => setNewEvent({ ...newEvent, color })}
                  />
                  {newEvent.color === color && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '38%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px' // Adjust size as needed
                      }}
                    >
                      ✔ {/* Checkmark */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            {isViewMode ? (
              newEvent.file && (
                <div>
                  <strong>Attached File:</strong>
                  {newEvent.file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(newEvent.file)}
                      alt="event attachment"
                      style={{ maxWidth: '100%', marginTop: '10px' }}
                    />
                  ) : (
                    <p>
                      <a href={URL.createObjectURL(newEvent.file)} target="_blank" rel="noopener noreferrer">
                        View Attached File
                      </a>
                    </p>
                  )}
                </div>
              )
            ) : (
              <input type="file" onChange={handleFileChange} style={{ marginTop: '15px' }} />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {isViewMode ? (
            <>
              <Button onClick={handleEditEvent} color="primary">
                Edit
              </Button>
              <Button onClick={handleDeleteEvent} color="secondary">
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={handleAddOrEditEvent} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyCalendar;
