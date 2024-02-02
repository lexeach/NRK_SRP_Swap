

export const getPrice = async () => {
  const url = `https://test-api-4c9x.onrender.com/get-price`;
  const data = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.data) {
        console.log(data.data);
        return data.data;
      } else {
        return 778;
      }
    })
    .catch((error) => {
      return 778;
    });
  console.log("this is data", data);
  return data;
};

getPrice()
