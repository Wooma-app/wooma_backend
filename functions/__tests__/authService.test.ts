import { verifyOtp } from "../src/services/authService";
import * as admin from "firebase-admin";

// Mock Firebase Admin SDK
jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    createUser: jest.fn(),
  }),
}));

describe("sendOtp", () => {
  it("should call createUser with the correct phone number", async () => {
    const mockPhoneNumber = "+1234567890";
    const mockUid = "mock-uid";

    // Mock the response of createUser
    const createUserMock = jest.spyOn(admin.auth(), "createUser");
    createUserMock.mockResolvedValueOnce({
        uid: mockUid,
        emailVerified: false,
        disabled: false,
        metadata: {
            creationTime: "mockTime",
            lastSignInTime: "mockTime",
            toJSON: jest.fn().mockReturnValue({
              creationTime: "mockTime",
              lastSignInTime: "mockTime",
            }),
        },
        providerData: [],
        toJSON: jest.fn(),
    });

    const {user} = await verifyOtp(mockPhoneNumber);

    expect(createUserMock).toHaveBeenCalledWith({ phoneNumber: mockPhoneNumber });
    expect(user.uid).toBe(mockUid);
  });

  it("should throw an error when createUser fails", async () => {
    const mockPhoneNumber = "+1234567890";
    const errorMessage = "Failed to create user";

    const createUserMock = jest.spyOn(admin.auth(), "createUser");
    createUserMock.mockRejectedValueOnce(new Error(errorMessage));

    await expect(verifyOtp(mockPhoneNumber)).rejects.toThrow(errorMessage);
  });
});