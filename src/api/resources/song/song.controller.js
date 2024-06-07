import Song from './song.model.js';

class SongController {
  static selectionSong = 'title url rating';
  static selectionSongs = 'title url rating';

  static async create(req, res, next) {
    try {
      const newSong = new Song(req.body);
      await newSong.save();
      res.status(201).json(newSong);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        select: SongController.selectionSongs,
      };

      const songs = await Song.paginate({}, options);

      return res.json(songs);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const song = await Song.findById(req.params.id).select(SongController.selectionSongs);
      if (!song) return res.status(404).json({ message: 'song not found ' });
      return res.json(song);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const songUpdated = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!songUpdated) return res.status(404).json({ message: 'song not found ' });

      res.json(songUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const songRemoved = await Song.findByIdAndDelete(req.params.id);
      if (!songRemoved) return res.status(404).json({ message: 'song not found ' });
      res.json(songRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default SongController;
