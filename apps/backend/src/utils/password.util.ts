import bcrypt from "bcryptjs";

// ฟังก์ชันสำหรับเข้ารหัสผ่าน
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// ฟังก์ชันสำหรับตรวจสอบรหัสผ่านว่าตรงกันไหม
export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
