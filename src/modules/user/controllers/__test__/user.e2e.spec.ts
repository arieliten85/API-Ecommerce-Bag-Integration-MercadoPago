import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { userMock } from "./mocks/userMocks";
import { USER_REPOSITORY } from "../../aplication/repository/user.repository";
import { AuthGuard } from "@nestjs/passport";

const URL = "/user/";
const USER_NOT_FOUND = "User not found";
const mockedUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
describe("USER - TESTING", () => {
  let app: INestApplication;
  const responseAuthGuard = {
    id: 1,
    email: "wokico1580@correo.com",
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useValue(mockedUserRepository)

      .overrideGuard(AuthGuard("jwt"))
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = responseAuthGuard;
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe("Create - [POST /users]", () => {
    it("should create a new user", async () => {
      const newUser = userMock.newUser;
      jest
        .spyOn(mockedUserRepository, "create")
        .mockResolvedValueOnce({ id: 3, ...newUser });

      const response = await request(app.getHttpServer())
        .post(URL)
        .send(newUser)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty("id");
      expect(response.body.first_name).toEqual(newUser.first_name);
      expect(response.body.last_name).toEqual(newUser.last_name);
      expect(response.body.email).toEqual(newUser.email);
    });
  });
  describe("FindAll - [GET /users]", () => {
    it("should retrieve all user", async () => {
      const allUserResponse = userMock.allUser;

      jest
        .spyOn(mockedUserRepository, "findAll")
        .mockResolvedValueOnce(allUserResponse);

      const response = await request(app.getHttpServer()).get(URL);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(allUserResponse.length);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("first_name");
      expect(response.body[0]).toHaveProperty("last_name");
      expect(response.body[0]).toHaveProperty("email");
    });
  });
  describe("FindById - [GET /users/:id]", () => {
    it("should find a user by ID", async () => {
      const userId = 1;
      const foundUser = userMock.oneUser;

      jest
        .spyOn(mockedUserRepository, "findById")
        .mockResolvedValueOnce(foundUser);

      const response = await request(app.getHttpServer())
        .get(`${URL}${userId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(foundUser);
    });
    it("should display an error message", async () => {
      const userId = 100;

      jest.spyOn(mockedUserRepository, "findById");

      const response = await request(app.getHttpServer())
        .get(`${URL}${userId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual(USER_NOT_FOUND);
    });
  });
  describe("Update - [PUT /users/:id]", () => {
    it("should update a user by ID", async () => {
      const userId = 1;
      const foundUser = userMock.oneUser;
      const updatedUserData = userMock.updatedUserData;

      jest
        .spyOn(mockedUserRepository, "findById")
        .mockResolvedValueOnce({ id: userId, ...foundUser });

      jest
        .spyOn(mockedUserRepository, "update")
        .mockResolvedValueOnce({ id: userId, ...updatedUserData });

      const response = await request(app.getHttpServer())
        .put(`${URL}${userId}`)
        .send(updatedUserData)
        .expect(HttpStatus.OK);

      expect(response.body.first_name).toEqual(updatedUserData.first_name);
    });
    it("should display an error message", async () => {
      const userId = 100;
      const updatedUserData = userMock.updatedUserData;

      jest.spyOn(mockedUserRepository, "findById").mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .put(`${URL}${userId}`)
        .send(updatedUserData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual(USER_NOT_FOUND);
    });
  });
  describe("Delete - [DELETE /users/:id]", () => {
    it("should Delete a user by ID", async () => {
      const userId = 1;
      const foundUser = userMock.oneUser;
      const deletedUserData = `The ID ${userId} has been deleted`;

      jest
        .spyOn(mockedUserRepository, "findById")
        .mockResolvedValueOnce({ id: userId, ...foundUser });

      jest
        .spyOn(mockedUserRepository, "delete")
        .mockResolvedValueOnce({ id: userId, deletedUserData });

      const response = await request(app.getHttpServer())
        .delete(`${URL}${userId}`)
        .send(deletedUserData)
        .expect(HttpStatus.ACCEPTED);

      expect(response.text).toEqual(deletedUserData);
    });
    it("should display an error message", async () => {
      const userId = 100;
      const deletedUserData = `The ID ${userId} has been deleted`;

      jest.spyOn(mockedUserRepository, "findById").mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .delete(`${URL}${userId}`)

        .send(deletedUserData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual(USER_NOT_FOUND);
    });
  });
});
