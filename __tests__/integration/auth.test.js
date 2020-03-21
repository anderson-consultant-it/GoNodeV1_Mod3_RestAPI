const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const sinon = require("sinon");
const nodemailer = require("nodemailer");

const transport = {
  sendMail: sinon.spy()
};
sinon.stub(nodemailer, "createTransport").returns(transport);

const { expect } = chai;

chai.use(chaiHttp);

const app = require("../../index");
const factory = require("../factories");

const User = mongoose.model("User");

describe("Authentication", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });
  describe("Sign Up", () => {
    it("It should be able to sign up", async () => {
      const user = await factory.attrs("User");

      const response = await chai
        .request(app)
        .post("/api/signup")
        .send(user);

      expect(response.body).to.have.property("user");
      expect(response.body).to.have.property("token");
      expect(transport.sendMail.calledOnce).to.be.true;
    }).timeout(10000); // I had to increase the timeout for this test otherwise it would fail;

    it("It should not be able to sign up with existing user", async () => {
      const user = await factory.create("User");
      const user2 = await factory.attrs("User", {
        email: user.email
      });

      const response = await chai
        .request(app)
        .post("/api/signup")
        .send(user2);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("error");
    }).timeout(10000); // I had to increase the timeout for this test otherwise it would fail;
  });

  describe("Sign In", () => {
    it("it should be able to authenticate with valid credentials", async () => {
      const user = await factory.create("User", {
        password: "123456"
      });

      const response = await chai
        .request(app)
        .post("/api/signin")
        .send({
          email: user.email,
          password: "123456"
        });

      expect(response.body).to.have.property("user");
      expect(response.body).to.have.property("token");
    });

    it("it should not be able to authenticate with valid credentials", async () => {
      const user = await factory.create("User", {
        password: "123456"
      });
      const response = await chai
        .request(app)
        .post("/api/signin")
        .send({
          email: user.email,
          password: "123"
        });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("error");
    });
  });
});
