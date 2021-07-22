import axios from "axios";
import bcrypt from "bcryptjs";

import { checkAppPassword } from "@/shared/Auth";

const password = "foobar";
const passwordHash = bcrypt.hashSync(password);

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({
  data: { appPasswordHashBcrypt: passwordHash },
});

describe("checkAppPassword", () => {
  test("returns true if password is correct", async () => {
    const actual = await checkAppPassword(password);
    await expect(actual).toBeTruthy();
  });
  test("returns false if password is incorrect", async () => {
    const wrongPassword = "barfoo";
    const actual = await checkAppPassword(wrongPassword);
    await expect(actual).toBeFalsy();
  });
});
