class CartrackerHelper {
  static async convertToPolygonCoordinates(coordinatesArray) {
    try {
      let mainArr = [];
      for (const array of coordinatesArray) {
        for (const arr of array) {
          mainArr.push(arr);
        }
      }

      // Ensure the polygon is closed by adding the first coordinate at the end
      if (mainArr.length > 0 && mainArr[0] !== mainArr[mainArr.length - 1]) {
        mainArr.push(mainArr[0]);
      }

      return [mainArr];
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default CartrackerHelper;
