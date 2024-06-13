import Station from '../station/station.model.js';
import Cartracker from '../cartracker/cartracker.model.js';
import CartrackerService from '../cartracker/cartracker.service.js';
import TollHelper from './toll.helper.js';

class TollService {
  static selectionCartracker = 'car location date';
  static selectionStation = 'name tollPerCross location';

  static async car(query) {
    try {
      const stations = await Station.find().select(TollService.selectionStation);
      const cartrackers = await Cartracker.find(query).select(TollService.selectionCartracker);
      let totalToll = 0;

      let tolls = [];
      for (const station of stations) {
        let cartrackerToll = [];

        //check station and cartrackers matches
        const stationCoordinates = station.location[0].coordinates;
        for (const cartracker of cartrackers) {
          const cartrackerCoordinates = cartracker.location[0].coordinates;
          const resp = CartrackerService.calculateDistanceAndCompare(
            stationCoordinates,
            cartrackerCoordinates,
            0.1
          );
          if (resp.comparisonResult == 'less') cartrackerToll.push(cartracker);
        }

        //format trackers to get trackers of the toll
        const formattedCartrackersStation = TollHelper.getCloseTimePairs(cartrackerToll, 20);
        for (const cartracker of formattedCartrackersStation) {
          tolls.push({
            cartracker: cartracker,
            station: station,
            toll: station.tollPerCross,
          });

          //calculate total toll
          totalToll = totalToll + station.tollPerCross;
        }
      }

      const result = { tolls: tolls, totalToll: totalToll };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

export default TollService;
