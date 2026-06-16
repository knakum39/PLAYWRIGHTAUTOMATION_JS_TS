class APIUtils
{
    //Create Constructor for apiContext
    constructor(apiContext, loginPayLoad)
    {
            this.apiContext = apiContext; //We created local api context object.., so it can be accessed across this current class.
            this.loginPayLoad = loginPayLoad;
        }

    async getToken()
    {
        // ======================================================
        // LOGIN API CALL
        // ======================================================

        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            {
            data: this.loginPayLoad
            }
        );

        // Convert API response into JSON object
        const loginResponseJson = await loginResponse.json();

        // Extract token from login response
        const token = loginResponseJson.token;

        // Print token in console
        console.log(token);
        return token;

    }

 async createOrder(orderPayLoad)
    {
// ======================================================
  // CREATE ORDER API CALL
  // ======================================================

  let response = {};
  response.token = await this.getToken();

  const orderResponse = await this.apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data : orderPayLoad,
      headers : {
        'Authorization': response.token,
        'Content-Type': "application/json"
      }
    }
  );

  // Convert order response into JSON object
  const orderResponseJson = await orderResponse.json();
  console.log("Order Response:");
  console.log(orderResponseJson);

  // Extract first order ID from orders array
  const orderID = orderResponseJson.orders[0];

  response.orderID = orderID;
  return response;

    }

}

module.exports = {APIUtils};
//This class is vissible across all files in this project.