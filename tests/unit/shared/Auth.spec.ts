import axios from "axios";
import bcrypt from "bcryptjs";

import { checkPassphrase } from "@/shared/Auth";

const passphrase = "foobar";
const passphraseHash = bcrypt.hashSync(passphrase);

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({
  data: { passphraseHashBcrypt: passphraseHash },
});

describe("check", () => {
  test("returns true if passphrase is correct", async () => {
    const actual = await checkPassphrase(passphrase);
    await expect(actual).toBeTruthy();
  });
  test("returns false if passphrase is incorrect", async () => {
    const wrongPassphrase = "barfoo";
    const actual = await checkPassphrase(wrongPassphrase);
    await expect(actual).toBeFalsy();
  });
});
