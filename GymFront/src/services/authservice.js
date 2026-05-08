import { users } from "../data/users";

function safeParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

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
  const auth = safeParse(localStorage.getItem("auth"));

  if (auth?.token && auth?.role) {
    return auth;
  }

  const token = safeParse(localStorage.getItem("token"));
  const role = safeParse(localStorage.getItem("role"));

  const normalizedToken = token?.token ?? token;
  const normalizedRole = role?.role ?? role;

  if (normalizedToken || normalizedRole) {
    return {
      token: normalizedToken,
      role: normalizedRole,
    };
  }

  return null;
};
