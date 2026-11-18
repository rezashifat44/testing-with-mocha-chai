import axios from "axios";
import { expect } from "chai";
import dotenv from "dotenv";
import { setEnvValue, getEnvValue } from "../utils/envUtils.js";
import { faker } from "@faker-js/faker";
import { randomNum } from "../utils/randomNumUtils.js";

dotenv.config();

const baseUrl = process.env.baseUrl;
let adminAccessToken = getEnvValue("adminAccessToken");
let X_AUTH_SECRET_KEY = getEnvValue("X_AUTH_SECRET_KEY");
//console.log("Base URL:", `${baseUrl}/user/login`);
//console.log("X-AUTH-SECRET-KEY:", X_AUTH_SECRET_KEY);

describe("Admin login", () => {

    it("Verify that admin can not login with wrong credentials ", async () => {
        let response;
        try {
            response = await axios.post(`${baseUrl}/user/login`, {
                "email": "admin@dmoney.com",
                "password": "4321"
            },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (error) {
            response = error.response;
        }
        expect(response.status).to.equal(401);
    });




    it("Verify that admin can login successfully with valid credentials ", async () => {
        const response = await axios.post(`${baseUrl}/user/login`, {
            "email": "admin@dmoney.com",
            "password": "1234"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        expect(response.status).to.equal(200);
        // Save the admin token to .env as adminAccessToken
        setEnvValue("adminAccessToken", response.data.token);
    });
});

describe("Admin create users", () => {
    it("Verify admin is able to create customer 1 with role Customer", async () => {
        const response = await axios.post(`${baseUrl}/user/create`, {
            "name": `${faker.person.fullName()}`,
            "email": `r03.shifat+${randomNum(1000, 9999)}@gmail.com`,
            "password": "1234",
            "phone_number": `017${randomNum(10000000, 99999999)}`,
            "nid": "9876543210",
            "role": "Customer"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(201);

        setEnvValue("customer1Id", response.data.user.id);
        setEnvValue("customer1PhoneNumber", response.data.user.phone_number);
    });

    it("Verify admin is able to create customer 2 with role Customer", async () => {
        const response = await axios.post(`${baseUrl}/user/create`, {
            "name": `${faker.person.fullName()}`,
            "email": `r03.shifat+${randomNum(1000, 9999)}@gmail.com`,
            "password": "1234",
            "phone_number": `017${randomNum(10000000, 99999999)}`,
            "nid": "9876543210",
            "role": "Customer"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(201);

        setEnvValue("customer2Id", response.data.user.id);
        setEnvValue("customer2PhoneNumber", response.data.user.phone_number);
    });

    it("Verify admin is able to create agent with role Agent", async () => {
        const response = await axios.post(`${baseUrl}/user/create`, {
            "name": `${faker.person.fullName()}`,
            "email": `r03.shifat+${randomNum(1000, 9999)}@gmail.com`,
            "password": "1234",
            "phone_number": `017${randomNum(10000000, 99999999)}`,
            "nid": "9876543210",
            "role": "Agent"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(201);

        setEnvValue("agentId", response.data.user.id);
        setEnvValue("agentPhoneNumber", response.data.user.phone_number);
    });

    it("Verify admin is able to create merchant with role Merchant", async () => {
        const response = await axios.post(`${baseUrl}/user/create`, {
            "name": `${faker.person.fullName()}`,
            "email": `r03.shifat+${randomNum(1000, 9999)}@gmail.com`,
            "password": "1234",
            "phone_number": `017${randomNum(10000000, 99999999)}`,
            "nid": "9876543210",
            "role": "Merchant"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(201);


        setEnvValue("merchantId", response.data.user.id);
        setEnvValue("merchantPhoneNumber", response.data.user.phone_number);
    });

    it("Verify that duplicate user create fails ", async () => {
        let response;
        try {
            response = await axios.post(`${baseUrl}/user/create`, {
                "name": `${faker.person.fullName()}`,
                "email": `r03.shifat+${randomNum(1000, 9999)}@gmail.com`,
                "password": "1234",
                "phone_number": getEnvValue("customer1PhoneNumber"),
                "nid": "9876543210",
                "role": "Customer"
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${adminAccessToken}`,
                        "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
                    }
                }
            );
        } catch (error) {
            response = error.response;
        }
        expect(response.status).to.equal(208);
    });

});

describe("Admin activate users", () => {
    it("Verify admin is able to activate customer 1", async () => {
        const response = await axios.patch(`${baseUrl}/user/update/${getEnvValue("customer1Id")}`, {
            "status": "active"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(200);

    });

    it("Verify admin is able to activate customer 2", async () => {
        const response = await axios.patch(`${baseUrl}/user/update/${getEnvValue("customer2Id")}`, {
            "status": "active"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(200);

    });

    it("Verify admin is able to activate agent", async () => {
        const response = await axios.patch(`${baseUrl}/user/update/${getEnvValue("agentId")}`, {
            "status": "active"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(200);

    });

    it("Verify admin is able to activate merchant", async () => {
        const response = await axios.patch(`${baseUrl}/user/update/${getEnvValue("merchantId")}`, {
            "status": "active"
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`

                }
            }
        );
        expect(response.status).to.equal(200);

    });
});

describe("Other users login", () => {
    it("Verify OTP is requested when the customer 1 logs in", async () => {
        const response = await axios.post(`${baseUrl}/user/login`, {
            "email": getEnvValue("customer1PhoneNumber"),
            "password": "1234"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        expect(response.status).to.equal(200);
    });

    it("Verify the cutomer 1 is able to login with OTP", async () => {
        const response = await axios.post(`${baseUrl}/user/verify-otp?env=dev`, {
            "identifier": getEnvValue("customer1PhoneNumber"),
            "otp": "0000"
        });

        expect(response.status).to.equal(200);

        setEnvValue("customer1AccessToken", response.data.token);
    });

    it("Verify OTP is requested when the cutomer 2 logs in", async () => {
        const response = await axios.post(`${baseUrl}/user/login`, {
            "email": getEnvValue("customer2PhoneNumber"),
            "password": "1234"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        expect(response.status).to.equal(200);
    });

    it("Verify the customer 2 is able to login with OTP", async () => {
        const response = await axios.post(`${baseUrl}/user/verify-otp?env=dev`, {
            "identifier": getEnvValue("customer2PhoneNumber"),
            "otp": "0000"
        });

        expect(response.status).to.equal(200);

        // Save the customer 2 token to .env as customer2AccessToken
        setEnvValue("customer2AccessToken", response.data.token);
    });

    it("Verify OTP is requested when the agent logs in", async () => {
        const response = await axios.post(`${baseUrl}/user/login`, {
            "email": getEnvValue("agentPhoneNumber"),
            "password": "1234"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        expect(response.status).to.equal(200);
    });

    it("Verify the agent is able to login with OTP", async () => {
        const response = await axios.post(`${baseUrl}/user/verify-otp?env=dev`, {
            "identifier": getEnvValue("agentPhoneNumber"),
            "otp": "0000"
        });

        expect(response.status).to.equal(200);

        setEnvValue("agentAccessToken", response.data.token);
    });

    it("Verify SYSTEM is able to login with correct credentials", async () => {
        const response = await axios.post(`${baseUrl}/user/login`, {
            "email": "system@dmoney.com",
            "password": "1234"
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        expect(response.status).to.equal(200);
        setEnvValue("systemAccessToken", response.data.token);
    });
});

describe("Transaction money", () => {
    it("Verify System can deposit to agent and the deposit amount is 5000 tk", async () => {
        const response = await axios.post(`${baseUrl}/transaction/deposit`, {
            "from_account": "SYSTEM",
            "to_account": getEnvValue("agentPhoneNumber"),
            "amount": 5000
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvValue("systemAccessToken")}`,
                "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
            }
        });
        expect(response.status).to.equal(201);
        expect(response.data.amount).to.equal(5000);
    });

    it("Verify that deposit is rejected when no token is sent", async () => {
        let response;
        try {
            response = await axios.post(`${baseUrl}/transaction/deposit`, {
                "from_account": getEnvValue("agentPhoneNumber"),
                "to_account": getEnvValue("customer1PhoneNumber"),
                "amount": 2000
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
                }
            });

        }
        catch (error) {
            response = error.response;
        }

        expect(response.status).to.equal(401);

    });
    it("Verify that agent can deposit to customer1, and commission is 2.5% of 2000 (50 tk)", async () => {
        const response = await axios.post(`${baseUrl}/transaction/deposit`, {
            "from_account": getEnvValue("agentPhoneNumber"),
            "to_account": getEnvValue("customer1PhoneNumber"),
            "amount": 2000
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvValue("agentAccessToken")}`,
                "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
            }
        });
        expect(response.status).to.equal(201);
        expect(response.data.commission).to.equal(2000 * 0.025);
    });

    it("Verify that customer 1 can send money to customer 2 and the service fee is 5 tk", async () => {
        const response = await axios.post(`${baseUrl}/transaction/sendmoney`, {
            "from_account": getEnvValue("customer1PhoneNumber"),
            "to_account": getEnvValue("customer2PhoneNumber"),
            "amount": 1000
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvValue("customer1AccessToken")}`,
                "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
            }
        });
        expect(response.status).to.equal(201);
        expect(response.data.fee).to.equal(5);
    });



    it("Verify a user cannot make a deposit from another user's account", async () => {
        let response;
        try {
            response = await axios.post(`${baseUrl}/transaction/sendmoney`, {
                "from_account": getEnvValue("customer1PhoneNumber"),
                "to_account": getEnvValue("customer2PhoneNumber"),
                "amount": 1000
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getEnvValue("agentAccessToken")}`,
                    "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
                }
            });
        }
        catch (error) {
            response = error.response;

        }

        expect(response.status).to.equal(403);

    });

    it("Verify that customer 2 can withdraw money from agent and the service fee is 1%", async () => {
        const response = await axios.post(`${baseUrl}/transaction/withdraw`, {
            "from_account": getEnvValue("customer2PhoneNumber"),
            "to_account": getEnvValue("agentPhoneNumber"),
            "amount": 500
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvValue("customer2AccessToken")}`,
                "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
            }
        });
        //console.log("Withdraw response:", response.status, response.data);
        expect(response.status).to.equal(201);
        expect(response.data.message).to.contains("Withdraw successful")
        expect(response.data.fee).to.eql(Math.max(500 * 0.01, 5));

    });

    it("Verify that customer 2 can make payment to merchant and the service fee is 1%", async () => {
        const response = await axios.post(`${baseUrl}/transaction/payment`, {
            "from_account": getEnvValue("customer2PhoneNumber"),
            "to_account": getEnvValue("merchantPhoneNumber"),
            "amount": 400
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvValue("customer2AccessToken")}`,
                "X-AUTH-SECRET-KEY": `${getEnvValue("X_AUTH_SECRET_KEY")}`
            }
        });
        expect(response.status).to.equal(201);
        expect(response.data.message).to.contains("Payment successful")
        expect(response.data.fee).to.eql(Math.max(400 * 0.01, 5));

    });
});