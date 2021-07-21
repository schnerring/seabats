import axios from "axios";
import bcrypt from "bcrypt";

export default class AuthService {
  async check(passphrase: string): Promise<boolean> {
    const response = await axios.get("settings.json");
    const passphraseHash = response.data.passphraseHashBcrypt;
    return await bcrypt.compare(passphrase, passphraseHash);
  }
}
