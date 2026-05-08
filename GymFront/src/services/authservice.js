import { users } from "../data/users";

export const registerUser = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = users.find((u) => u.email === data.email);

      if (exists) {
        return reject(new Error("Email already exists"));
      }

      users.push(data);

      resolve({
        token: "fake-token-123",
        role: "MEMBER",
        memberId: users.length,
        name: data.name,
        expiresIn: 86400,
      });
    }, 500);
  });
};

export const loginUser = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === data.email && u.password === data.password,
      );

      if (!user) {
        return reject(new Error("Invalid email or password"));
      }

      resolve({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockMemberPayload.mockSignature",
        role: user.role || "MEMBER",
        memberId: 101,
        name: user.name,
        expiresIn: 86400,
      });
    }, 500);
  });
};

export const MygetAuth = () => {
  return JSON.parse(localStorage.getItem("auth"));
};
