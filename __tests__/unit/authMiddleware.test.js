const chai = require('chai');
const httpMock = require('node-mocks-http');
const sinon = require('sinon');

const factory = require('../factories');

const authMiddleware = require('../../app/middlewares/auth');

const { expect } = chai;

describe('Auth Middleware', () => {
  it('it should validate the presente of the JWT token', async () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('it should FAIL if JWT token is NOT VALID', async () => {
    const request = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 123123',
      },
    });


    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('it should PASS if JWT token is VALID', async () => {
    const user = await factory.create('User');

    const request = httpMock.createRequest({
      headers: {
        authorization: `Bearer ${user.generateToken()}`,
      },
    });

    const response = httpMock.createResponse();
    const nextSpy = sinon.spy();

    await authMiddleware(request, response, nextSpy);

    expect(request).to.include({ userId: user.id });
    expect(nextSpy.calledOnce).to.be.true;
  });
});
