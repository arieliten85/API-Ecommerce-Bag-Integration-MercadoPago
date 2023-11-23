import { AppModule } from "../../../app.module";
import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../user/aplication/repository/user.repository";
import * as request from "supertest";
import { userMock } from "./mocks/userMocks";
import { JwtService } from "@nestjs/jwt";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { EmailService } from "../../../email/services/email.service";

describe("Auth - [/auth]", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockedUserRepository = {
    finByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useValue(mockedUserRepository)
      .compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    emailService = moduleRef.get<EmailService>(EmailService);
    app = moduleRef.createNestApplication();

    await app.init();
  });
  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
  describe("Register - [POST auth/register]", () => {
    it("It should display an message User created successfully ", async () => {
      const dataUserRegister = userMock.dataUserRegister;
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce(null);

      jest
        .spyOn(mockedUserRepository, "create")
        .mockResolvedValueOnce({ statusCode: 201 });

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(dataUserRegister);

      expect(response.body.message).toEqual("User created successfully");
    });
    it("It should display an message Email already exists ", async () => {
      const dataUserRegister = userMock.dataUserRegister;
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "testssss@correo.com" });

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(dataUserRegister);

      expect(response.body.message).toEqual("Email already exists");
    });
  });
  describe("Login - [POST auth/login]", () => {
    it("It should display an accesse token", async () => {
      const dataUserLogin = userMock.dataUserLogin;
      const dataUserFindByEmail = userMock.dataUserFindByEmail;

      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce(dataUserFindByEmail);

      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send(dataUserLogin);

      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      const isJwtFormatValid = jwtRegex.test(response.body.access_token);

      expect(isJwtFormatValid).toBe(true);
      expect(response.body).hasOwnProperty("access_token");
    });
    it("It should display an message User invalid", async () => {
      const dataUserLogin = userMock.dataUserLogin;

      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post("/auth/login")

        .send(dataUserLogin);
      expect(response.body.message).toEqual("User invalid");
    });
  });
  describe("Confirm-email - [POST auth/confirm-email]", () => {
    it("It should display an message Confirmed account", async () => {
      const payload = { email: "test_email@correo.com" };

      jest.spyOn(jwtService, "verifyAsync").mockResolvedValue(payload);

      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "test_email@correo.com" });
      jest
        .spyOn(mockedUserRepository, "update")
        .mockResolvedValueOnce({ statusCode: 200 });

      const response = await request(app.getHttpServer())
        .post("/auth/confirm-email")
        .send({ token: "token_test" })
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toEqual("Successful operation.");
    });
    it("It should display an message Your account is already confirmed ", async () => {
      const payload = { email: "test_email@correo.com" };

      jest.spyOn(jwtService, "verifyAsync").mockResolvedValue(payload);
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ isEmailActive: true });

      const response = await request(app.getHttpServer())
        .post("/auth/confirm-email")
        .send({ token: "token_test" })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual(
        "Your account is already confirmed.",
      );
    });
    it("It should display an message Token has expired ", async () => {
      const expirationDate = new Date();
      jest
        .spyOn(jwtService, "verifyAsync")
        .mockRejectedValue(
          new TokenExpiredError("Token expired", expirationDate),
        );

      const response = await request(app.getHttpServer())
        .post("/auth/confirm-email")
        .send({ token: "token_test" })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual("Token has expired");
    });
    it("It should display an message Invalid token", async () => {
      jest
        .spyOn(jwtService, "verifyAsync")
        .mockRejectedValue(new JsonWebTokenError("Invalid token"));

      const response = await request(app.getHttpServer())
        .post("/auth/confirm-email")
        .send({ token: "token_test" })
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toEqual("Invalid token");
    });
  });
  describe("reSendConfirmAccount - [POST auth/resend-confirm-email]", () => {
    it("It should display an message Successful operation", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "test_email@correo.com" });

      jest
        .spyOn(emailService, "sendUserEmail_reconfirmAcound")
        .mockResolvedValueOnce({ success: true });

      const response = await request(app.getHttpServer())
        .post("/auth/resend-confirm-email")
        .send({ email: "test_email@correo.com" })
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toEqual("Successful operation.");
    });
    it("It should display an message Email does not exist", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post("/auth/resend-confirm-email")
        .send({ email: "test_email@correo.com" })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual("Email does not exist");
    });
    it("It should display an message Operation could not be completed.", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "test_email@correo.com" });

      jest
        .spyOn(emailService, "sendUserEmail_reconfirmAcound")
        .mockResolvedValueOnce({ success: false });

      const response = await request(app.getHttpServer())
        .post("/auth/resend-confirm-email")
        .send({ email: "test_email@correo.com" })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        "Operation could not be completed.",
      );
    });
  });
  describe("sendPasswordReset - [POST auth/send-password-reset-email]", () => {
    it("It should display an message Successful operation", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "test_email@correo.com" });

      jest
        .spyOn(emailService, "sendUserEmail_resetPassword")
        .mockResolvedValueOnce({ success: true });

      const response = await request(app.getHttpServer())
        .post("/auth/send-password-reset-email")
        .send({ email: "test_email@correo.com" })
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toEqual("Successful operation.");
    });
    it("It should display an message  Email does not exist", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post("/auth/send-password-reset-email")
        .send({ email: "test_email@correo.com" });

      expect(response.body.message).toEqual("Email does not exist");
    });
    it("It should display an message Operation could not be completed.", async () => {
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email: "test_email@correo.com" });

      jest
        .spyOn(emailService, "sendUserEmail_resetPassword")
        .mockResolvedValueOnce({ success: false });

      const response = await request(app.getHttpServer())
        .post("/auth/send-password-reset-email")
        .send({ email: "test_email@correo.com" })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        "Operation could not be completed.",
      );
    });
  });
  describe("resetPassword - [POST auth/reset-password]", () => {
    it("It should display an message Successful operation", async () => {
      const email = "test_email@correo.com";
      const payload = { email };
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValue(payload);
      jest
        .spyOn(mockedUserRepository, "finByEmail")
        .mockResolvedValueOnce({ email });

      jest
        .spyOn(mockedUserRepository, "update")
        .mockResolvedValueOnce({ statusCode: 200 });

      const response = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send({ token: "token_test", password: "password_test" })
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toEqual("Successful operation.");
    });
    it("It should display an message Token has expired ", async () => {
      const expirationDate = new Date();
      jest
        .spyOn(jwtService, "verifyAsync")
        .mockRejectedValue(
          new TokenExpiredError("Token expired", expirationDate),
        );

      const response = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send({ token: "token_test", password: "password_test" })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual("Token has expired");
    });
    it("It should display an message Invalid token", async () => {
      jest
        .spyOn(jwtService, "verifyAsync")
        .mockRejectedValue(new JsonWebTokenError("Invalid token"));

      const response = await request(app.getHttpServer())
        .post("/auth/reset-password")
        .send({ token: "token_test", password: "password_test" })
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toEqual("Invalid token");
    });
  });
});
