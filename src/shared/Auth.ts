import axios from "axios";
import bcrypt from "bcryptjs";

export async function checkAppPassword(password: string): Promise<boolean> {
  const response = await axios.get("settings.json");
  const hash = response.data.appPasswordHashBcrypt;
  return await bcrypt.compare(password, hash);
}
