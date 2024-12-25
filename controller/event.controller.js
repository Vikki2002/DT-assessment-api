import { ObjectId } from "mongodb";
import { getDatabase } from "../db/db.js";

// console.log("ljllkl",db)

export const postEvent = async (req, res) => {
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;

    // Validate required fields
    if (!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the new event object
    const newEvent = {
        name,
        tagline,
        schedule: new Date(schedule), // Ensure schedule is stored as a valid Date object
        description,
        files: { image: req.file ? req.file.path : null }, // File path if file is uploaded
        moderator,
        category,
        sub_category,
        rigor_rank: parseInt(rigor_rank, 10), // Convert rigor_rank to an integer
        attendees: [], // Default attendees array
        type: 'event', // Fixed type field
    };


    try {
        const database = getDatabase();
        const result = await database.collection('events').insertOne(newEvent);
        res.status(200).json({ id: result.insertedId });
    } catch (error) {
        console.error('Error inserting event:', error); // Log any insertion errors
        res.status(500).json({ message: 'Error creating event', error }); // Return error response
    }
};

export const getEventsBtIdAndLatest = async (req, res) => {
    const { id, type, limit, page } = req.query;
    const database = getDatabase();
    try {
      if (id) {
        const event = await database.collection('events').findOne({ _id: new ObjectId(id) });
        if (event) {
          res.status(200).json(event);
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
      } else if (type === 'latest') {
        const events = await database.collection('events')
          .find()
          .sort({ schedule: -1 })
          .skip((page - 1) * parseInt(limit, 10))
          .limit(parseInt(limit, 10))
          .toArray();
        res.status(200).json(events);
      } else {
        res.status(400).json({ message: 'Invalid query parameters' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        tagline,
        schedule,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank,
    } = req.body;

    try {
        const updatedEvent = {
            $set: {
                name,
                tagline,
                schedule,
                description,
                files: { image: req.file ? req.file.path : null },
                moderator,
                category,
                sub_category,
                rigor_rank: parseInt(rigor_rank, 10),
            },
        };
        const database = getDatabase();
        const result = await database.collection('events').updateOne({ _id: new ObjectId(id) }, updatedEvent);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
}

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const database = getDatabase();
        const result = await database.collection('events').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
}