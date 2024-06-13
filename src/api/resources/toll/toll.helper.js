class TollHelper {
  static getCloseTimePairs = (carTrackers, timeDiffInMinutes) => {
    try {
      const result = [];
      const timeDiffInMilliseconds = timeDiffInMinutes * 60 * 1000;

      for (let i = 0; i < carTrackers.length; i++) {
        for (let j = i + 1; j < carTrackers.length; j++) {
          const date1 = new Date(carTrackers[i].date);
          const date2 = new Date(carTrackers[j].date);
          const timeDiff = Math.abs(date1 - date2);
          if (timeDiff <= timeDiffInMilliseconds) {
            result.push([carTrackers[i], carTrackers[j]]);
          }
        }
      }

      return result;
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  };
}

export default TollHelper;
