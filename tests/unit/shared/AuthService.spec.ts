import axios from "axios";
import bcrypt from "bcrypt";

import AuthService from "@/shared/AuthService";

const passphrase = "foobar";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({
  data: { passphraseHashBcrypt: bcrypt.hashSync(passphrase, 10) },
});

describe("check", () => {
  test("returns true if passphrase is correct", async () => {
    const authService = new AuthService();
    const actual = await authService.check(passphrase);
    await expect(actual).toBeTruthy();
  });
  test("returns false if passphrase is incorrect", async () => {
    const authService = new AuthService();
    const wrongPassphrase = "barfoo";
    const actual = await authService.check(wrongPassphrase);
    await expect(actual).toBeFalsy();
  });
});
