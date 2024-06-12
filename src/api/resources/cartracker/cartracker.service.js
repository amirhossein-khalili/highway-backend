import config from '../../../config/config.js';

import {
  lineString,
  point as _point,
  booleanPointOnLine,
  nearestPointOnLine,
  distance as _distance,
} from '@turf/turf';

class CartrackerService {
  static calculateDistance = (point1, point2) => {
    try {
      const [lon1, lat1] = point1;
      const [lon2, lat2] = point2;
      const R = 6371e3; // meters
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  };

  static isPointOnLineString = (inputPoint, inputLine) => {
    try {
      const threshold = config.threshold;
      const line = lineString(inputLine);
      const point = _point(inputPoint);

      const isOnLine = booleanPointOnLine(point, line);
      const nearestPoint = nearestPointOnLine(line, point);
      const distance = _distance(point, nearestPoint, { units: 'kilometers' });
      const isNearLine = distance <= threshold;

      return { distance: distance, isNearLine: isNearLine, isOnLine: isOnLine };
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  };
}

export default CartrackerService;
