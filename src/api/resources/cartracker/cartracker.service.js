import config from '../../../config/config.js';

import {
  lineString,
  point as _point,
  booleanPointOnLine,
  nearestPointOnLine,
  distance as _distance,
} from '@turf/turf';

class CartrackerService {
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

  static calculateDistanceAndCompare = (point1, point2, threshold) => {
    try {
      // Convert input points to turf.js points
      const pt1 = _point(point1);
      const pt2 = _point(point2);

      // Calculate the distance between points in kilometers
      const distance = _distance(pt1, pt2, { units: 'kilometers' });

      // Check if the distance is less than, equal to, or greater than the threshold
      let comparisonResult = '';
      if (distance < threshold) {
        comparisonResult = 'less';
      } else if (distance > threshold) {
        comparisonResult = 'greater';
      } else {
        comparisonResult = 'equal';
      }

      // Return the distance and comparison result
      return { distance: distance, comparisonResult: comparisonResult };
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  };

  static calculateDistance = (point1, point2) => {
    try {
      // Convert input points to turf.js points
      const pt1 = _point(point1);
      const pt2 = _point(point2);

      // Calculate the distance between points in kilometers
      const distance = _distance(pt1, pt2, { units: 'kilometers' });

      // Return the distance and comparison result
      return { distance: distance };
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  };
}

export default CartrackerService;
